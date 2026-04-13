import { Link } from 'react-router-dom';

export default function ExercisesList({ exercises, onOpenActions }) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    return (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800 dark:bg-zinc-950 bg-white shadow-sm rounded-xl overflow-hidden">
            {exercises.length === 0 ? (
                <p className="text-center p-10 text-gray-500 italic">No hay ejercicios registrados</p>
            ) : (
                exercises.map((exercise) => (
                    <Link 
                        key={exercise.id} 
                        to={`/exercises/${exercise.id}`} // Redirección al hacer clic en cualquier parte de la fila
                        className="flex items-center p-3 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors group"
                    >
                        {/* Contenedor de Imagen */}
                        <div className="relative w-14 h-14 flex-shrink-0">
                            {exercise.avatarThumbnail ? (
                                <img 
                                    src={`${API_URL}/uploads/exercises/${exercise.id}/${exercise.avatarThumbnail}`} 
                                    alt={exercise.name}
                                    className="w-full h-full object-cover rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800"
                                />
                            ) : (
                                <div className="w-full h-full bg-blue-50 dark:bg-zinc-800 flex items-center justify-center rounded-lg border border-dashed border-blue-200 dark:border-zinc-700">
                                    <span className="text-blue-500 dark:text-zinc-500 font-bold text-lg">
                                        {exercise.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Info Principal */}
                        <div className="flex-1 ml-4">
                            <p className="font-bold text-gray-800 dark:text-zinc-200 text-base leading-tight">
                                {exercise.name || "Ejercicio sin nombre"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400">
                                    {exercise.muscleGroup}
                                </span>
                                <span className="text-[10px] font-medium text-gray-400 dark:text-zinc-500 italic">
                                    {exercise.equipment}
                                </span>
                            </div>
                        </div>

                        {/* Botón de Acción (Menú de tres puntos) */}
                        <button
                            onClick={(e) => {
                                e.preventDefault(); // EVITA que el Link redireccione al tocar los puntos
                                e.stopPropagation(); // Evita burbujeo
                                onOpenActions(exercise);
                            }}
                            className="p-2 text-gray-300 group-hover:text-gray-600 dark:group-hover:text-zinc-200 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all z-10"
                        >
                            <span className="text-xl">⋮</span>
                        </button>
                    </Link>
                ))
            )}
        </div>
    );
}

