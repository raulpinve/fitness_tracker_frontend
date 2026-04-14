import { LuDumbbell } from 'react-icons/lu';
import { Link } from 'react-router-dom';

export default function ExercisesList({ exercises }) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const labels = {
        // Muscle
        pecho: "Pecho", espalda: "Espalda", hombros: "Hombros", biceps: "Bíceps",
        triceps: "Tríceps", antebrazos: "Antebrazos", cuadriceps: "Cuádriceps",
        isquios: "Isquios", gluteos: "Glúteos", gemelos: "Gemelos",
        abs: "Abs", cardio: "Cardio", full_body: "Full Body",
        // Equipment
        barras: "Barras", mancuernas: "Mancuernas", máquinas: "Máquinas",
        poleas: "Poleas", peso_corporal: "Peso corporal", bandas: "Bandas",
        kettlebells: "Kettlebells", ninguno: "Sin equipo"
    };

    return (
        <div className="flex flex-col gap-3">
            {exercises.map((exercise) => (
                <Link 
                    key={exercise.id} 
                    to={`/exercises/${exercise.id}`} 
                    className="group relative flex items-center p-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/30 transition-all duration-200 active:scale-[0.97] cursor-pointer"
                >
                    <div className="relative w-16 h-16 shrink-0 bg-zinc-50 dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 flex items-center justify-center transition-transform group-hover:scale-105">
                        {exercise.avatarThumbnail ? (
                            <img 
                                src={`${API_URL}/uploads/exercises/${exercise.id}/${exercise.avatarThumbnail}`} 
                                alt={exercise.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-blue-500 dark:text-zinc-500 font-black text-xl">
                                    {exercise.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Info Principal */}
                    <div className="flex-1 ml-4 min-w-0">
                        <p className="font-bold text-zinc-800 dark:text-zinc-100 text-base leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {exercise.name || "Ejercicio sin nombre"}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                            {/* Badge de Músculo Normalizado */}
                            <span className="px-2 py-0.5 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 text-[9px] font-black uppercase tracking-wider rounded-md border border-zinc-100 dark:border-zinc-800">
                                {labels[exercise.muscleGroup] || exercise.muscleGroup || 'General'}
                            </span>

                            {/* Equipo Normalizado */}
                            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 italic truncate">
                                {labels[exercise.equipment] || exercise.equipment || 'Sin equipo'}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
