import React, { useEffect, useState } from 'react';
import FloatingActionButton from '../../shared/components/FloatingActionButton';
import { LuChevronDown, LuDumbbell, LuSearch, LuX } from 'react-icons/lu';
import { useExerciseServices } from '../../services/exercises.service';
import LoadMoreButton from '../../shared/components/LoadMoreButton';
import ExerciseSkeleton from './components/ExerciseSkeleton';
import EmptyState from '../../shared/components/EmptyState';
import useDebounce from '../../shared/hooks/useDebounce';
import ExercisesList from './components/ExercisesList';
import Header from '../../shared/components/Header';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import FilterBarExercise from './components/FilterBarExercise';

const ExercisesPage = () => {
    const [filters, setFilters] = useState({ type: "", muscleGroup: "" });
    const [pagination, setPagination] = useState({ totalRecords: 0 });
    const { getAllExercises } = useExerciseServices();
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const debouncedSearch = useDebounce(search, 400);

    const fetchExercises = async (pageToLoad, searchTerm, currentFilters) => {
        setLoading(true);
        try {
            const res = await getAllExercises(pageToLoad, 20, searchTerm, currentFilters);
            const newData = res.data;
            
            setPagination(res.pagination);
            setExercises(prev => (pageToLoad === 1 ? newData : [...prev, ...newData]));
            setHasMore(pageToLoad * 20 < res.pagination.totalRecords);
        } catch {
            toast.error("Error al cargar ejercicios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchExercises(1, debouncedSearch, filters);
    }, [debouncedSearch, filters]);

    // Load more exercises
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchExercises(nextPage);
    };

    return (
        <>
            <Header title={`EJERCICIOS`} />
            <div className='p-4'>
                <FilterBarExercise 
                    search={search}
                    setSearch={setSearch}
                    filters={filters}
                    setFilters={setFilters}
                    totalRecords={pagination.totalRecords}
                    placeholder="BUSCAR EJERCICIO..."
                />
                {loading && page === 1 ? (
                    [...Array(10)].map((_, i) => <ExerciseSkeleton key={i} />)
                ) : exercises.length === 0 ? (
                    <EmptyState 
                        message="No se encontraron ejercicios" 
                        icon={LuDumbbell}
                    />
                ) : (
                    <>
                        <ExercisesList exercises={exercises} />
                        
                        {/* El botón solo aparece si hay ejercicios Y si el backend dice que hay más */}
                        {hasMore && (
                            <div className="pt-4 animate-in fade-in zoom-in duration-300">
                                <LoadMoreButton 
                                    onClick={handleLoadMore} 
                                    loading={loading} 
                                    hasMore={hasMore} 
                                    text="Cargar más ejercicios" 
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
            <FloatingActionButton 
                text="Ejercicio" 
                onClick={() => navigate('/exercises/create')} 
            />
        </>
    );
};
export default ExercisesPage;