import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import ExercisesList from './components/ExercisesList';
import BottomSheet from '../../shared/components/BottomSheet';
import { useNavigate } from 'react-router-dom';
import { useExerciseServices } from '../../services/exercises.service';
import { toast } from 'sonner';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const ExercisesPage = () => {
    const [selectedExercise, setSelectedExercise] = useState(null);
    const { getAllExercises, deleteExercise } = useExerciseServices();
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    const fetchExercises = async (pageToLoad) => {
        // Prevents loading multiples petitions
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
                rightAction={<button
                    className="text-blue-600 transition cursor-pointer px-4"
                    onClick={ () => navigate("/exercises/create")}
                >
                    Crear
                </button>}    
            />

            <div className='p-4'>
                <ExercisesList
                    exercises={exercises}
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

export default ExercisesPage;
