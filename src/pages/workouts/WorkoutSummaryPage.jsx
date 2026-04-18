import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuTrophy, LuDumbbell, LuTimer, LuChevronRight, LuArrowUp, LuArrowRight, LuArrowUp01  } from 'react-icons/lu';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import confetti from 'canvas-confetti';
import { useWorkoutServices } from '../../services/workout.service';
import { toast } from 'sonner';

const WorkoutSummaryPage = () => {
    const { getWorkoutSummary, updateRoutineProgress } = useWorkoutServices();
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState([]);
    const { workoutId } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await getWorkoutSummary(workoutId);
                setSummary(res.data);
                
                // Pre-select exercises that can progress
                const initialSelected = res.data
                    .filter(ex => ex.canProgress)
                    .map(ex => ex.exerciseId);
                setSelectedIds(initialSelected);

                // Celebration: Trigger confetti if there are PRs or Progressions
                if (res.data.some(ex => ex.canProgress || ex.isPR)) {
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#3b82f6', '#fbbf24', '#ffffff']
                    });
                }
            } catch {
                toast.error("Error al cargar el resumen");
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [workoutId]);

    const handleToggle = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };
    
    const handleConfirm = async () => {
        const updates = summary
            .filter(ex => selectedIds.includes(ex.exerciseId))
            .map(ex => ({
                exerciseId: ex.exerciseId, 
                newWeight: ex.suggestedWeight
            }));

        try {
            if (updates.length > 0) {
                const routineId = summary.find(ex => ex.routineId)?.routineId;
                if (routineId) {
                    await updateRoutineProgress(routineId, updates);
                    toast.success("¡Rutina actualizada con éxito! 💪");
                }
            }
            
            localStorage.removeItem(`pending_extras_${workoutId}`);
            navigate('/workouts');
        } catch  {
            toast.error("Error al guardar los cambios");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-950">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-4xl" />
        </div>
    );

    return (
        <>
            <div className="px-4">
                <div className="pt-10 pb-10 px-6 text-center bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 rounded-b-[3rem] shadow-sm">
                    <div className="inline-flex p-4 bg-amber-50 dark:bg-amber-500/10 rounded-full mb-4 animate-bounce">
                        <LuTrophy className="text-amber-500" size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">
                        ¡Sesión Completada!
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                        Análisis de rendimiento y progresión
                    </p>
                </div>

                <div className="p-6 max-w-2xl mx-auto space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] ml-2">
                            Resultados por ejercicio
                        </h2>
                        
                        <div className="grid gap-4">
                            {summary.map((ex, index) => { 
                                const exerciseType = ex.type?.toLowerCase();
                                const isCardio = exerciseType === 'cardio';
                                const isStrength = exerciseType === 'strength' || !exerciseType; 
                                const sets = ex.setsDone || 0;
                                const weight = ex.maxWeight || 0;
                                const reps = ex.repsDone || 0;
                                const isSelected = selectedIds.includes(ex.exerciseId);

                                return (
                                    <div 
                                        key={`${ex.exerciseId || 'extra'}-${index}`} 
                                        className={`relative rounded-4xl border transition-all duration-300 ${
                                            ex.canProgress && isStrength
                                            ? "bg-white dark:bg-zinc-900 border-blue-200 dark:border-blue-900 shadow-lg" 
                                            : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800"
                                        }`}
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-center mb-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-2xl ${ex.canProgress && isStrength ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"}`}>
                                                        {isCardio ? <LuTimer size={20} /> : <LuDumbbell size={20} />}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-tighter leading-none italic">
                                                            {ex.name}
                                                        </h3>
                                                        <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">
                                                            {isCardio ? 'SESIÓN DE RESISTENCIA' : `${sets} SERIES REALIZADAS`}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* ACTION BUTTON: Only for Strength that can progress */}
                                                {ex.canProgress && isStrength && (
                                                    <button 
                                                        onClick={() => handleToggle(ex.exerciseId)}
                                                        className={`h-10 px-4 rounded-xl font-black text-[10px] uppercase transition-all active:scale-90 ${
                                                            isSelected 
                                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
                                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                                                        }`}
                                                    >
                                                        {isSelected ? "✓ ACEPTADO" : "SUBIR PESO"}
                                                    </button>
                                                )}
                                            </div>

                                            {ex.canProgress && isSelected && isStrength ? (
                                                /* PROGRESSION VIEW (Strength only) */
                                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50 animate-in zoom-in-95 duration-300">
                                                    <span className="text-[8px] font-black text-blue-600 uppercase block mb-1 italic">Próximo objetivo</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg font-bold text-zinc-400 line-through tracking-tighter">{ex.oldWeight}kg</span>
                                                        <LuChevronRight className="text-blue-500" />
                                                        <span className="text-2xl font-black text-zinc-900 dark:text-white italic tracking-tighter">{ex.suggestedWeight}kg</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* SIMPLE SUMMARY VIEW (Here we fix the 0kg x 0reps issue) */
                                                <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-700/50">
                                                    <span className="text-[8px] font-black text-zinc-400 uppercase block mb-1 italic">
                                                        {isCardio ? "Estado de actividad" : "Mejor desempeño de hoy"}
                                                    </span>
                                                    
                                                    <div className="flex items-baseline gap-2">
                                                        {isCardio ? (
                                                            <span className="text-xl font-black text-zinc-800 dark:text-zinc-100 italic">COMPLETADO ✓</span>
                                                        ) : (
                                                            <>
                                                                {/* AQUÍ ESTÁ EL CAMBIO - REEMPLAZA EL peso y kg POR ESTO: */}
                                                                <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100 italic tracking-tighter">
                                                                    {weight}
                                                                    <span className="text-[10px] ml-1 uppercase text-blue-500 not-italic font-black">
                                                                        {ex.weightUnit || 'kg'}
                                                                    </span>
                                                                </span>

                                                                <span className="text-sm font-bold text-zinc-400">x {reps} reps</span>
                                                                {ex.isPR && <span className="ml-auto text-lg drop-shadow-md">🏆</span>}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <button 
                            onClick={handleConfirm}
                            className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-4xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-[0.97] transition-all flex items-center justify-center gap-3"
                        >
                            {selectedIds.length > 0 
                                ? <>Actualizar {selectedIds.length} Pesos <LuArrowUp01 size={18} /></>
                                : "Guardar progreso"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WorkoutSummaryPage;