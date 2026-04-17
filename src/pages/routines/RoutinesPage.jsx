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
