import { useNavigate } from "react-router-dom";

export default function RoutinesList({ routines, setSelectedRoutineExercise, setOpenButtonSheet }) {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col gap-3">
            {routines.map(routine => (
                <div
                    key={routine.id}
                    onClick={() => navigate(`/routines/${routine.id}/exercises`, { 
                        state: { routineName: routine.name } 
                    })}
                    className="group relative bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/30 transition-all cursor-pointer active:scale-[0.98]"
                >
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">{routine.name[0]}</span>
                        </div>

                        <div className="flex-1 min-w-0 pr-8"> {/* Añadimos padding a la derecha para el botón */}
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {routine.name || "Rutina sin nombre"}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-2 overflow-hidden">
                                {routine.exercises && routine.exercises.length > 0 ? (
                                    <>
                                        {routine.exercises.slice(0, 2).map((ex, index) => (
                                            <span 
                                                key={index} 
                                                className="whitespace-nowrap px-2 py-0.5 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 text-[9px] font-black uppercase tracking-wider rounded-md border border-zinc-100 dark:border-zinc-800"
                                            >
                                                {ex.name}
                                            </span>
                                        ))}
                                        
                                        {routine.exercises.length > 2 && (
                                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold ml-1">
                                                +{routine.exercises.length - 2}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-[9px] text-zinc-400 dark:text-zinc-600 font-black uppercase tracking-widest">
                                        Vacía • Añade ejercicios
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Botón reposicionado absolutamente dentro de la card */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // IMPORTANTE: Evita el navigate
                                setSelectedRoutineExercise(routine);
                                setOpenButtonSheet(true);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 cursor-pointer text-zinc-300 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all active:bg-zinc-100 dark:active:bg-zinc-800 rounded-full z-10"
                        >
                            <span className="text-2xl leading-none">⋮</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
