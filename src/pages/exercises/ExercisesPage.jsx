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
    const { getAllExercises } = useExerciseServices();
    const navigate = useNavigate();

    // States
    const [exercises, setExercises] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [pagination, setPagination] = useState({ totalRecords: 0 });
    
    // Filtering states
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({ type: "", muscleGroup: "" });
    
    // We apply debounce only to the search text
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

    // This effect runs when the user stops typing
    // Or when a selection filter changes (which is instant)
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
            <div className="p-6 pt-10 pb-4">
                <div className="flex items-stretch gap-4">
                    {/* Barra con degradado y brillo azul */}
                    <div className="w-2.5 rounded-full bg-gradient-to-b from-blue-600 to-blue-400 shadow-[4px_0_20px_rgba(37,99,235,0.4)]" />
                    
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter leading-none italic">
                            Ejercicios
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">
                                {pagination.totalRecords} <span className="text-blue-500">Movimientos</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

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
                    <ExercisesList 
                        exercises={exercises} 
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
                text="Ejercicio" 
                onClick={() => navigate('/exercises/create')} 
            />
        </>
    );
};

export default ExercisesPage;
