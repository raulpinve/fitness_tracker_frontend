import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import RoutinesList from './components/RoutinesList';
import { useNavigate } from 'react-router-dom';
import { useRoutineServices } from '../../services/routine.service';
import { toast } from 'sonner';
import FloatingActionButton from '../../shared/components/FloatingActionButton';
import RoutineSkeleton from './components/RoutineSkeleton';
import EmptyState from '../../shared/components/EmptyState';
import { LuClipboardList } from 'react-icons/lu';
import LoadMoreButton from '../../shared/components/LoadMoreButton';

const RoutinesPage = () => {
    const navigate = useNavigate();
    const {getAllRoutines} = useRoutineServices();
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);

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

    return (
        <>
            <div className="p-6 pt-10 pb-4">
                <div className="flex items-stretch gap-4">
                    {/* Aquí puedes cambiar el color a morado o dejarlo azul para consistencia */}
                    <div className="w-2.5 rounded-full bg-gradient-to-b from-blue-600 to-blue-400 shadow-[4px_0_20px_rgba(37,99,235,0.4)]" />
                    
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter leading-none italic">
                            Rutinas
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">
                                {routines.length} <span className="text-blue-500">Programas</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

                        
            <div className="p-4">
                
                {loading && page === 1 ? (
                    [...Array(10)].map((_, i) => <RoutineSkeleton key={i} />)
                ) : routines.length === 0 ? (
                    <EmptyState 
                        message="No se encontraron rutinas" 
                        icon={LuClipboardList}
                    />
                ) : (
                    <RoutinesList 
                        routines={routines} 
                    />
                )}
             
                <LoadMoreButton 
                    onClick={handleLoadMore} 
                    loading={loading} 
                    hasMore={hasMore} 
                    text="Cargar más ejercicios" 
                />
            </div>
            <FloatingActionButton 
                text="Rutina" 
                onClick={() => navigate('/routines/create')} 
            />
        </>
    );
};

export default RoutinesPage;
