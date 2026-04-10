
export default function RoutineExerciseList({ routinesExercises, onOpenActions }) {
    const getTargetSummary = (ex) => {
        const parts = [];
            if (ex.targetSets) parts.push(`${ex.targetSets} series`);
            if (ex.targetReps) parts.push(`${ex.targetReps} reps`);
            if (ex.targetDurationSeconds) parts.push(`${ex.targetDurationSeconds / 60} min`);
            if (ex.targetDistanceKm) parts.push(`${ex.targetDistanceKm} km`);
            return parts.join(" • ");
    };

    return (
        <div className="flex flex-col divide-y divide-gray-100 bg-white">
            {routinesExercises.length === 0 ? (
                <p className="text-center p-6 text-gray-500 italic">No hay ejercicios aún</p>
            ) : (
                routinesExercises
                    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)) 
                    .map((item, index) => ( 
                        <div key={item.id} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                            <span className="text-xs font-bold text-blue-500 w-6">
                                {index + 1}
                            </span>

                            <div className="flex-1 ml-2">
                                <p className="font-semibold text-gray-800 leading-tight">
                                    {item.exerciseName || "Ejercicio"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                                    {getTargetSummary(item)}
                                </p>
                            </div>

                            <button
                                onClick={() => onOpenActions(item)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
                            >
                                ⋮
                            </button>
                        </div>
                    ))
            )}
        </div>
);
}
