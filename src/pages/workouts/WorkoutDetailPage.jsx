import React from 'react';
import ExerciseBlockSkeleton from './components/ExerciseBlockSkeleton';
import { useExerciseServices } from '../../services/exercises.service';
import { useWorkoutServices } from '../../services/workout.service';
import { LuDumbbell, LuPlus, LuTrash2 } from 'react-icons/lu';
import EmptyState from '../../shared/components/EmptyState';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import ExerciseBlock from './components/ExerciseBlock';
import Header from '../../shared/components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import Button from '../../shared/components/Button';
import BottomSheet from '../../shared/components/BottomSheet';
import { useWorkoutExerciseServices } from '../../services/workoutExercise.service';

const WorkoutDetailPage = () => {
    const { getWorkoutActiveExercises } = useWorkoutExerciseServices();
    const { getAllExercises } = useExerciseServices();
    const { getWorkout, finishWorkout, deleteWorkout } = useWorkoutServices();
    const { workoutId } = useParams();
    const [ loading, setLoading ] = useState(true);
    const [ workout, setWorkout ] = useState();
    const [openAddExerciseSheet, setOpenAddExerciseSheet] = useState(false);
    const [ activeExercises, setActiveExercises ] = useState([]);
    const [libraryExercises, setLibraryExercises] = useState([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

       useEffect(() => {
        const loadInitialData = async () => {
            if (!workoutId) return;
            setLoading(true);
            try {
                // 1. Fetch basic workout info
                const resWorkout = await getWorkout(workoutId);
                setWorkout(resWorkout.data);

                // 2. Fetch already persisted exercises (Routine + Extras with sets)
                const resExercises = await getWorkoutActiveExercises(workoutId);
                const dbExercises = resExercises.data;

                // 3. Hydrate "Ghost" extras from LocalStorage
                const localExtras = JSON.parse(localStorage.getItem(`pending_extras_${workoutId}`)) || [];

                // 4. Merge: only keep local extras that haven't been saved to DB yet
                const filteredExtras = localExtras.filter(extra => 
                    !dbExercises.some(dbEx => dbEx.exerciseId === extra.exerciseId)
                );

                // --- NUEVA LÓGICA DE FILTRADO (LISTA NEGRA) ---
                // Obtenemos los ejercicios que el usuario quitó manualmente de esta sesión
                const removedIds = JSON.parse(localStorage.getItem(`removed_exercises_${workoutId}`)) || [];

                // Combinamos todo y filtramos los que estén en la "lista negra"
                const mergedExercises = [...dbExercises, ...filteredExtras];
                const finalExercises = mergedExercises.filter(ex => !removedIds.includes(ex.exerciseId));

                setActiveExercises(finalExercises);
                // ----------------------------------------------

            } catch (error) {
                console.log(error);
                toast.error("Error al sincronizar el entrenamiento");
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [workoutId]);


    const handleAddExerciseToWorkout = (libraryEx) => {
        if (activeExercises.some(e => e.exerciseId === libraryEx.id)) {
            return toast.error("Este ejercicio ya está en la lista");
        }

        // --- NUEVA LÓGICA: Limpiar de la lista negra si existía ---
        const removedKey = `removed_exercises_${workoutId}`;
        const removed = JSON.parse(localStorage.getItem(removedKey) || "[]");
        if (removed.includes(libraryEx.id)) {
            const updatedRemoved = removed.filter(id => id !== libraryEx.id);
            localStorage.setItem(removedKey, JSON.stringify(updatedRemoved));
        }
        // ---------------------------------------------------------

        const newEntry = {
            exerciseId: libraryEx.id,
            exerciseName: libraryEx.name,
            exerciseType: libraryEx.type, 
            workoutExerciseId: null, 
            targetSets: null, 
            targetReps: null,
            targetWeight: null,
            exerciseAvatarThumbnail: libraryEx.avatarThumbnail
        };

        // 1. Get current extras and filter out the one we are adding (just in case)
        const existingExtras = JSON.parse(localStorage.getItem(`pending_extras_${workoutId}`)) || [];
        const filteredExtras = existingExtras.filter(e => e.exerciseId !== libraryEx.id);
        
        // 2. Save the fresh list
        localStorage.setItem(`pending_extras_${workoutId}`, JSON.stringify([...filteredExtras, newEntry]));

        // 3. Update UI
        setActiveExercises(prev => [...prev, newEntry]);
        setOpenAddExerciseSheet(false);
        toast.success(`${libraryEx.name} añadido`);
    };

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const res = await getAllExercises(); 
                setLibraryExercises(res.data);
            } catch (error) {
                console.error("Error cargando biblioteca", error);
            }
        };
        fetchLibrary();
    }, []);

    const filteredExercises = libraryExercises.filter(ex => 
        ex.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleFinishWorkout = async () => {
        try {
            const confirm = window.confirm("¿Estás seguro de que quieres finalizar el entrenamiento?");
            if (!confirm) return;

            // 1. Informamos al backend que cerramos la sesión
            await finishWorkout(workoutId);

            // 2. Limpieza total de rastros locales (Skipped y Extras)
            localStorage.removeItem(`pending_extras_${workoutId}`);

            // 3. Feedback visual y navegación
            toast.success("¡Entrenamiento completado!");
            navigate(`/workouts/${workoutId}/summary`);

        } catch (error){
            console.error("Error finishing workout:", error);
            toast.error(error?.response?.data?.message || "No se pudo finalizar el entrenamiento.");
        }
    };

    const handleDeleteWorkout = async () => {
        const confirm = window.confirm("¿Seguro que quieres borrar este entrenamiento? Se perderán todos los datos de hoy.");
        
        if (confirm) {
            try {
                await deleteWorkout(workoutId);
                
                localStorage.removeItem(`pending_extras_${workoutId}`);
                localStorage.removeItem(`workout_timer_${workoutId}`);
                
                toast.success("Sesión eliminada");
                navigate('/workouts');
            } catch {
                toast.error("No se pudo eliminar");
            }
        }
    };  

    const handleRemoveExercise = (exerciseId) => {
        // 1. Actualizamos el estado de React (esto activará el renderizado)
        setActiveExercises(prev => {
            const newState = prev.filter(ex => ex.exerciseId !== exerciseId);
            // Si este era el último, newState.length será 0 y verás el Empty State
            return newState;
        });

        // 2. Guardamos en la "Lista Negra" de LocalStorage
        const storageKey = `removed_exercises_${workoutId}`;
        const removed = JSON.parse(localStorage.getItem(storageKey) || "[]");
        
        if (!removed.includes(exerciseId)) {
            localStorage.setItem(storageKey, JSON.stringify([...removed, exerciseId]));
        }
    };


    return (
        <>
            <Header 
                showBack = {true}
                backTo={`/workouts`}
                title={workout?.name || `Entrenamiento`}
                rightAction={
                    <button 
                        className="p-2 text-red-500 active:scale-90 transition-transform cursor-pointer"
                        onClick={handleDeleteWorkout}
                        title="Eliminar entrenamiento"
                    >
                        <LuTrash2 size={20} />
                    </button>
                }
            />

            <div className="grid p-4">
                {loading ? (
                    [...Array(10)].map((_, i) => <ExerciseBlockSkeleton key={i} />)
                ) : activeExercises.length === 0 ? (
                    <EmptyState 
                        message="No hay ejercicios en este entrenamiento" 
                        icon={LuDumbbell} 
                    />
                ) : (
                    activeExercises.map(ex => 
                        <ExerciseBlock 
                            onRemove = {handleRemoveExercise}
                            key={ex.exerciseId}
                            exercise={ex} 
                            workout={workout}
                        />
                    )
                )}
                
                
                {!workout?.finishedAt && (<>
                    {/* Botón al final de la lista de ejercicios */}
                    <button 
                        onClick={() => setOpenAddExerciseSheet(true)}
                        className="w-full py-6 mt-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 group active:scale-95 transition-all bg-zinc-50/50 dark:bg-zinc-900/20"
                    >
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <LuPlus size={20} strokeWidth={3} />
                        </div>
                        <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                            Añadir ejercicio extra
                        </span>
                    </button>
                    <Button
                        colorButton={`primary`}
                        className='bg-red-600 dark:text-white mt-4'
                        onClick={handleFinishWorkout}
                    >
                        Finalizar workout
                    </Button>
                </>
                )}
            </div>

            <BottomSheet open={openAddExerciseSheet} onClose={() => setOpenAddExerciseSheet(false)}>
                <div className="max-w-md mx-auto max-h-[80vh] flex flex-col pt-2 pb-8">
                    <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-6" />
                    
                    <div className="px-6 mb-4">
                        <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-tighter">Biblioteca</h3>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Selecciona un ejercicio para tu sesión</p>
                    </div>

                    {/* Buscador Simple */}
                    <div className="px-6 mb-4">
                        <input 
                            type="text"
                            placeholder="BUSCAR EJERCICIO..."
                            className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl p-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 transition-all"
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    {/* Lista de resultados (Scrollable) */}
                    <div className="flex-1 overflow-y-auto max-h-[60vh] no-scrollbar px-4 space-y-2">
                        {filteredExercises.map(ex => (
                            <button 
                                key={ex.id}
                                onClick={() => handleAddExerciseToWorkout(ex)}
                                className="w-full flex items-center p-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl active:bg-blue-50 dark:active:bg-blue-900/20 transition-all"
                            >
                                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
                                    {ex.name[0]}
                                </div>
                                <span className="ml-4 text-sm font-bold text-zinc-700 dark:text-zinc-200">{ex.name}</span>
                                <LuPlus className="ml-auto text-blue-500" size={18} />
                            </button>
                        ))}
                    </div>
                </div>
            </BottomSheet>
        </>
    );
};

export default WorkoutDetailPage;