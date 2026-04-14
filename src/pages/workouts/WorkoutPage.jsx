import React, { act, useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkoutServices } from '../../services/workout.service';
import { toast } from 'sonner';
import ExerciseBlock from './components/ExerciseBlock';
import Button from '../../shared/components/Button';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useExerciseServices } from '../../services/exercises.service';
import { useWorkoutExerciseServices } from '../../services/workoutExercise.service';
import ExerciseSelector from './components/ExerciseSelector';
import { LuTrash2 } from 'react-icons/lu';
import BottomSheet from '../../shared/components/BottomSheet';

const WorkoutsPage = () => {
    const { getWorkout, finishWorkout } = useWorkoutServices();
    const { getAllWorkoutExercises, createWorkoutExercise, deleteWorkoutExercise } = useWorkoutExerciseServices();
    const { deleteWorkout } = useWorkoutServices();
    const [activeExercises, setActiveExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [workout, setWorkout] = useState([]);
    const navigate = useNavigate();
    const {workoutId} = useParams();
    const [allExercises, setAllExercises] = useState([]);
    const { getAllExercises } = useExerciseServices(); 
    const [openButtonSheet, setOpenButtonSheet] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const handleRemoveExercise = async (workoutExerciseId) => {
        if (!window.confirm("¿Omitir este ejercicio permanentemente en esta sesión?")) return;

        try {
            // 1. Call to the new DB endpoint
            await deleteWorkoutExercise(workoutExerciseId);
            
            // 2. Update the local state so it disappears from the view
            setActiveExercises(prev => prev.filter(ex => (ex.workoutExerciseId || ex.id) !== workoutExerciseId));
            toast.success("Ejercicio omitido");
        } catch (error) {
            toast.error("No se pudo guardar la omisión");
        }
    };

    const handleFinishWorkout = async () => {
        try {
            const confirm = window.confirm("¿Estás seguro de que quieres finalizar el entrenamiento?");
            if (!confirm) return;

            await finishWorkout(workoutId);
            localStorage.removeItem(`skipped_${workoutId}`); 

            navigate(`/workouts/${workoutId}/summary`);
        } catch (error){
            toast.error(error?.response?.data?.message || "No se pudo finalizar el entrenamiento.");
        }
    };


    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                // 1. Get the workout
                const resWorkout = await getWorkout(workoutId);
                const workoutData = resWorkout?.data;
                setWorkout(workoutData);

                // 2. If it has a routine, load its exercises from workout exercises
                if (workoutData?.routineId) {
                    const resExercises = await getAllWorkoutExercises(workoutId);
                    setActiveExercises(resExercises.data)
                } 
            } catch (error) {
                console.error("Error cargando datos:", error);
                toast.error("No se pudo cargar la información del entrenamiento");
            } finally {
                setLoading(false);
            }
        };
        if (workoutId) loadInitialData();
        
    }, [workoutId]); 


    useEffect(() => {
        const loadExercises = async () => {
            const res = await getAllExercises();
            setAllExercises(res.data || []);
        };
        loadExercises();
    }, []);
    
    const handleAddExtraExercise = async (exercise) => {
        if (activeExercises.find(ex => ex.exerciseId === exercise.id)) {
            return toast.error("Este ejercicio ya está en la lista");
        }

        try {
            const response = await createWorkoutExercise({
                workoutId: workoutId,
                exerciseId: exercise.id
            });

            const newWorkoutExercise = {
                id: response.data.id, 
                workoutExerciseId: response.data.id, 
                exerciseId: exercise.id,
                exerciseName: exercise.name,
                name: exercise.name,
                exerciseType: exercise.type,
                avatar: exercise.avatar,
                createdAt: new Date().toISOString()
            };

            setActiveExercises(prev => [...prev, newWorkoutExercise]);
            toast.success(`${exercise.name} añadido`);
        } catch (error) {
            toast.error("No se pudo añadir el ejercicio");
        }
    };

    const handleDelete = async (id) => {
        setIsLoadingDelete(true);
        try {
            await deleteWorkout(id);
            toast.success("Entrenamiento eliminado.");
            setOpenButtonSheet(false);
            navigate("/workouts", { replace: true }); // Usamos replace para limpiar el historial
        } catch (error) {
            toast.error("No se pudo eliminar.");
        } finally {
            setIsLoadingDelete(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-4xl" />
            </div>
        );
    }


    return (
        <>
            <Header 
                showBack={true}
                title={workout.name}
                rightAction={
                    !workout.finishedAt && (
                        <button 
                            onClick={() => setOpenButtonSheet(true)} 
                            className="p-2 text-red-500 active:scale-90 transition-transform cursor-pointer"
                            title="Eliminar entrenamiento"
                        >
                            <LuTrash2 size={20} />
                        </button>
                    )
                }
            />
            <div className="grid gap-6 p-4"> 
                <div className="grid gap-4 pt-4">
                    {!activeExercises.length ? (
                        <p className="text-center p-4 text-gray-500 italic">No hay ejercicios registrados</p>
                    ) : (
                        activeExercises.map((exercise) => (
                            <ExerciseBlock 
                                key={exercise.workoutExerciseId} 
                                exercise={exercise} 
                                workout={workout} 
                                onRemove={handleRemoveExercise} 
                            />
                        ))
                    )}
                </div>
                
                {!workout.finishedAt && (<>
                    <ExerciseSelector 
                        availableExercises={allExercises} 
                        onSelect={handleAddExtraExercise} 
                    />
                    <Button
                        colorButton={`primary`}
                        className='bg-red-600'
                        onClick={handleFinishWorkout}
                    >
                        Finalizar workout
                    </Button>
                </>)} 
            </div>

            <BottomSheet open={openButtonSheet} onClose={() => setOpenButtonSheet(false)}>
                <div className="pt-6 pb-6 px-4">
                    {/* Cabecera de Advertencia */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                            <LuTrash2 className="text-red-600 dark:text-red-500 text-2xl" />
                        </div>
                        <p className="text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
                            ¿Borrar entrenamiento?
                        </p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2 font-black uppercase tracking-[0.2em]">
                            Se perderá todo el progreso de esta sesión
                        </p>
                    </div>

                    {/* Acciones en Bloque */}
                    <div className="grid gap-3">
                        <button
                            disabled={isLoadingDelete}
                            onClick={() => handleDelete(workoutId)} // Tu función de eliminar
                            className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold flex justify-center gap-3 items-center active:scale-[0.96] transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                        >
                            {isLoadingDelete ? (
                                <AiOutlineLoading3Quarters className="animate-spin" />
                            ) : (
                                "SÍ, ELIMINAR REGISTRO"
                            )}
                        </button>

                        <button
                            className="w-full py-4 text-zinc-400 dark:text-zinc-500 font-bold active:bg-zinc-100 dark:active:bg-zinc-800 rounded-2xl transition-colors text-[10px] uppercase tracking-widest"
                            onClick={() => setOpenButtonSheet(false)}
                        >
                            VOLVER AL ENTRENAMIENTO
                        </button>
                    </div>
                </div>
            </BottomSheet>

        </>
    );
};

export default WorkoutsPage;
