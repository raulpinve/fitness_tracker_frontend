export default function ExercisesList({ exercises, onOpenActions }) {
    return (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800 dark:bg-zinc-950 bg-white">
            {exercises.length === 0 ? (
                <p className="text-center p-6 text-gray-500 italic">No hay ejercicios registrados</p>
            ) : (
                exercises.map((exercise) => (
                    <div 
                        key={exercise.id} 
                        className="flex items-center p-4 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors group"
                    >

                        {/* Info Principal */}
                        <div className="flex-1 ml-2">
                            <p className="font-semibold text-gray-800 dark:text-zinc-200 leading-tight">
                                {exercise.name || "Ejercicio sin nombre"}
                            </p>
                            {/* Subtexto opcional */}
                            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1 uppercase tracking-wide">
                                {exercise.type  === "strength" ? "Fuerza": "Cardio"}
                            </p>
                        </div>

                        {/* Botón de Acción */}
                        <button
                            onClick={() => onOpenActions(exercise)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all"
                        >
                            ⋮
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

