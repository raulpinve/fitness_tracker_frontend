import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import { useNavigate } from 'react-router-dom';
import { useWorkoutServices } from '../../services/workout.service';
import { toast } from 'sonner';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import WorkoutsList from './components/workoutsList';
import FloatingActionButton from '../../shared/components/FloatingActionButton';

const WorkoutsPage = () => {
    const { getAllWorkouts, deleteWorkout } = useWorkoutServices();
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [workouts, setWorkouts] = useState([]);
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

    return (
        <>
            <Header 
                title={`Workouts`}
            />

            <div className='p-4'>
                <WorkoutsList
                    workouts={workouts}
                />

                 <FloatingActionButton 
                    text="Workout" 
                    onClick={() => navigate('/workouts/create')} 
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
            </div>
        </>
    );
};

export default WorkoutsPage;
