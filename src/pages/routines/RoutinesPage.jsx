import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import RoutinesList from './components/RoutinesList';
import { useNavigate } from 'react-router-dom';
import { useRoutineServices } from '../../services/routine.service';
import { toast } from 'sonner';
import FloatingActionButton from '../../shared/components/FloatingActionButton';
import RoutineSkeleton from './components/RoutineSkeleton';
import EmptyState from '../../shared/components/EmptyState';
import { LuClipboardList, LuTrash2 } from 'react-icons/lu';
import LoadMoreButton from '../../shared/components/LoadMoreButton';
import BottomSheet from '../../shared/components/BottomSheet';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const RoutinesPage = () => {
    const navigate = useNavigate();
    const {getAllRoutines, deleteRoutine} = useRoutineServices();
    const [openButtonSheet, setOpenButtonSheet] = useState(false);
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [selectedRoutineExercise, setSelectedRoutineExercise] = useState(null);

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

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchRoutines(nextPage);
    };

    const handleDelete = async (routineId) => {
        if (isLoadingDelete) return;
        setIsLoadingDelete(true); 
        try {
            await deleteRoutine(routineId);
            toast.success("Rutina eliminada");
            setRoutines(prev => prev.filter(r => r.id !== routineId));
            setOpenButtonSheet(false);
        } catch {
            toast.error("Error al eliminar la rutina");
        } finally {
            setIsLoadingDelete(false);
        } 
    }
    return (
        <>
            <Header title={`Rutinas`} />
            <div className="p-4">
                {loading && page === 1 ? (
                    [...Array(10)].map((_, i) => <RoutineSkeleton key={i} />)
                ) : routines.length === 0 ? (
                    <EmptyState 
                        message="No se encontraron rutinas" 
                        icon={LuClipboardList}
                    />
                ) : (
                    <>
                        <RoutinesList 
                            routines={routines} 
                            setSelectedRoutineExercise={setSelectedRoutineExercise}
                            setOpenButtonSheet={setOpenButtonSheet}
                        />
                        
                        {/* Solo mostramos el botón si hay rutinas y quedan más por cargar */}
                        {hasMore && (
                            <div className="pt-6 animate-in fade-in zoom-in duration-500">
                                <LoadMoreButton 
                                    onClick={handleLoadMore} 
                                    loading={loading} 
                                    hasMore={hasMore} 
                                    text="Cargar más rutinas" 
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
            <BottomSheet open={openButtonSheet} onClose={() => setOpenButtonSheet(false)}>
                <div className="max-w-md mx-auto max-h-[85vh] overflow-y-auto no-scrollbar pt-2 pb-6">
                    <div className="max-w-md mx-auto max-h-[85vh] overflow-y-auto no-scrollbar pt-2 pb-6">
                        {/* Cabecera de Alerta */}
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-14 h-14 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-3">
                                <LuTrash2 className="w-7 h-7 text-red-600 dark:text-red-500" />
                            </div>
                            <p className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                                ¿Eliminar rutina?
                            </p>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 px-8 mt-1 leading-relaxed">
                                Estás por borrar la rutina <span className="font-bold text-zinc-800 dark:text-zinc-200">"{selectedRoutineExercise?.name}"</span>. Todos sus datos vinculados se perderán de forma permanente.
                            </p>
                        </div>

                        <div className="grid gap-3 px-2">
                            <button
                                disabled={isLoadingDelete}
                                onClick={() => handleDelete(selectedRoutineExercise?.id)}
                                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold flex justify-center gap-3 items-center transition-all active:scale-95 shadow-lg shadow-red-500/20 disabled:opacity-50"
                            >
                                {isLoadingDelete ? (
                                    <AiOutlineLoading3Quarters className='animate-spin' />
                                ) : (
                                    "Sí, eliminar rutina"
                                )}
                            </button>

                            <button
                                className="w-full py-4 text-gray-500 dark:text-zinc-400 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors text-sm"
                                onClick={() => setOpenButtonSheet(false)}
                            >
                                No, mantener rutina
                            </button>
                        </div>
                    </div>
                </div>
            </BottomSheet>


            <FloatingActionButton 
                text="Rutina" 
                onClick={() => navigate('/routines/create')} 
            />
        </>
    );
};

export default RoutinesPage;
