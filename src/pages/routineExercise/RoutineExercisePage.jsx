import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
// import RoutinesList from './components/RoutinesList';
import BottomSheet from '../../shared/components/BottomSheet';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoutineExerciseService } from '../../services/routineExercise.service';
import { toast } from 'sonner';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import RoutineExerciseList from './components/RoutineExerciseList';

const RoutineExercisePage = () => {
    const navigate = useNavigate();
    const [selectedRoutineExercise, setSelectedRoutineExercise] = useState(null);
    const [openButtonSheet, setOpenButtonSheet] = useState(false);
    const [modeButtonSheet, setModeButtonSheet] = useState("actions"); 
    const {getAllRoutineExercises, deleteRoutineExercise} = useRoutineExerciseService();
    const [isLoadingDelete, setIsLoadingDelete] = useState();
    const [routinesExercises, setRoutinesExercises] = useState([]);
    const {routineId} = useParams();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    const fetchRoutineExercises = async (pageToLoad) => {
        // Prevents loading multiples petitions
        if (loading) return;
        setLoading(true);

        try {
            const res = await getAllRoutineExercises(routineId, pageToLoad); 
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

    return (
        <>
            <Header 
                title={`Ejercicios de la rutina`}
                rightAction={<button
                    className="text-blue-600 transition cursor-pointer px-4"
                    onClick={ () => navigate(`/routines/${routineId}/exercises/create`)}
                >
                    Agregar
                </button>}    
            />

            <div>
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

                <BottomSheet open={openButtonSheet} onClose={() => setOpenButtonSheet(false)}>
                    {modeButtonSheet === "actions" && (<>
                        <button 
                            className='px-4 py-4 cursor-pointer'
                            onClick={() => handleEdit(selectedRoutineExercise)}
                        >   Editar </button>
                        <button     
                            onClick={() => setModeButtonSheet("confirm-delete")}
                            className="px-4 py-4 cursor-pointer text-red-500"
                        > Eliminar {selectedRoutineExercise?.name} </button>
                    </>)}

                    {modeButtonSheet === "confirm-delete" && (
                        <>
                            <p className="py-4 text-center font-medium">
                                ¿Eliminar ejercicio?
                            </p>
                            <button
                                className="py-4 text-red-500 cursor-pointer flex justify-center gap-3 items-center"
                                onClick={() => handleDelete(selectedRoutineExercise)}
                            >
                               {isLoadingDelete ? <AiOutlineLoading3Quarters className='animate-spin transition-all' /> : ""} Sí, eliminar
                            </button>
                            <button
                                className="py-4 text-gray-500 cursor-pointer"
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

export default RoutineExercisePage;
