
export default function RoutineExerciseList({ routinesExercises, onOpenActions }) {
    const getTargetSummary = (ex) => {
        const parts = [];
            if (ex.targetSets) parts.push(`${ex.targetSets} series`);
            if (ex.targetReps) parts.push(`${ex.targetReps} reps`);
            if (ex.targetWeight) parts.push(`${ex.targetWeight} kg`);
            if (ex.targetDurationSeconds) parts.push(`${ex.targetDurationSeconds / 60} min`);
            if (ex.targetDistanceKm) parts.push(`${ex.targetDistanceKm} km`);
            return parts.join(" • ");
    };

    return (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
            {routinesExercises.length === 0 ? (
                <p className="text-center p-6 text-gray-500 dark:text-zinc-400 italic">No hay ejercicios aún</p>
            ) : (
                routinesExercises
                    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)) 
                    .map((item, index) => ( 
                        <div key={item.id} className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                            <span className="text-xs font-bold text-blue-500 dark:text-blue-400 w-6">
                                {index + 1}
                            </span>

                            <div className="flex-1 ml-2">
                                <p className="font-semibold text-gray-800 dark:text-zinc-100 leading-tight">
                                    {item.exerciseName || "Ejercicio"}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1 uppercase tracking-wide">
                                    {getTargetSummary(item)}
                                </p>
                            </div>

                            <button
                                onClick={() => onOpenActions(item)}
                                className="p-2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800"
                            >
                                ⋮
                            </button>
                        </div>
                    ))
            )}
        </div>
    );
}
