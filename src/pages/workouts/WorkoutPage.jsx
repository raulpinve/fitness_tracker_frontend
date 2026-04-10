import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import BottomSheet from '../../shared/components/BottomSheet';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkoutServices } from '../../services/workout.service';
import { useRoutineExerciseService } from '../../services/routineExercise.service';
import { toast } from 'sonner';
import ExerciseBlock from './components/ExerciseBlock';
import Button from '../../shared/components/Button';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useExerciseServices } from '../../services/exercises.service';
import ExerciseSelector from './components/ExerciseSelector';

const WorkoutsPage = () => {
    const { getWorkout, finishWorkout } = useWorkoutServices();
    const { getAllRoutineExercises } = useRoutineExerciseService();
    const [activeExercises, setActiveExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [workout, setWorkout] = useState([]);
    const navigate = useNavigate();
    const {workoutId} = useParams();
    const [allExercises, setAllExercises] = useState([]);
    const { getAllExercises } = useExerciseServices(); 

    const [skippedIds, setSkippedIds] = useState(() => {
        const saved = localStorage.getItem(`skipped_${workoutId}`);
        return saved ? JSON.parse(saved) : [];
    });

    const handleRemoveExercise = async (exerciseId) => {
        if (!window.confirm("¿Omitir este ejercicio permanentemente en esta sesión?")) return;

        try {
            // 1. Llamada al nuevo endpoint de la DB
            // await api.patch(`/workouts/${workoutId}/skip`, { exerciseId });
            
            // 2. Actualizar el estado local para que desaparezca de la vista
            setActiveExercises(prev => prev.filter(ex => (ex.exerciseId || ex.id) !== exerciseId));
            
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
            toast.success("¡Entrenamiento finalizado! Buen trabajo.");
            
            navigate('/workouts'); 
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

                // 2. If it has a routine, load its exercises
                if (workoutData?.routineId) {
                    const resExercises = await getAllRoutineExercises(workoutData.routineId, workoutId);
                    const filtered = resExercises.data.filter(ex => !skippedIds.includes(ex.exerciseId));
                    setActiveExercises(filtered);
                    // setActiveExercises(resExercises.data || []);
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

    const handleAddExtraExercise = (exercise) => {
        if (activeExercises.find(ex => ex.exerciseId === exercise.id)) {
            return toast.error("Este ejercicio ya está en la lista");
        }
        setActiveExercises([...activeExercises, exercise]);
        toast.success(`${exercise.name} añadido`);
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
                title={`5 de abril`}
            />
            <div className="grid gap-6 p-4"> 
                <div className="grid gap-4">
                    {!activeExercises.length ? (
                        <p>No hay ejercicios</p>
                    ) : (
                        activeExercises.map((exercise) => (
                            <ExerciseBlock 
                                key={exercise.id} 
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
                        Finalizar Entrenamiento
                    </Button>
                </>)}
            </div>
        </>
    );
};

export default WorkoutsPage;
