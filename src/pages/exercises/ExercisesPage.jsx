import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import ExercisesList from './components/ExercisesList';
import BottomSheet from '../../shared/components/BottomSheet';
import { useNavigate } from 'react-router-dom';
import { useExerciseServices } from '../../services/exercises.service';
import { toast } from 'sonner';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { HiOutlinePlus } from 'react-icons/hi';
import FloatingActionButton from '../../shared/components/FloatingActionButton';
import LoadMoreButton from '../../shared/components/LoadMoreButton';

const ExercisesPage = () => {
    const { getAllExercises, deleteExercise } = useExerciseServices();
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchExercises = async (pageToLoad) => {
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
    return (
        <>
            <Header 
                title={`Ejercicios`}
            />
            <div className='p-4'>
                <ExercisesList
                    exercises={exercises}
                />
                <LoadMoreButton 
                    onClick={handleLoadMore} 
                    loading={loading} 
                    hasMore={hasMore} 
                    text="Cargar más ejercicios" 
                />
            </div>
            <FloatingActionButton 
                text="Ejercicio" 
                onClick={() => navigate('/exercises/create')} 
            />
        </>
    );
};

export default ExercisesPage;
