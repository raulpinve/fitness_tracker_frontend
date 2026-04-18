import { useNavigate } from "react-router-dom";

export default function RoutineExerciseList({ routinesExercises, onOpenActions }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const getTargetSummary = (ex) => {
        const parts = [];
        if (ex.targetSets) parts.push(`${ex.targetSets} series`);
        if (ex.targetReps) parts.push(`${ex.targetReps} reps`);
        if (ex.targetWeight) parts.push(`${ex.targetWeight}kg`);
        if (ex.targetDurationSeconds) parts.push(`${ex.targetDurationSeconds / 60}min`);
        if (ex.targetDistanceKm) parts.push(`${ex.targetDistanceKm}km`);
        return parts.join(" • ");
    };

    return (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800/50 bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800/50 overflow-hidden">
            {routinesExercises
                .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
                .map((item, index) => (
                    <div 
                        key={item.id} 
                        className="flex items-center p-3 transition-colors group cursor-pointer active:bg-gray-100 dark:active:bg-zinc-800/80"
                        onClick={() => navigate(`/exercises/${item.exerciseId}`)}
                    >
                        <div className="flex flex-col items-center justify-center w-6 mr-1">
                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-500/80 uppercase">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-zinc-800 flex-shrink-0 overflow-hidden border border-gray-200 dark:border-zinc-700 flex items-center justify-center transition-transform group-hover:scale-105">
                            {item.avatarThumbnail ? (
                                <img 
                                    src={`${API_URL}/uploads/exercises/${item.exerciseId}/${item.avatarThumbnail}`} 
                                    alt="" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-zinc-400 text-xs font-bold">
                                    {item.exerciseName?.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 ml-3 overflow-hidden">
                            <p className="font-bold text-zinc-800 dark:text-zinc-100 text-sm truncate leading-tight group-hover:text-blue-600 transition-colors">
                                {item.exerciseName || "Ejercicio"}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest truncate">
                                    {getTargetSummary(item)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenActions(item);
                            }}
                            className="p-4 -mr-2 cursor-pointer text-zinc-300 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all active:bg-zinc-100 dark:active:bg-zinc-800 rounded-full z-10"
                        >
                            <span className="text-2xl leading-none">⋮</span>
                        </button>
                    </div>
                ))
            }
        </div>
    );
}