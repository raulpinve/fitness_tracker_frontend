import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import BottomSheet from '../../shared/components/BottomSheet';
import { useNavigate } from 'react-router-dom';
import { useWorkoutServices } from '../../services/workout.service';
import { toast } from 'sonner';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import WorkoutsList from './components/workoutsList';

const WorkoutsPage = () => {
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [openButtonSheet, setOpenButtonSheet] = useState(false);
    const { getAllWorkouts, deleteWorkout } = useWorkoutServices();
    const [modeButtonSheet, setModeButtonSheet] = useState("actions"); 
    const [isLoadingDelete, setIsLoadingDelete] = useState();
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [workouts, setWorkouts] = useState([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const fetchWorkout = async (pageToLoad) => {
        // Prevents loading multiples petitions
        if (loading) return;
        setLoading(true);

        try {
            const res = await getAllWorkouts(pageToLoad); 
            const newData = res.data;
            const total = res.pagination?.totalRecords || 0; 

            setWorkouts(prev => {
                return pageToLoad === 1 ? newData : [...prev, ...newData];
            });
            setHasMore(workouts.length + newData.length < total);
        } catch{
            toast.error("Error al cargar ejercicios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkout(1);
    }, []);

    // Load more exercises
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchWorkout(nextPage);
    };
    
    /** Handlers */
    const handleOpenButtonSheet = (exercise) => {
        setSelectedWorkout(exercise);
        setOpenButtonSheet(true);
    };

    const handleDelete = async (selectedWorkout) => {
        setIsLoadingDelete(true);
        try {
            await deleteWorkout(selectedWorkout.id);
            toast("Workout eliminado exitosamente.");

            setModeButtonSheet("actions");
            setOpenButtonSheet(false);

            const updatedExercises = workouts.filter(exercise => exercise.id !== selectedWorkout.id);
            setWorkouts(updatedExercises);
        } catch {
            toast.error("Ha ocurrido un error al momento de eliminar el entrenamiento");
        } finally {
            setIsLoadingDelete(false);
        }
    }

    return (
        <>
            <Header 
                title={`Workouts`}
                rightAction={<button
                    className="text-blue-600 transition cursor-pointer px-4"
                    // onClick={ () => navigate("/workouts/create")}
                >
                    Crear
                </button>}    
            />

            <div>
                <WorkoutsList
                    workouts={workouts}
                    onOpenActions={handleOpenButtonSheet}
                />

                {hasMore && (
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="w-full py-2 text-sm text-blue-600 font-medium flex justify-center items-center gap-2  rounded-lg disabled:opacity-50"
                    >
                        {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
                        {loading ? "Cargando..." : "Cargar más"}
                    </button>
                )}

                <BottomSheet open={openButtonSheet} onClose={() => setOpenButtonSheet(false)}>
                    {modeButtonSheet === "actions" && (<>
                        <button     
                            onClick={() => setModeButtonSheet("confirm-delete")}
                            className="px-4 py-4 cursor-pointer text-red-500 dark:hover:bg-red-950/30"
                        > Eliminar la rutina: {selectedWorkout?.name} </button>
                    </>)}

                    {modeButtonSheet === "confirm-delete" && (
                        <>
                            <p className="py-4 text-center font-medium dark:text-zinc-100">
                                ¿Eliminar ejercicio?
                            </p>
                            <button
                                className="py-4 text-red-500 cursor-pointer flex justify-center gap-3 items-center dark:hover:bg-red-950/30"
                                onClick={() => handleDelete(selectedWorkout)}
                            >
                                {isLoadingDelete ? <AiOutlineLoading3Quarters className='animate-spin transition-all' /> : ""} Sí, eliminar
                            </button>
                            <button
                                className="py-4 text-gray-500 dark:text-zinc-400 cursor-pointer dark:hover:bg-zinc-900"
                                onClick={() => setModeButtonSheet("actions")}
                            >
                                Cancelar
                            </button>
                        </>
                    )}
                </BottomSheet>
            </div>
        </>
    );
};

export default WorkoutsPage;
