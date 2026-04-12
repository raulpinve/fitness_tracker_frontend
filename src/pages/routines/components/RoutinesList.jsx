import { useNavigate } from "react-router-dom";

export default function RoutinesList({ routines, onOpenActions }) {
    const navigate = useNavigate();    
    
    return (
        /* Contenedor principal: Zinc 950 es el estándar para fondos oscuros profundos */
        <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950 transition-colors">
            {routines.length === 0 ? (
                <p className="text-center p-6 text-zinc-500 dark:text-zinc-400 italic">No hay rutinas aún</p>
            ) : (
                routines.map(routine => (
                    <div
                        key={routine.id}
                        onClick={() => navigate(`/routines/${routine.id}/exercises`)}
                        /* Hover sutil en Zinc 900 para el modo oscuro */
                        className="flex items-center p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer group"
                    >
                        {/* Main Info */}
                        <div className="flex-1 ml-2">
                            {/* Texto principal en Zinc 900/100 */}
                            <p className="font-semibold text-zinc-800 dark:text-zinc-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {routine.name || "Sin nombre"}
                            </p>

                            {/* Contenedor de Píldoras Dinámicas */}
                            <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                                {routine.exercises && routine.exercises.length > 0 ? (
                                    <>
                                        {routine.exercises.slice(0, 2).map((ex, index) => (
                                            /* Píldoras: Usamos Zinc para mantener la estética limpia */
                                            <span 
                                                key={index} 
                                                className="whitespace-nowrap px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-bold rounded uppercase tracking-tighter border border-zinc-200 dark:border-zinc-700"
                                            >
                                                {ex.name}
                                            </span>
                                        ))}
                                        
                                        {routine.exercises.length > 2 && (
                                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                                                +{routine.exercises.length - 2}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wide">
                                        Sin ejercicios aún
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Botón de Acción */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenActions(routine);
                            }}
                            className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                        > ⋮ </button>
                    </div>
                ))
            )}
        </div>
    );
}
