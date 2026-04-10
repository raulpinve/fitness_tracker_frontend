import { useNavigate } from "react-router-dom";

export default function WorkoutsList({ workouts, onOpenActions }) {
    const navigate = useNavigate();

    // Función para calcular duración amigable
    const getDuration = (start, end) => {
        if (!end) return "En progreso...";
        const diff = new Date(end) - new Date(start);
        const minutes = Math.floor(diff / 1000 / 60);
        return `${minutes} min`;
    };

    // Función para formatear fecha
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex flex-col divide-y divide-gray-100 bg-white">
            {workouts.length === 0 ? (
                <p className="text-center p-6 text-gray-500 italic">No hay entrenamientos registrados</p>
            ) : (
                workouts.map((workout) => (
                    <div
                        key={workout.id}
                        onClick={() => navigate(`/workouts/${workout.id}`)}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                        <div className="flex-1 ml-2">
                            {/* Fecha como título principal */}
                            <p className="font-semibold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
                                Entrenamiento {formatDate(workout.startedAt)}
                            </p>
                            
                            {/* Metadata: Duración y ID de Rutina */}
                            <div className="flex gap-3 mt-1">
                                <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                                    {getDuration(workout.startedAt, workout.finishedAt)}
                                </span>
                                {workout.routine_id && (
                                    <span className="text-xs text-gray-400">
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
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            ⋮
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
