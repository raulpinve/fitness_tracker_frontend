import { useNavigate } from "react-router-dom";

export default function WorkoutsList({ workouts, onOpenActions }) {
    const navigate = useNavigate();

    const getDuration = (start, end) => {
        if (!end) return "En progreso...";
        const diff = new Date(end) - new Date(start);
        const minutes = Math.floor(diff / 1000 / 60);
        return `${minutes} min`;
    };

    return (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
            {workouts.length === 0 ? (
                <p className="text-center p-6 text-gray-500 dark:text-zinc-400 italic">No hay workouts registrados</p>
            ) : (
                workouts.map((workout) => (
                    <div
                        key={workout.id}
                        onClick={() => navigate(`/workouts/${workout.id}`)}
                        className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer group"
                    >
                        <div className="flex-1 ml-2">
                            <p className="font-semibold text-gray-800 dark:text-zinc-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {workout.name}
                            </p>
                            <div className="flex gap-3 mt-1">
                                <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full">
                                    {getDuration(workout.startedAt, workout.finishedAt)}
                                </span>
                                {workout.routine_id && (
                                    <span className="text-xs text-gray-400 dark:text-zinc-500">
                                        Rutina: {workout.routine_id.slice(0, 8)}...
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenActions(workout);
                            }}
                            className="p-2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
                        >
                            ⋮
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
