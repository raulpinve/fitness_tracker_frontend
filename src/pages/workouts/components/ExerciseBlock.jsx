import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWorkoutSetServices } from '../../../services/workoutSet.service';
import { useCardioLogServices } from '../../../services/cardioLog.service'; 
import { toast } from 'sonner';
import { LuPlus, LuTrash2, LuDumbbell, LuTimer, LuX } from 'react-icons/lu';

export default function ExerciseBlock ({ exercise, workout, onRemove }) {
    const [history, setHistory] = useState([]);
    const { register, handleSubmit, reset, setValue } = useForm();
    const { getAllWorkoutSets, createWorkoutSet, deleteWorkoutSet } = useWorkoutSetServices();
    const { getAllCardioLogs, createCardioLog, deleteCardioLog} = useCardioLogServices();
    
    const isCardio = exercise.exerciseType === 'cardio';
    const workoutExerciseId = exercise.workoutExerciseId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = isCardio 
                    ? await getAllCardioLogs(workoutExerciseId)
                    : await getAllWorkoutSets(workoutExerciseId);
                setHistory(res.data);
                
                if (res.data.length > 0) {
                    const last = res.data[res.data.length - 1];
                    setValue(isCardio ? "distance" : "weight", isCardio ? last.distanceKm : last.weight);
                }
            } catch (error) { console.error(error); }
        };
        fetchData();
    }, [workoutExerciseId, isCardio, setValue]);

    const onSubmit = async (data) => {
        try {
            const response = isCardio 
                ? await createCardioLog({ workoutExerciseId, durationSeconds: parseInt(data.minutes) * 60, distanceKm: data.distance ? parseFloat(data.distance) : null })
                : await createWorkoutSet({ workoutExerciseId, reps: parseInt(data.reps), weight: parseFloat(data.weight) });

            if (response.statusCode === 201) {
                setHistory([...history, response.data]);
                setValue("reps", ""); 
            }
        } catch (error) { toast.error("Error al guardar"); }
    };

    const handleDeleteLog = async (id) => {
        if (!window.confirm("¿Eliminar este registro?")) return;
        try {
            if (isCardio) await deleteCardioLog(id);
            else await deleteWorkoutSet(id);
            setHistory(prev => prev.filter(item => item.id !== id));
            toast.success("Eliminado");
        } catch (error) { toast.error("Error al eliminar"); }
    };

    return (
        <div className="group relative bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2rem] p-6 shadow-sm mb-6 transition-all">
            
            {/* Header: Solo Título e Icono */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl">
                        {isCardio ? <LuTimer className="text-blue-600" size={20}/> : <LuDumbbell className="text-blue-600" size={20}/>}
                    </div>
                    <h3 className="text-lg font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-tighter">
                        {exercise.exerciseName || exercise.name}
                    </h3>
                </div>
                {!workout.finishedAt && (
                    <button onClick={() => onRemove(workoutExerciseId)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
                        <LuX size={20} />
                    </button>
                )}
            </div>

            {/* Listado de Registros en Formato "Pill" Horizontal */}
            <div className="flex flex-wrap gap-3 mb-4">
                {history.map((item, index) => (
                    <div key={item.id} className="relative flex flex-col items-center justify-center min-w-[75px] py-3 px-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 group/item transition-all">
                        <span className="text-[8px] font-black text-blue-500 uppercase mb-1">
                            {isCardio ? 'LOG' : `SET ${index + 1}`}
                        </span>
                        <div className="text-xs font-black text-zinc-700 dark:text-zinc-200 flex flex-col items-center leading-tight">
                            {isCardio ? (
                                <><span className="whitespace-nowrap">{item.durationSeconds / 60}m</span><span className="opacity-40">{item.distanceKm}k</span></>
                            ) : (
                                <><span className="whitespace-nowrap">{item.weight}kg</span><span className="opacity-40">{item.reps}r</span></>
                            )}
                        </div>
                        {!workout.finishedAt && (
                            <button 
                                onClick={() => handleDeleteLog(item.id)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/item:opacity-100 transition-opacity shadow-lg"
                            >
                                <LuTrash2 size={10} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Formulario Estilo "Control Panel" */}
            {!workout.finishedAt && (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800/50 flex items-center gap-4 shadow-inner">
                    <div className="flex flex-1 gap-2">
                        <div className="flex-1">
                            <label className="text-[8px] font-black text-zinc-400 uppercase ml-2 tracking-widest">
                                {isCardio ? 'Minutos' : 'Peso'}
                            </label>
                            <input type="number" step="0.25" {...register(isCardio ? "minutes" : "weight", { required: true })} className="w-full bg-transparent text-sm font-black p-1 focus:outline-none dark:text-white" placeholder="0" />
                        </div>
                        <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 self-end mb-2 opacity-50" />
                        <div className="flex-1">
                            <label className="text-[8px] font-black text-zinc-400 uppercase ml-2 tracking-widest">
                                {isCardio ? 'Distancia' : 'Reps'}
                            </label>
                            <input type="number" step="0.1" {...register(isCardio ? "distance" : "reps", { required: true })} className="w-full bg-transparent text-sm font-black p-1 focus:outline-none dark:text-white" placeholder="0" />
                        </div>
                    </div>
                    <button type="submit" className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-[0.85] transition-all">
                        <LuPlus size={24} strokeWidth={4} />
                    </button>
                </form>
            )}
        </div>
    );
};
