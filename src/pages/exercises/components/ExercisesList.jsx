export default function ExercisesList({ exercises, onOpenActions }) {
    return (
        <div className="flex flex-col divide-y divide-gray-100 bg-white">
            {exercises.length === 0 ? (
                <p className="text-center p-6 text-gray-500 italic">No hay ejercicios registrados</p>
            ) : (
                exercises.map((exercise) => (
                    <div 
                        key={exercise.id} 
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors group"
                    >

                        {/* Info Principal */}
                        <div className="flex-1 ml-2">
                            <p className="font-semibold text-gray-800 leading-tight">
                                {exercise.name || "Ejercicio sin nombre"}
                            </p>
                            {/* Subtexto opcional (categoría o músculo si lo tienes) */}
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                                {exercise.type  === "strength" ? "Fuerza": "Cardio"}
                            </p>
                        </div>

                        {/* Botón de Acción */}
                        <button
                            onClick={() => onOpenActions(exercise)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-all"
                        >
                            ⋮
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
