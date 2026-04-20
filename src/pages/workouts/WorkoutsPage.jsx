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
        setLoading(true);
        try {
            const pageSize = 10; // Asegúrate de que este número coincida con tu backend
            const res = await getAllWorkouts(pageToLoad, pageSize); 
            const newData = res.data;
            
            setWorkouts(prev => (pageToLoad === 1 ? newData : [...prev, ...newData]));
            const totalRecords = res.pagination?.totalRecords || 0;
            setHasMore(pageToLoad * pageSize < totalRecords);
            
        } catch (error) {
            toast.error("Error al cargar el historial de entrenamientos");
            console.error(error);
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
                /* Skeleton de carga inicial */
                <WorkoutSkeleton />
            ) : workouts.length === 0 ? (
                /* Estado vacío si no hay data */
                <EmptyState 
                    message="No se encontraron entrenamientos" 
                    icon={LuFlame}
                />
            ) : (
                <>
                    {/* Lista de Entrenamientos */}
                    <WorkoutsList workouts={workouts} />

                    {/* El botón solo aparece si hay data Y si el backend confirma que hay más páginas */}
                    {hasMore && (
                        <div className="pt-8 pb-20 animate-in fade-in zoom-in duration-500">
                            <LoadMoreButton 
                                onClick={handleLoadMore} 
                                loading={loading} 
                                hasMore={hasMore} 
                                text="Cargar más historial" 
                            />
                        </div>
                    )}
                </>
            )}
        </div>

        <FloatingActionButton 
            text="Entrenamiento" 
            onClick={() => navigate('/workouts/create')} 
        />
    </>);
};

export default WorkoutsPage;