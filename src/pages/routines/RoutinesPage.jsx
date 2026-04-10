import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import RoutinesList from './components/RoutinesList';
import BottomSheet from '../../shared/components/BottomSheet';
import { useNavigate } from 'react-router-dom';
import { useRoutineServices } from '../../services/routine.service';
import { toast } from 'sonner';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const RoutinesPage = () => {
    const navigate = useNavigate();
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [openButtonSheet, setOpenButtonSheet] = useState(false);
    const [modeButtonSheet, setModeButtonSheet] = useState("actions"); 
    const {getAllRoutines, deleteRoutine} = useRoutineServices();
    const [isLoadingDelete, setIsLoadingDelete] = useState();
    const [routines, setRoutines] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    const fetchRoutines = async (pageToLoad) => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await getAllRoutines(pageToLoad); 
            const newData = res.data;
            const total = res.pagination?.totalRecords || 0; 

            setRoutines(prev => {
                return pageToLoad === 1 ? newData : [...prev, ...newData];
            });
            setHasMore(routines.length + newData.length < total);
            
        } catch{
            toast.error("Error al cargar las rutinas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutines(1);
    }, []);

    // Load more routines
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchRoutines(nextPage);
    };
    
    /** Handlers */
    const handleOpenButtonSheet = (exercise) => {
        setSelectedRoutine(exercise);
        setOpenButtonSheet(true);
    };

    const handleEdit = (exercise) => {
        navigate(`/routines/${exercise.id}/update`, { state: { exercise } });
    }

    const handleDelete = async (selectedRoutine) => {
        setIsLoadingDelete(true);
        try {
            await deleteRoutine(selectedRoutine.id);
            toast("Rutina eliminada exitosamente.");

            setModeButtonSheet("actions");
            setOpenButtonSheet(false);

            const updatedRoutines = routines.filter(routine => routine.id !== selectedRoutine.id);
            setRoutines(updatedRoutines);
        } catch {
            toast.error("Ha ocurrido un error al momento de eliminar la rutina");
        } finally {
            setIsLoadingDelete(false);
        }
    }

    return (
        <>
            <Header 
                title={`Rutinas`}
                rightAction={<button
                    className="text-blue-600 transition cursor-pointer px-4"
                    onClick={ () => navigate("/routines/create")}
                >
                    Crear
                </button>}    
            />

            <div className="">
                <RoutinesList
                    routines={routines}
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
                            onClick={() => handleEdit(selectedRoutine)}
                        >   Editar </button>
                        <button     
                            onClick={() => setModeButtonSheet("confirm-delete")}
                            className="px-4 py-4 cursor-pointer text-red-500"
                        > Eliminar {selectedRoutine?.name} </button>
                    </>)}

                    {modeButtonSheet === "confirm-delete" && (
                        <>
                            <p className="py-4 text-center font-medium">
                                ¿Eliminar rutina?
                            </p>
                            <button
                                className="py-4 text-red-500 cursor-pointer flex justify-center gap-3 items-center"
                                onClick={() => handleDelete(selectedRoutine)}
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

export default RoutinesPage;
