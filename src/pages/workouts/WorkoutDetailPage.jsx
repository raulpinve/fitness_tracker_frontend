import React from 'react';
import ExerciseBlockSkeleton from './components/ExerciseBlockSkeleton';
import { useExerciseServices } from '../../services/exercises.service';
import { useWorkoutServices } from '../../services/workout.service';
import { LuDumbbell, LuPlus, LuSearch, LuTrash2, LuTrophy } from 'react-icons/lu';
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
import useDebounce from '../../shared/hooks/useDebounce';

const WorkoutDetailPage = () => {
    const { getWorkout, finishWorkout, deleteWorkout } = useWorkoutServices();
    const [openAddExerciseSheet, setOpenAddExerciseSheet] = useState(false);
    const { getWorkoutActiveExercises } = useWorkoutExerciseServices();
    const [ activeExercises, setActiveExercises ] = useState([]);
    const [libraryExercises, setLibraryExercises] = useState([]);
    const [openFinishSheet, setOpenFinishSheet] = useState(false);
    const { getAllExercises } = useExerciseServices();
    const [ loading, setLoading ] = useState(true);
    const [ workout, setWorkout ] = useState();
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 400);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const { workoutId } = useParams();
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

                // --- NEW FILTER LOGIC (BLACKLIST) ---
                // Get the exercises the user manually removed from this session
                const removedIds = JSON.parse(localStorage.getItem(`removed_exercises_${workoutId}`)) || [];

                // Combine everything and filter out those in the "blacklist"
                const mergedExercises = [...dbExercises, ...filteredExtras];
                const finalExercises = mergedExercises.filter(ex => !removedIds.includes(ex.exerciseId));

                setActiveExercises(finalExercises);
            } catch (error) {
                console.log(error);
                toast.error("Error al sincronizar el entrenamiento");
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [workoutId]);

    const handleFinishClick = () => {
        setOpenFinishSheet(true); 
    };

    const handleAddExerciseToWorkout = (libraryEx) => {
        if (activeExercises.some(e => e.exerciseId === libraryEx.id)) {
            return toast.error("Este ejercicio ya está en la lista");
        }

        // --- NEW LOGIC: Remove from blacklist if it existed ---
        const removedKey = `removed_exercises_${workoutId}`;
        const removed = JSON.parse(localStorage.getItem(removedKey) || "[]");
        if (removed.includes(libraryEx.id)) {
            const updatedRemoved = removed.filter(id => id !== libraryEx.id);
            localStorage.setItem(removedKey, JSON.stringify(updatedRemoved));
        }
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

    const handleFinishWorkout = async () => {
        try {
            // 1. Notify backend that we closed the session
            await finishWorkout(workoutId);

            // 2. Full cleanup of local traces (Skipped and Extras)
            localStorage.removeItem(`pending_extras_${workoutId}`);

            // 3. Visual feedback and navigation
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
        // 1. Update React state (this will trigger re-rendering)
        setActiveExercises(prev => {
            const newState = prev.filter(ex => ex.exerciseId !== exerciseId);
            // If this was the last one, newState.length will be 0 and you'll see the Empty State
            return newState;
        });

        // 2. Save to the "Blacklist" in LocalStorage
        const storageKey = `removed_exercises_${workoutId}`;
        const removed = JSON.parse(localStorage.getItem(storageKey) || "[]");
        
        if (!removed.includes(exerciseId)) {
            localStorage.setItem(storageKey, JSON.stringify([...removed, exerciseId]));
        }
    };

    useEffect(() => {
        const fetchFromDB = async () => {
            setLoadingSearch(true);
            try {
                const res = await getAllExercises(1, 20, debouncedQuery);
                setLibraryExercises(res.data);
            } catch (error) {
                console.error("Error en búsqueda TYTAN:", error);
            } finally {
                setLoadingSearch(false);
            }
        };

        fetchFromDB();
    }, [debouncedQuery]); 


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
                    {/* Button at the end of the exercise list */}
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
                        onClick={handleFinishClick}
                    >
                        Finalizar workout
                    </Button>
                </>
                )}
            </div>

            <BottomSheet open={openAddExerciseSheet} onClose={() => setOpenAddExerciseSheet(false)}>
                <div className=" max-h-[85vh] flex flex-col pt-2 pb-6">
                    {/* Encabezado estilo "Opciones" */}
                    <div className="px-6 py-4">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">
                            Base de datos de ejercicios
                        </p>
                        <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-100 uppercase italic tracking-tighter">
                            Biblioteca <span className="text-blue-600 font-bold">TYTAN</span>
                        </h3>
                    </div>

                    {/* Input de búsqueda integrado */}
                    <div className="px-6 mb-4">
                        <div className="relative flex items-center">
                            <input 
                                type="text"
                                value={query}
                                placeholder="BUSCAR EJERCICIO..."
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl p-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            {loadingSearch && (
                                <AiOutlineLoading3Quarters className="absolute right-4 animate-spin text-blue-600" size={16} />
                            )}
                        </div>
                    </div>

                    {/* Lista de Resultados con el mismo estilo de botones del menu de acciones */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800/50">
                            {libraryExercises.length > 0 ? (
                                libraryExercises.map(ex => (
                                    <button 
                                        key={ex.id}
                                        onClick={() => {
                                            handleAddExerciseToWorkout(ex);
                                            setOpenAddExerciseSheet(false);
                                            setQuery("");
                                        }}
                                        className="w-full py-5 px-6 flex items-center gap-4 active:bg-zinc-50 dark:active:bg-zinc-900/50 transition-colors group text-left"
                                    >
                                        {/* Avatar pequeño como el icono de Trash */}
                                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden border border-zinc-200 dark:border-zinc-800 group-hover:border-blue-500/50 transition-colors">
                                            {ex.avatarThumbnail ? (
                                                <img 
                                                    src={`${import.meta.env.VITE_API_URL}/uploads/exercises/${ex.id}/${ex.avatarThumbnail}`} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                <span className="text-blue-600 font-bold">{ex.name[0]}</span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200 truncate uppercase tracking-tight">
                                                {ex.name}
                                            </p>
                                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">
                                                {ex.equipment} • {ex.muscleGroups}
                                            </p>
                                        </div>

                                        <LuPlus className="text-blue-500 group-hover:scale-125 transition-transform" size={20} />
                                    </button>
                                ))
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                                        {loadingSearch ? "Sincronizando..." : "No hay resultados"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </BottomSheet>



            <BottomSheet open={openFinishSheet} onClose={() => setOpenFinishSheet(false)}>
                <div className="max-w-md mx-auto flex flex-col pt-2 pb-10">
                    {/* Your signature bar */}
                    <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-8" />
                    <div className="px-8 text-center">
                        {/* Zinc-style Trophy icon */}
                        <div className="mx-auto w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner border border-blue-100/50 dark:border-blue-500/10">
                            <LuTrophy className="text-blue-600" size={40} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-3xl font-black text-zinc-800 dark:text-zinc-100 uppercase italic tracking-tighter leading-none">
                            ¿Misión Cumplida?
                        </h3>
                        <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mt-4 leading-relaxed">
                            Hiciste un gran trabajo hoy. <br /> ¿Confirmas que terminaste la batalla?
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-8 mt-10 space-y-3">
                        <button
                            onClick={() => {
                                setOpenFinishSheet(false);
                                handleFinishWorkout(); 
                            }}
                            className="w-full py-5 bg-blue-600 text-white rounded-4xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                        >
                            Finalizar y Guardar
                        </button>
                        
                        <button
                            onClick={() => setOpenFinishSheet(false)}
                            className="w-full py-3 text-zinc-400 dark:text-zinc-600 font-black uppercase tracking-widest text-[9px] active:opacity-50"
                        >
                            Todavía no, un set más
                        </button>
                    </div>
                </div>
            </BottomSheet>
        </>
    );
};

export default WorkoutDetailPage;