import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LuHistory, 
    LuDumbbell, 
    LuTimer, 
    LuChevronRight, 
    LuActivity, 
    LuArrowRight, 
    LuPlus 
} from 'react-icons/lu';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useWorkoutServices } from '../../services/workout.service';
import LoadMoreButton from '../../shared/components/LoadMoreButton';

const WorkoutLogPage = () => {
    const navigate = useNavigate();
    const { getWorkoutHistory } = useWorkoutServices();
    
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    
    // Estados de paginación
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const fetchHistory = async (pageNumber, isLoadMore = false) => {
        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        try {
            const res = await getWorkoutHistory(pageNumber, 10);
            if (isLoadMore) {
                setHistory(prev => [...prev, ...res.data]);
            } else {
                setHistory(res.data);
            }
            setHasMore(res.pagination.hasNextPage);
        } catch (error) {
            toast.error("Error al cargar el historial");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchHistory(1);
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchHistory(nextPage, true);
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading && page === 1) return (
        <div className="flex justify-center items-center h-screen bg-zinc-950">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-4xl" />
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black p-6 pb-32">
            {/* TÍTULO POWER BAR */}
            <div className="pt-10 pb-10 flex items-stretch gap-4">
                <div className="w-2.5 rounded-full bg-gradient-to-b from-blue-600 to-blue-400 shadow-[4px_0_20px_rgba(37,99,235,0.3)]" />
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none">
                        Bitácora
                    </h1>
                    <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em] mt-2 ml-1">
                        Historial de <span className="text-blue-500 text-xs">Entrenamientos</span>
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {history.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <LuHistory size={48} className="mx-auto mb-4 text-zinc-300" />
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-500">No hay registros aún</p>
                    </div>
                ) : (
                    <>
                        {history.map((log, index) => {
                            const isExpanded = expandedId === log.id;
                            return (
                                <div 
                                    key={`${log.id}-${index}`}
                                    className={`group relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${
                                        isExpanded 
                                        ? "bg-white dark:bg-zinc-900 border-blue-500/30 shadow-2xl ring-1 ring-blue-500/10" 
                                        : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
                                    }`}
                                >
                                    <div onClick={() => toggleExpand(log.id)} className="p-6 cursor-pointer select-none">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                                    <LuTimer size={12} />
                                                    {format(new Date(log.startedAt), "EEEE, d 'de' MMMM", { locale: es })}
                                                </span>
                                                <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-tight italic leading-none mt-1">
                                                    {log.name || "Sesión Libre"}
                                                </h3>
                                            </div>
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                                isExpanded ? 'bg-blue-600 text-white rotate-90' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                                            }`}>
                                                <LuChevronRight size={20} strokeWidth={3} />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-zinc-400 uppercase mb-1 italic tracking-widest">Carga Total</span>
                                                <div className="flex items-center gap-2">
                                                    <LuDumbbell className="text-blue-500" size={14} />
                                                    <span className="text-sm font-black text-zinc-700 dark:text-zinc-200">
                                                        {Number(log.totalVolume).toLocaleString()} <span className="text-[10px] text-blue-600 italic">kg</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-px h-8 bg-zinc-100 dark:bg-zinc-800" />
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-zinc-400 uppercase mb-1 italic tracking-widest">Variedad</span>
                                                <div className="flex items-center gap-2">
                                                    <LuActivity className="text-blue-500" size={14} />
                                                    <span className="text-sm font-black text-zinc-700 dark:text-zinc-200">
                                                        {log.exerciseCount} <span className="text-[10px] text-zinc-400 italic">{log.exerciseCount === 1 ? 'Ejerc.' : 'Ejercs.'}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="px-6 pb-6 pt-2 bg-zinc-50/50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800/50">
                                            <h4 className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em] mb-4 mt-2">Resumen de ejercicios</h4>
                                            <div className="space-y-4">
                                                {log.exercisesPreview?.split(', ').map((exName, idx) => (
                                                    <div key={idx} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                                            <span className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase italic tracking-tight">{exName}</span>
                                                        </div>
                                                        <span className="text-[8px] font-black text-zinc-400 uppercase">Completado ✓</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); navigate(`/workouts/${log.id}/summary`); }}
                                                className="w-full mt-8 py-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl text-[9px] font-black text-zinc-500 hover:text-blue-600 uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                                            >
                                                Ver análisis completo <LuArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="mt-8 mb-12">
                            <LoadMoreButton 
                                onClick={handleLoadMore} 
                                loading={loadingMore} 
                                hasMore={hasMore} 
                                text="Cargar más bitácoras" 
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WorkoutLogPage;
