import React from 'react';
import { useWorkoutSetServices } from '../../../services/workoutSet.service';
import { useCardioLogServices } from '../../../services/cardioLog.service'; 
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LuDumbbell, LuPenLine, LuPlus, LuTimer, LuTrash2, LuX } from 'react-icons/lu';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'sonner';
import HistorySkeleton from './HistorySkeleton';
import BottomSheet from '../../../shared/components/BottomSheet';
import { useWorkoutExerciseServices } from '../../../services/workoutExercise.service';

const ExerciseBlock = ({ exercise, workout, onRemove }) => {
    const { getAllWorkoutSets, createWorkoutSet, deleteWorkoutSet } = useWorkoutSetServices();
    const { getAllCardioLogs, createCardioLog, deleteCardioLog } = useCardioLogServices();
    const { deleteWorkoutExercise } = useWorkoutExerciseServices();
    const { register, handleSubmit, setValue, watch} = useForm();
    const [history, setHistory] = useState([]);
    const [isLoadingCreate, setIsLoadingCreate] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [weightUnit, setWeightUnit] = useState('kg');
    const [openSetActions, setOpenSetActions] = useState(false);
    const [showNotes, setShowNotes] = useState(exercise.notes ? true : false);
    const navigate = useNavigate();
    
    const isCardio = exercise.exerciseType === 'cardio';
    const isReadOnly = !!workout.finishedAt;
    const { id: workoutId } = workout;
    const exerciseId = exercise.exerciseId;

    const getTargetText = () => {
        const parts = [];
        if (exercise.targetSets) parts.push(`${exercise.targetSets} SERIES`);
        if (exercise.targetReps) parts.push(`${exercise.targetReps} REPS`);
        if (exercise.targetWeight) parts.push(`${exercise.targetWeight}KG`);
        
        if (exercise.targetDurationSeconds) {
            const mins = Math.floor(Number(exercise.targetDurationSeconds) / 60);
            if (!isNaN(mins)) parts.push(`${mins}MIN`);
        }
        
        if (exercise.targetDistanceKm) parts.push(`${exercise.targetDistanceKm}KM`);
        return parts.length > 0 ? `OBJETIVO: ${parts.join(" • ")}` : null;
    };
    const targetText = getTargetText();
    
    useEffect(() => {
        const fetchData = async () => {
            if (!workoutId || !exerciseId) return;
            setLoadingHistory(true);
            try {
                const res = isCardio 
                    ? await getAllCardioLogs({ workoutId, exerciseId })
                    : await getAllWorkoutSets({ workoutId, exerciseId });
                
                setHistory(res.data);

                if (res.data.length > 0) {
                    const last = res.data[res.data.length - 1];
                    if (isCardio) {
                        setValue("distance", last.distanceKm);
                        setValue("minutes", last.durationSeconds / 60);
                    } else {
                        setValue("weight", last.weight);
                    }
                }
            } catch  {
                setHistory([]);
            } finally {
                setLoadingHistory(false)
            }
        };
        fetchData();
    }, [workoutId, exerciseId, isCardio, setValue]);

    const onSubmit = async (data) => {
        setIsLoadingCreate(true);
        try {
            let response;

            if (isCardio) {
                // Transform minutes to seconds for the Backend
                response = await createCardioLog({
                    workoutId,
                    exerciseId: exercise.exerciseId,
                    durationSeconds: parseInt(data.minutes) * 60, 
                    distanceKm: data.distance ? parseFloat(data.distance) : null,
                    calories: data.calories || null,
                    avgHeartRate: data.avgHeartRate || null
                });
            } else {
                // Standard Strength Log
                response = await createWorkoutSet({
                    workoutId,
                    exerciseId: exercise.exerciseId,
                    reps: parseInt(data.reps),
                    weight: parseFloat(data.weight),
                    rpe: data.rpe ? parseInt(data.rpe) : null,
                    weightUnit: weightUnit 
                });
            }

            if (response.statusCode === 201) {
                // 1. Get current pending extras for THIS workout
                const storageKey = `pending_extras_${workoutId}`;
                const localExtras = JSON.parse(localStorage.getItem(storageKey)) || [];

                // 2. Remove THIS exercise from pending extras since it's now in the DB
                const updatedExtras = localExtras.filter(extra => extra.exerciseId !== exerciseId);
                
                if (updatedExtras.length > 0) {
                    localStorage.setItem(storageKey, JSON.stringify(updatedExtras));
                } else {
                    localStorage.removeItem(storageKey);
                }

                setHistory(prev => [...prev, response.data]);
                if (isCardio) {
                    setValue("minutes", "");
                    setValue("distance", "");
                } else {
                    setValue("reps", ""); 
                    setValue("rpe", null); 
                }
            }
        } catch {
            toast.error("Error saving record");
        } finally {
            setIsLoadingCreate(false);
        }
    };

    const handleDeleteLog = async (id) => {
        try {
            if (isCardio) { 
                await deleteCardioLog(id);
            } else {
                await deleteWorkoutSet(id);
            }
            setHistory(prev => prev.filter(item => item.id !== id));
            toast.success("Registro eliminado");

        } catch {
            toast.error("Error al eliminar");
        }
    };

    const onDeleteExercise = async () => {
        const confirm = window.confirm("¿Quitar este ejercicio del entrenamiento?");
        if (!confirm) return;

        try {
            if (exercise.workoutExerciseId) {
                await deleteWorkoutExercise(exercise.workoutExerciseId);
            }
            onRemove(exercise.exerciseId);
            toast.success("Ejercicio quitado");
        } catch {
            toast.error("No se pudo quitar el ejercicio");
        }
    };

    const handleOpenSetActions = (item) => {
        setSelectedItem(item);
        setOpenSetActions(true);
    };

    return (<>
        <div className="group relative bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-4xl p-6 shadow-sm mb-6 transition-all">
            <div className="flex justify-between items-center mb-5">
                <div 
                    className="flex items-center gap-4 cursor-pointer active:scale-95 transition-transform"
                    onClick={() => navigate(`/exercises/${exercise.exerciseId}`)}
                >
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                        {isCardio ? <LuTimer className="text-blue-600" size={20}/> : <LuDumbbell className="text-blue-600" size={20}/>}
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-tighter group-hover:text-blue-600 transition-colors leading-tight">
                            {exercise.exerciseName || exercise.name}
                        </h3>
                        {targetText && (
                            <p className="text-[9px] font-black text-blue-500/80 uppercase tracking-[0.15em] mt-0.5">
                                {targetText}
                            </p>
                        )}
                    </div>
                </div>
                {!isReadOnly && (
                    <button 
                        className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                        onClick={onDeleteExercise}
                    >
                        <LuX size={20} />
                    </button>
                )}
            </div>

            {/* List of Completed Sets (Horizontal Pills) */}
            {loadingHistory ? (
                <HistorySkeleton />
            ) : history.length > 0 ? (
                <div className="flex flex-wrap gap-3 mb-5">
                    {history.map((item, index) =>{
                        const isPR = !isCardio && 
                            exercise.personalRecord && 
                            Number(item.weight) > Number(exercise.personalRecord);

                        return (
                            <div 
                                key={item.id} 
                                onClick={() => !isReadOnly && handleOpenSetActions(item)}
                                className="relative flex flex-col items-center justify-center min-w-18.75 py-3 px-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 active:scale-95 transition-all cursor-pointer group"
                            >   
                                {isPR && (
                                    <div className="absolute -bottom-2 -right-1 bg-amber-400 text-zinc-900 rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-950 z-20 animate-bounce">
                                        <span className="text-[10px]">🏆</span>
                                    </div>
                                )}
                                {/* Badge del RPE en la Pill */}
                                {!isCardio && item.rpe && (
                                    <div className="absolute -top-2.5 -left-2.5 w-6 h-6 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-md border-2 border-zinc-50 dark:border-zinc-950 text-xs z-10 animate-in zoom-in duration-300">
                                        {item.rpe === 6 && "😊"}
                                        {item.rpe === 7 && "😐"}
                                        {item.rpe === 8 && "😬"}
                                        {item.rpe === 9 && "🥵"}
                                        {item.rpe === 10 && "💀"}
                                    </div>
                                )}

                                <span className="text-[8px] font-black text-blue-500 uppercase mb-1 tracking-widest">
                                    {isCardio ? 'LOG' : `SET ${index + 1}`}
                                </span>
                                <div className="text-xs font-black text-zinc-700 dark:text-zinc-200 flex flex-col items-center leading-tight">
                                    {isCardio ? (
                                        <>
                                            <span className="whitespace-nowrap">
                                                {Math.floor(Number(item.durationSeconds || 0) / 60)}m
                                            </span>
                                            <span className="opacity-40 text-[10px]">
                                                {Number(item.distanceKm || 0)}k
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="whitespace-nowrap flex items-baseline gap-0.5">
                                                {item.weight}
                                                <span className="text-[8px] text-blue-500 uppercase italic">
                                                    {item.weightUnit || 'kg'}
                                                </span>
                                            </span>
                                            <span className="opacity-40 text-[10px]">{item.reps}r</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )})}
                </div>
            ): (
                <div className="h-16 flex items-center mb-5">
                    <p className="text-[9px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.2em]">
                        Sin registros en esta sesión
                    </p>
                </div>
            )}

            {!isReadOnly && !isCardio && (
                <div className="flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/30 p-1.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 mb-3">
                    {[
                        { val: 6, emo: "😊" },
                        { val: 7, emo: "😐" },
                        { val: 8, emo: "😬" },
                        { val: 9, emo: "🥵" },
                        { val: 10, emo: "💀" }
                    ].map((rpe) => (
                        <button
                            key={rpe.val}
                            type="button"
                            onClick={() => {
                                if ("vibrate" in navigator) navigator.vibrate(20); 
                                
                                // Obtenemos el valor actual
                                const currentRpe = watch("rpe");
                                
                                // Si el valor que tocas es el mismo que ya está, lo quitamos (null)
                                // De lo contrario, ponemos el nuevo valor
                                setValue("rpe", currentRpe === rpe.val ? null : rpe.val);
                            }}
                            className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all duration-300 ${
                                watch("rpe") === rpe.val 
                                ? "bg-white dark:bg-zinc-800 shadow-md scale-110 border border-zinc-200 dark:border-zinc-700" 
                                : "opacity-30 grayscale hover:opacity-100 hover:grayscale-0"
                            }`}
                        >
                            <span className="text-xl">{rpe.emo}</span>
                            <span className={`text-[7px] font-black mt-1 uppercase tracking-tighter ${
                                watch("rpe") === rpe.val ? "text-blue-600" : "text-zinc-500"
                            }`}>
                                {rpe.val === 10 ? 'MAX' : `RPE ${rpe.val}`}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Input Form */}
            {!isReadOnly && (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800/50 flex items-center gap-4 shadow-inner">
                    <div className="flex flex-1 gap-2 items-end"> {/* 1. Cambiamos a items-end para alinear los inputs abajo */}
                        
                        {/* BLOQUE DE PESO / MINUTOS */}
                        <div className="flex-1 flex flex-col justify-end min-h-[54px]"> {/* 2. Altura mínima para igualar bloques */}
                            <div className="flex justify-between items-center pr-1 mb-1.5">
                                <label className="text-[8px] font-black text-zinc-400 uppercase ml-2 tracking-[0.2em]">
                                    {isCardio ? 'Minutos' : 'Peso'}
                                </label>
                                
                                {!isCardio && (
                                    <button 
                                        type="button"
                                        onClick={() => setWeightUnit(weightUnit === 'kg' ? 'lb' : 'kg')}
                                        className={`flex items-center justify-center h-5 px-2 rounded-full text-[8px] font-black tracking-tighter transition-all active:scale-75 ${
                                            weightUnit === 'lb' 
                                            ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]" 
                                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 border border-zinc-300/50 dark:border-zinc-700/50"
                                        }`}
                                    >
                                        {weightUnit.toUpperCase()}
                                    </button>
                                )}
                            </div>
                            <input 
                                type="number" 
                                step="0.25" 
                                {...register(isCardio ? "minutes" : "weight", { required: true })} 
                                className="w-full bg-transparent text-lg font-black pl-2 focus:outline-none dark:text-white leading-none" 
                                placeholder="0" 
                            />
                        </div>

                        {/* Separador visual centrado con los inputs */}
                        <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 mb-1 opacity-50" />

                        {/* BLOQUE DE REPS / DISTANCIA */}
                        <div className="flex-1 flex flex-col justify-end min-h-[54px]"> {/* 3. Misma altura mínima y flex-col */}
                            <div className="h-5 mb-1.5 flex items-center"> {/* 4. Placeholder invisible para igualar el botón de arriba */}
                                <label className="text-[8px] font-black text-zinc-400 uppercase ml-2 tracking-widest">
                                    {isCardio ? 'Distancia' : 'Reps'}
                                </label>
                            </div>
                            <input 
                                type="number" 
                                step="0.1" 
                                {...register(isCardio ? "distance" : "reps", { required: true })} 
                                className="w-full bg-transparent text-lg font-black pl-2 focus:outline-none dark:text-white leading-none" 
                                placeholder="0" 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoadingCreate}
                        className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-[0.85] transition-all disabled:opacity-50 shrink-0"
                    >
                        {isLoadingCreate ? <AiOutlineLoading3Quarters className="animate-spin text-xs" /> : <LuPlus size={24} strokeWidth={4} />}
                    </button>
                </form>
            )}
        </div>

        <BottomSheet open={openSetActions} onClose={() => setOpenSetActions(false)}>
            <div className="max-w-md mx-auto pt-2 pb-8 px-6">
                {/* Selected Set Header */}
                <div className="text-center mb-8">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">
                        Detalles del Registro
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100 italic">
                                {isCardio 
                                    ? (Number(selectedItem?.durationSeconds || 0) / 60) 
                                    : (Number(selectedItem?.weight || 0))
                                }
                            </span>
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                {isCardio ? 'Minutos' : 'Kilogramos'}
                            </span>

                        </div>
                        <div className="w-px h-10 bg-zinc-100 dark:bg-zinc-800" />
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100 italic">
                                {isCardio ? selectedItem?.distanceKm : selectedItem?.reps}
                            </span>
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                {isCardio ? 'Kilómetros' : 'Reps'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button 
                        onClick={() => {
                            handleDeleteLog(selectedItem.id);
                            setOpenSetActions(false);
                        }}
                        className="w-full py-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.97] transition-all border border-red-100 dark:border-red-900/30"
                    >
                        <LuTrash2 size={18} />
                        Eliminar Registro
                    </button>
                    
                    <button 
                        onClick={() => setOpenSetActions(false)}
                        className="w-full py-4 text-zinc-400 dark:text-zinc-500 font-black text-[10px] uppercase tracking-widest active:bg-zinc-50 dark:active:bg-zinc-900 rounded-2xl transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </BottomSheet>

    </>);
};

export default ExerciseBlock;