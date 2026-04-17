import FloatingActionButton from '../../shared/components/FloatingActionButton';
import LoadMoreButton from '../../shared/components/LoadMoreButton';
import { useWorkoutServices } from '../../services/workout.service';
import EmptyState from '../../shared/components/EmptyState';
import WorkoutSkeleton from './components/WorkoutSkeleton';
import WorkoutsList from './components/WorkoutList';
import Header from '../../shared/components/Header';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuFlame } from 'react-icons/lu';
import { toast } from 'sonner';

const WorkoutsPage = () => {
    const { getAllWorkouts } = useWorkoutServices();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const fetchWorkout = async (pageToLoad) => {
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

    // Load more workouts
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchWorkout(nextPage);
    };
    
    return (<>
        <Header title={`Entrenamientos`} />
       
        <div className='p-4'>
            {loading && page === 1 ? (
                <WorkoutSkeleton />
            ) : workouts.length === 0 ? (
                <EmptyState 
                    message="No se encontraron entrenamientos" 
                    icon={LuFlame}
                />
            ) : (
                <WorkoutsList 
                    workouts={workouts} 
                />
            )}
            <LoadMoreButton 
                onClick={handleLoadMore} 
                loading={loading} 
                hasMore={hasMore} 
                text="Cargar más entrenamientos" 
            />
        </div>

        <FloatingActionButton 
            text="Entrenamiento" 
            onClick={() => navigate('/workouts/create')} 
        />
    </>);
};

export default WorkoutsPage;