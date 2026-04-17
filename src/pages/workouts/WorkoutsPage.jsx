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
        <div className="p-6 pt-10 pb-4">
            <div className="flex items-stretch gap-4">
                {/* Barra lateral sólida - Estilo Zinc Premium */}
                <div className="w-2.5 rounded-full bg-gradient-to-b from-blue-600 to-blue-400 shadow-[4px_0_20px_rgba(37,99,235,0.3)]" />
                
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter leading-none italic">
                        Entrenar
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">
                            Selecciona tu <span className="text-blue-500">Próximo Desafío</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
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