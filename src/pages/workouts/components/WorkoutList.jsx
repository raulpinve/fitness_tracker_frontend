import { useNavigate } from "react-router-dom";
import { LuClock, LuFlame } from "react-icons/lu";
import EmptyState from "../../../shared/components/EmptyState";

export default function WorkoutsList({ workouts }) {
    const navigate = useNavigate();

    const getDuration = (start, end) => {
        if (!end) return null;
        const diff = new Date(end) - new Date(start);
        const minutes = Math.floor(diff / 1000 / 60);
        return `${minutes} min`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
        });
    };

    return (
        <div className="flex flex-col gap-3">

            {workouts.map((workout) => {
                const duration = getDuration(workout.startedAt, workout.finishedAt);
                const isInProgress = !workout.finishedAt;

                return (
                    <div
                        key={workout.id}
                        onClick={() => navigate(`/workouts/${workout.id}`)}
                        className="group relative bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                    >
                        <div className="flex items-center">

                            {/* Indicador de Fecha/Estado */}
                            <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center hrink-0 mr-4 border ${
                                isInProgress 
                                ? "bg-orange-50 border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20" 
                                : "bg-zinc-50 border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800"
                            }`}>
                                {isInProgress ? (
                                    <LuFlame className="text-orange-500 animate-pulse" size={20} />
                                ) : (
                                    <>
                                        <span className="text-[10px] font-black text-zinc-400 uppercase leading-none">
                                            {formatDate(workout.startedAt).split(' ')[1]}
                                        </span>
                                        <span className="text-lg font-black text-zinc-800 dark:text-zinc-200 leading-none mt-0.5">
                                            {formatDate(workout.startedAt).split(' ')[0]}
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-tight truncate group-hover:text-blue-600 transition-colors">
                                    {workout.name || "Entrenamiento sin nombre"}
                                </h3>

                                <div className="flex items-center gap-3 mt-2">
                                    {/* Badge de Duración o Estado */}
                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                                        isInProgress
                                        ? "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20"
                                        : "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                                    }`}>
                                        <LuClock size={10} />
                                        {isInProgress ? "En curso" : duration}
                                    </div>

                                    {/* ID de Rutina / Subtexto */}
                                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest truncate">
                                        {workout.routineId ? "Rutina asignada" : "Sesión libre"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
