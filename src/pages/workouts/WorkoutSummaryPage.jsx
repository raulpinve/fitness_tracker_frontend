import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkoutServices } from '../../services/workout.service';
import Header from '../../shared/components/Header';
import Button from '../../shared/components/Button';
import { toast } from 'sonner';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaArrowUp, FaDumbbell, FaRunning } from 'react-icons/fa';

const WorkoutSummaryPage = () => {
    const { workoutId } = useParams();
    const navigate = useNavigate();
    const { getWorkoutSummary, updateRoutineProgress } = useWorkoutServices();
    
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await getWorkoutSummary(workoutId);
                setSummary(res.data);
                // Pre-seleccionamos los que pueden progresar
                const initialSelected = res.data
                    .filter(ex => ex.canProgress)
                    .map(ex => ex.exerciseId);
                setSelectedIds(initialSelected);
            } catch (error) {
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
        // Verificamos que el resumen tenga datos
        if (summary.length === 0) return navigate('/workouts');

        const updates = summary
            .filter(ex => selectedIds.includes(ex.exerciseId))
            .map(ex => ({
                exerciseId: ex.exerciseId,
                newWeight: ex.suggestedWeight
            }));

        try {
            if (updates.length > 0) {
                // Tomamos el routineId del primer elemento del array
                const routineId = summary[0].routineId; 
                
                await updateRoutineProgress(routineId, updates);
                toast.success("¡Pesos actualizados en tu rutina!");
            }
            navigate('/workouts');
        } catch (error) {
            toast.error("Error al actualizar pesos");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen dark:bg-zinc-950">
                <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-4xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            <Header title="Resumen de sesión" showBack={false} />
            
            <div className="p-4 max-w-2xl mx-auto grid gap-4">
                <div className="text-center py-6">
                    <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">¡Buen trabajo!</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">Analizamos tu desempeño en esta sesión</p>
                </div>

                <div className="grid gap-4">
                    {summary.map((ex) => (
                        <div 
                            key={ex.exerciseId} 
                            className="border border-gray-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-zinc-950 shadow-sm relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        {ex.type === 'cardio' ? 
                                            <FaRunning className="text-blue-600 dark:text-blue-400" /> : 
                                            <FaDumbbell className="text-blue-600 dark:text-blue-400" />
                                        }
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{ex.name}</h3>
                                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold">
                                            {ex.type === 'strength' 
                                                ? `Meta: ${ex.targetReps} reps ${ex.oldWeight > 0 ? `• ${ex.oldWeight} kg` : ''}`
                                                : `Meta: Cardio`}
                                        </p>
                                    </div>
                                </div>

                                {ex.canProgress && (
                                    <input 
                                        type="checkbox" 
                                        checked={selectedIds.includes(ex.exerciseId)}
                                        onChange={() => handleToggle(ex.exerciseId)}
                                        className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 dark:bg-zinc-900"
                                    />
                                )}
                            </div>

                            {ex.canProgress ? (
                                <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg border-l-4 border-blue-400 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FaArrowUp className="text-blue-500 text-xs" />
                                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
                                            Sugerencia: {ex.suggestedWeight} kg
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">
                                        Mejora disponible
                                    </span>
                                </div>
                            ) : (
                                <div className="bg-gray-50 dark:bg-zinc-900/50 p-2 rounded-lg text-center">
                                    <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                                        Mantener objetivo actual
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Botón de acción al final del scroll */}
                <div className="mt-6">
                    <Button 
                        colorButton="primary"
                        onClick={handleConfirm}
                        className="w-full py-4 rounded-xl font-bold shadow-lg"
                    >
                        {selectedIds.length > 0 
                            ? `Actualizar ${selectedIds.length} ejercicios y finalizar` 
                            : "Finalizar resumen"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default WorkoutSummaryPage;
