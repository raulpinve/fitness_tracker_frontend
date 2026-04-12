import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useWorkoutSetServices } from '../../../services/workoutSet.service';
import { useCardioLogServices } from '../../../services/cardioLog.service'; 
import { toast } from 'sonner';

const ExerciseBlock = ({ exercise, workout, onRemove }) => {
    const [history, setHistory] = useState([]);
    const { register, handleSubmit, reset } = useForm();
    const { getAllWorkoutSets, createWorkoutSet, deleteWorkoutSet } = useWorkoutSetServices();
    const { getAllCardioLogs, createCardioLog, deleteCardioLog} = useCardioLogServices();
    const isCardio = exercise.type === 'cardio';
    const workoutExerciseId = exercise.workoutExerciseId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Consultamos la tabla correcta según el tipo
                const res = isCardio 
                    ? await getAllCardioLogs(workoutExerciseId)
                    : await getAllWorkoutSets(workoutExerciseId);
                setHistory(res.data); 
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        fetchData();
    }, [workoutExerciseId, isCardio]);

    const onSubmit = async (data) => {
        try {
            let response;
            if (isCardio) {
                response = await createCardioLog({
                    workoutExerciseId,
                    durationSeconds: parseInt(data.minutes) * 60,
                    distanceKm: data.distance ? parseFloat(data.distance) : null
                });
            } else {
                response = await createWorkoutSet({
                    workoutExerciseId,
                    reps: parseInt(data.reps),
                    weight: parseFloat(data.weight)
                });
            }

            if (response.statusCode === 201) {
                setHistory([...history, response.data]);
                reset(); 
            }
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    const handleDeleteLog = async (id) => {
        if (!window.confirm("¿Eliminar este registro?")) return;

        try {
            if (isCardio) {
                await deleteCardioLog(id);
            } else {
                await deleteWorkoutSet(id);
            }
            
            // Filtramos el estado para quitar el elemento borrado
            setHistory(prev => prev.filter(item => item.id !== id));
            toast.success("Registro eliminado");
        } catch (error) {
            toast.error("No se pudo eliminar");
        }
    };

    return (
        <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-zinc-950 shadow-sm relative mb-4">
            {!workout.finishedAt && (
                <button 
                    onClick={() => onRemove(workoutExerciseId)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-sm"
                >
                    Saltar
                </button>
            )}
            
            <h3 className="text-xl font-bold mb-4 dark:text-zinc-100">
                {exercise.exerciseName || exercise.name}
            </h3>

            {/* Listado de Series o Logs de Cardio */}
            <div className="space-y-2 mb-4">
                {/* Dentro del map de history */}
                {history.map((item, index) => (
                    <div key={item.id} className="group flex justify-between items-center bg-gray-50 dark:bg-zinc-900 p-2 rounded border-l-4 border-blue-400">
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-500 dark:text-zinc-400 text-[10px] uppercase">
                                {isCardio ? 'Sesión' : `SET ${index + 1}`}
                            </span>
                            <div className="flex gap-4 dark:text-zinc-200 text-sm">
                                {isCardio ? (
                                    <>
                                        <span>{item.durationSeconds / 60} min</span>
                                        {item.distanceKm && <span>{item.distanceKm} km</span>}
                                    </>
                                ) : (
                                    <>
                                        <span>{item.weight} kg</span>
                                        <span>{item.reps} reps</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Botón de eliminar serie */}
                        {!workout.finishedAt && (
                            <button 
                                onClick={() => handleDeleteLog(item.id)}
                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                title="Eliminar serie"
                            >
                                <svg xmlns="http://w3.org" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Formulario Dinámico */}
            {!workout.finishedAt && (
                <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 items-end border-t border-gray-200 dark:border-zinc-800 pt-4">
                    {isCardio ? (
                        <>
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase">Minutos</label>
                                <input type="number" {...register("minutes", { required: true })} className="input-form dark:bg-zinc-900" placeholder="0" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase">Km</label>
                                <input type="number" step="0.1" {...register("distance")} className="input-form dark:bg-zinc-900" placeholder="0.0" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase">Peso (kg)</label>
                                <input type="number" step="0.25" {...register("weight", { required: true })} className="input-form dark:bg-zinc-900" placeholder="0" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase">Reps</label>
                                <input type="number" {...register("reps", { required: true })} className="input-form dark:bg-zinc-900" placeholder="0" />
                            </div>
                        </>
                    )}
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 h-[38px]">+</button>
                </form>
            )}
        </div>
    );
};

export default ExerciseBlock;
