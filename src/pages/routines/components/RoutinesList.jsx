import { useNavigate } from "react-router-dom";

export default function RoutinesList({ routines, onOpenActions }) {
    const navigate = useNavigate();    
    
    return (
        <div className="flex flex-col divide-y divide-gray-100 bg-white">
            {routines.length === 0 ? (
                <p className="text-center p-6 text-gray-500 italic">No hay rutinas aún</p>
            ) : (
                routines.map(routine => (
                    <div
                        key={routine.id}
                        onClick={() => navigate(`/routines/${routine.id}/exercises`)}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                        {/* Main Info */}
                        <div className="flex-1 ml-2">
                            <p className="font-semibold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
                                {routine.name || "Sin nombre"}
                            </p>

                            {/* Contenedor de Píldoras Dinámicas */}
                            <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                                {routine.exercises && routine.exercises.length > 0 ? (
                                    <>
                                        {/* Mostramos solo los primeros 2 ejercicios para que no se amontonen */}
                                        {routine.exercises.slice(0, 2).map((ex, index) => (
                                            <span 
                                                key={index} 
                                                className="whitespace-nowrap px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-tighter border border-blue-100"
                                            >
                                                {ex.name}
                                            </span>
                                        ))}
                                        
                                        {/* Si hay más de 2, mostramos el contador */}
                                        {routine.exercises.length > 2 && (
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                +{routine.exercises.length - 2}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    /* Texto si la rutina está vacía */
                                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
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
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                        > ⋮ </button>
                    </div>
                ))
            )}
        </div>
    );
}
