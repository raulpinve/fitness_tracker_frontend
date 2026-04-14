import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
// import RoutinesList from './components/RoutinesList';
import BottomSheet from '../../shared/components/BottomSheet';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRoutineExerciseService } from '../../services/routineExercise.service';
import { toast } from 'sonner';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import RoutineExerciseList from './components/RoutineExerciseList';
import { useRoutineServices } from '../../services/routine.service';
import FloatingActionButton from '../../shared/components/FloatingActionButton';
import { FaDumbbell, FaTrash } from 'react-icons/fa';

const RoutineExercisePage = () => {
    const navigate = useNavigate();
    const [selectedRoutineExercise, setSelectedRoutineExercise] = useState(null);
    const [openButtonSheet, setOpenButtonSheet] = useState(false);
    const [modeButtonSheet, setModeButtonSheet] = useState("actions"); 
    const {getAllRoutineExercises, deleteRoutineExercise} = useRoutineExerciseService();
    const [isLoadingDelete, setIsLoadingDelete] = useState();
    const [routinesExercises, setRoutinesExercises] = useState([]);
    const {routineExerciseId} = useParams();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const { state } = useLocation();
    const { getRoutine } = useRoutineServices(); // Tu servicio para obtener una 
    const [routineName, setRoutineName] = useState(state?.routineName || "");

    const fetchRoutineExercises = async (pageToLoad) => {
        // Prevents loading multiples petitions
        if (loading) return;
        setLoading(true);

        try {
            const res = await getAllRoutineExercises(routineExerciseId, pageToLoad); 
            const newData = res.data;
            const total = res.pagination?.totalRecords || 0; 

            setRoutinesExercises(prev => {
                return pageToLoad === 1 ? newData : [...prev, ...newData];
            });

            setHasMore(routinesExercises.length + newData.length < total);
        } catch{
            toast.error("Error al cargar los ejercicios de la ruta");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutineExercises(1);
    }, []);

    // Load more routines
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchRoutineExercises(nextPage);
    };
    
    /** Handlers */
    const handleOpenButtonSheet = (exercise) => {
        setSelectedRoutineExercise(exercise);
        setOpenButtonSheet(true);
    };

    const handleEdit = (routineExercise) => {
        navigate(`/routines/${routineExercise.id}/exercises/edit`, { state: { routineExercise } });
    }

    const handleDelete = async (selectedRoutineExercise) => {
        setIsLoadingDelete(true);
        try {
            await deleteRoutineExercise(selectedRoutineExercise.id);
            toast("Rutina eliminada exitosamente.");

            setModeButtonSheet("actions");
            setOpenButtonSheet(false);

            const updatedRoutines = routinesExercises.filter(routine => routine.id !== selectedRoutineExercise.id);
            setRoutinesExercises(updatedRoutines);
        } catch {
            toast.error("Ha ocurrido un error al momento de eliminar el ejercicio de la rutina");
        } finally {
            setIsLoadingDelete(false);
        }
    }

     useEffect(() => {
        const loadInitialData = async () => {
            // Si NO hay nombre en el state, lo pedimos a la BD
            if (!routineName) {
                try {
                    const res = await getRoutine(routineExerciseId);
                    setRoutineName(res.data.name);
                } catch (error) {
                    console.error("Error al recuperar el nombre de la rutina", error);
                    setRoutineName("Rutina"); // Fallback por si todo falla
                }
            }
        };

        loadInitialData();
    }, [routineExerciseId, routineName]);

    return (
        <>
            <Header 
                title={routineName || "Cargando..."} 
            />

            <div className='p-4'>
                <RoutineExerciseList
                    routinesExercises={routinesExercises}
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

                <FloatingActionButton 
                    text="Ejercicio a rutina" 
                    onClick={() => navigate(`/routines/${routineExerciseId}/exercises/create`)} 
                />

               <BottomSheet open={openButtonSheet} onClose={() => setOpenButtonSheet(false)}>
                    {modeButtonSheet === "actions" && (
                        <div className="flex flex-col p-2">
                            <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800/50">
                                <button 
                                    className="w-full py-5 flex items-center justify-center gap-3 text-sm font-bold text-zinc-700 dark:text-zinc-200 active:bg-zinc-50 dark:active:bg-zinc-800/50 transition-colors rounded-xl"
                                    onClick={() => handleEdit(selectedRoutineExercise)}
                                >
                                    <FaDumbbell className="text-blue-500" />
                                    Editar metas (Sets/Reps)
                                </button>

                                <button     
                                    onClick={() => setModeButtonSheet("confirm-delete")}
                                    className="w-full py-5 flex items-center justify-center gap-3 text-sm font-bold text-red-500 active:bg-red-50 dark:active:bg-red-900/10 transition-colors rounded-xl"
                                >
                                    <FaTrash className="text-xs" />
                                    Quitar de la rutina
                                </button>
                            </div>
                        </div>
                    )}

                    {modeButtonSheet === "confirm-delete" && (
                        <div className="pt-2 pb-6 px-2">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-14 h-14 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-3">
                                    <FaTrash className="text-red-600 dark:text-red-500 text-xl" />
                                </div>
                                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                    ¿Quitar ejercicio?
                                </p>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 px-8 mt-1 leading-relaxed">
                                    Se eliminarán las metas establecidas para <span className="font-bold text-zinc-800 dark:text-zinc-200">"{selectedRoutineExercise?.exerciseName}"</span> en esta rutina.
                                </p>
                            </div>

                            <div className="grid gap-3">
                                <button
                                    disabled={isLoadingDelete}
                                    onClick={() => handleDelete(selectedRoutineExercise)}
                                    className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold flex justify-center gap-3 items-center active:scale-[0.96] transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                                >
                                    {isLoadingDelete ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Sí, quitar ejercicio"}
                                </button>

                                <button
                                    className="w-full py-4 text-zinc-500 dark:text-zinc-400 font-bold active:bg-zinc-100 dark:active:bg-zinc-800 rounded-2xl transition-colors text-sm"
                                    onClick={() => setModeButtonSheet("actions")}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </BottomSheet>

            </div>
        </>
    );
};

export default RoutineExercisePage;
