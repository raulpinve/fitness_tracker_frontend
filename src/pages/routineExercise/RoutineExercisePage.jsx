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
import RoutineExerciseSkeleton from './components/RoutineExerciseSkeleton';
import { LuDumbbell, LuTrash2 } from 'react-icons/lu';
import EmptyState from '../../shared/components/EmptyState';
import Button from '../../shared/components/Button';

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
    const { getRoutine } = useRoutineServices(); 
    const [routineName, setRoutineName] = useState(state?.routineName || "");

    const fetchRoutineExercises = async (pageToLoad) => {
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
            if (!routineName) {
                try {
                    const res = await getRoutine(routineExerciseId);
                    setRoutineName(res.data.name);
                } catch (error) {
                    console.error("Error al recuperar el nombre de la rutina", error);
                    setRoutineName("Rutina");
                }
            }
        };

        loadInitialData();
    }, [routineExerciseId, routineName]);

    return (
        <>
            <Header 
                title={routineName || "Cargando..."} 
                showBack={true}
                backTo={`/routines`}
            />

            <div className='p-4'>
                {loading && page === 1 ? (
                    <RoutineExerciseSkeleton />
                ) : routinesExercises.length === 0 ? (
                    <EmptyState 
                        message="No hay ejercicios en esta rutina" 
                        icon={LuDumbbell}
                    />
                ) : (
                    <RoutineExerciseList
                        routinesExercises={routinesExercises}
                        onOpenActions={handleOpenButtonSheet}
                    />
                )}

                <FloatingActionButton 
                    text="Ejercicio" 
                    onClick={() => navigate(`/routines/${routineExerciseId}/exercises/create`)} 
                />

                <BottomSheet open={openButtonSheet} onClose={() => setOpenButtonSheet(false)}>
                    <div className="max-w-md mx-auto max-h-[85vh] overflow-y-auto no-scrollbar pt-2 pb-6">
                        {modeButtonSheet === "actions" && (
                            <div className="flex flex-col">
                                <div className="px-6 py-2">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Opciones de ejercicio</p>
                                </div>

                                <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                    <button 
                                        className="w-full py-5 px-6 flex items-center gap-4 text-sm font-bold text-zinc-700 dark:text-zinc-200 active:bg-zinc-50 dark:active:bg-zinc-900/50 transition-colors"
                                        onClick={() => handleEdit(selectedRoutineExercise)}
                                    >
                                        <span className="flex-1 text-left">Editar metas (Sets/Reps)</span>
                                    </button>

                                    <button     
                                        onClick={() => setModeButtonSheet("confirm-delete")}
                                        className="w-full py-5 px-6 flex items-center gap-4 text-sm font-bold text-red-500 active:bg-red-50 dark:active:bg-red-950/10 transition-colors"
                                    >
                                        <LuTrash2 size={20} />
                                        <span className="flex-1 text-left">Quitar de la rutina</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {modeButtonSheet === "confirm-delete" && (
                            <div className="max-w-md mx-auto max-h-[85vh] overflow-y-auto no-scrollbar pt-2 pb-6">
                                {/* Cabecera de Alerta */}
                                <div className="flex flex-col items-center text-center mb-6">
                                    <div className="w-14 h-14 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-3">
                                        <LuTrash2 className="w-7 h-7 text-red-600 dark:text-red-500" />
                                    </div>
                                    <p className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                                        ¿Quitar ejercicio?
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-zinc-400 px-8 mt-1 leading-relaxed">
                                        Se borrarán las metas de <span className="font-bold text-zinc-800 dark:text-zinc-200">"{selectedRoutineExercise?.exerciseName}"</span>. Esta acción no se puede deshacer.
                                    </p>
                                </div>

                                <div className="grid gap-3 px-2">
                                    <button
                                        disabled={isLoadingDelete}
                                        onClick={() => handleDelete(selectedRoutineExercise)}
                                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold flex justify-center gap-3 items-center transition-all active:scale-95 shadow-lg shadow-red-500/20 disabled:opacity-50"
                                    >
                                        {isLoadingDelete ? (
                                            <AiOutlineLoading3Quarters className='animate-spin' />
                                        ) : (
                                            "Sí, eliminar ejercicio"
                                        )}
                                    </button>

                                    <button
                                        className="w-full py-4 text-gray-500 dark:text-zinc-400 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors text-sm"
                                        onClick={() => setModeButtonSheet("actions")}
                                    >
                                        No, mantener ejercicio
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </BottomSheet>
            </div>
        </>
    );
};

export default RoutineExercisePage;
