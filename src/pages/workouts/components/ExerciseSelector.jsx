export default function ExerciseSelector({ onSelect, availableExercises }){
    return (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl">
            <label className="block text-sm font-medium text-gray-600 mb-2">
                ¿Quieres añadir algo más?
            </label>
            <select 
                className="select-form"
                onChange={(e) => {
                    const ex = availableExercises.find(ex => ex.id === e.target.value);
                    if (ex) onSelect(ex);
                    e.target.value = ""; 
                }}
            >
                <option value="">+ Añadir ejercicio extra...</option>
                {availableExercises.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
            </select>
        </div>
    );
};