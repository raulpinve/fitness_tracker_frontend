import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import ExercisesList from './components/ExercisesList';
import BottomSheet from '../../shared/components/BottomSheet';
import { useNavigate } from 'react-router-dom';
import { useExerciseServices } from '../../services/exercises.service';
import { toast } from 'sonner';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const ExercisesPage = () => {
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [openButtonSheet, setOpenButtonSheet] = useState(false);
    const [modeButtonSheet, setModeButtonSheet] = useState("actions"); 
    const { getAllExercises, deleteExercise } = useExerciseServices();
    const [isLoadingDelete, setIsLoadingDelete] = useState();
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    const fetchExercises = async (pageToLoad) => {
        // Prevents loading multiples petitions
        if (loading) return;
        setLoading(true);

        try {
            const res = await getAllExercises(pageToLoad); 
            const newData = res.data;
            const total = res.pagination?.totalRecords || 0; 

            setExercises(prev => {
                return pageToLoad === 1 ? newData : [...prev, ...newData];
            });
            setHasMore(exercises.length + newData.length < total);
        } catch{
            toast.error("Error al cargar ejercicios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExercises(1);
    }, []);

    // Load more exercises
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchExercises(nextPage);
    };
    
    /** Handlers */
    const handleOpenButtonSheet = (exercise) => {
        setSelectedExercise(exercise);
        setOpenButtonSheet(true);
    };

    const handleEdit = (exercise) => {
        navigate(`/exercises/${exercise.id}/update`, { state: { exercise } });
    }

    const handleDelete = async (selectedExercise) => {
        setIsLoadingDelete(true);
        try {
            await deleteExercise(selectedExercise.id);
            toast("Ejercicio eliminado exitosamente.");

            setModeButtonSheet("actions");
            setOpenButtonSheet(false);

            const updatedExercises = exercises.filter(exercise => exercise.id !== selectedExercise.id);
            setExercises(updatedExercises);
        } catch {
            toast.error("Ha ocurrido un error al momento de eliminar el ejercicio");
        } finally {
            setIsLoadingDelete(false);
        }
    }

    return (
        <>
            <Header 
                title={`Ejercicios`}
                rightAction={<button
                    className="text-blue-600 transition cursor-pointer px-4"
                    onClick={ () => navigate("/exercises/create")}
                >
                    Crear
                </button>}    
            />

            <div>
                <ExercisesList
                    exercises={exercises}
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
                            onClick={() => handleEdit(selectedExercise)}
                        >   Editar </button>
                        <button     
                            onClick={() => setModeButtonSheet("confirm-delete")}
                            className="px-4 py-4 cursor-pointer text-red-500"
                        > Eliminar {selectedExercise?.name} </button>
                    </>)}

                    {modeButtonSheet === "confirm-delete" && (
                        <>
                            <p className="py-4 text-center font-medium">
                                ¿Eliminar ejercicio?
                            </p>
                            <button
                                className="py-4 text-red-500 cursor-pointer flex justify-center gap-3 items-center"
                                onClick={() => handleDelete(selectedExercise)}
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

export default ExercisesPage;
