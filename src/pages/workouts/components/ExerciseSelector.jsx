export default function ExerciseSelector({ onSelect, availableExercises }){
    return (
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] transition-all mb-8">
            <div className="flex flex-col items-center text-center mb-4">
                <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-1">
                    Variación de entrenamiento
                </label>
                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    ¿Quieres añadir algo más hoy?
                </h4>
            </div>

            <div className="relative group">
                <select 
                    className="w-full h-14 appearance-none rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                    onChange={(e) => {
                        const ex = availableExercises.find(ex => ex.id === e.target.value);
                        if (ex) onSelect(ex);
                        e.target.value = ""; 
                    }}
                >
                    <option value="" className="font-bold text-zinc-400">
                        + SELECCIONAR EJERCICIO EXTRA
                    </option>
                    {availableExercises.map(ex => (
                        <option key={ex.id} value={ex.id} className="font-medium text-zinc-900 dark:text-white">
                            {ex.name}
                        </option>
                    ))}
                </select>
                
                {/* Icono de flecha personalizado para que no se vea el de sistema */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                    <svg xmlns="http://w3.org" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
