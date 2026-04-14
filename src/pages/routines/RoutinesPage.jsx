import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import RoutinesList from './components/RoutinesList';
import { useNavigate } from 'react-router-dom';
import { useRoutineServices } from '../../services/routine.service';
import { toast } from 'sonner';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import LoadMoreButton from '../../shared/components/LoadMoreButton';
import FloatingActionButton from '../../shared/components/FloatingActionButton';

const RoutinesPage = () => {
    const navigate = useNavigate();
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [openButtonSheet, setOpenButtonSheet] = useState(false);
    const {getAllRoutines} = useRoutineServices();
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

    return (
        <>
            <Header 
                title={`Rutinas`}
            />

            <div className="p-4">
                <RoutinesList
                    routines={routines}
                    onOpenActions={handleOpenButtonSheet}
                />
                <LoadMoreButton 
                    onClick={handleLoadMore} 
                    loading={loading} 
                    hasMore={hasMore} 
                    text="Cargar más rutinas" 
                />
                <FloatingActionButton 
                    text="Rutina" 
                    onClick={() => navigate('/routines/create')} 
                />
            </div>
        </>
    );
};

export default RoutinesPage;
