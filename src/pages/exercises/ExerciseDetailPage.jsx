import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExerciseServices } from '../../services/exercises.service';
import Header from '../../shared/components/Header';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaDumbbell, FaRunning, FaVideo } from 'react-icons/fa';
import { toast } from 'sonner';

const ExerciseDetailPage = () => {
    const { exerciseId } = useParams();
    const navigate = useNavigate();
    const { getExercise } = useExerciseServices();
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('image');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const res = await getExercise(exerciseId);
                setExercise(res.data);
            } catch (error) {
                toast.error("No se pudo cargar la información del ejercicio");
                navigate('/exercises');
            } finally {
                setLoading(false);
            }
        };
        fetchExercise();
    }, [exerciseId]);

    useEffect(() => {
        if (exercise && !exercise.video) setView('image');
    }, [exercise]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen dark:bg-zinc-950">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-4xl" />
        </div>
    );

    const folderPath = `${API_URL}/uploads/exercises/${exercise.id}/`;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
            <Header title={exercise.name} showBack={true} />

            <div className="max-w-2xl mx-auto p-4 space-y-6">
                
                {/* Multimedia: Video o Imagen */}
                <div className="overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800 shadow-xl aspect-video relative flex items-center justify-center border border-gray-200 dark:border-zinc-800">
                    {view === 'video' && exercise.video ? (
                        <video 
                            src={`${folderPath}${exercise.video}`} 
                            controls 
                            className="w-full h-full object-contain bg-black" 
                        />
                    ) : exercise.avatar ? (
                        <img 
                            src={`${folderPath}${exercise.avatar}`} 
                            alt={exercise.name}
                            className="w-full h-full object-contain drop-shadow-sm animate-in fade-in duration-300" 
                        />
                    ) : (
                        <FaDumbbell size={48} className="text-zinc-400" />
                    )}
                </div>

                {/* 2. Selector de Vista (Ubicación ergonómica debajo del bloque) */}
                {exercise.video && exercise.avatar && (
                    <div className="flex bg-zinc-200 dark:bg-zinc-900 p-1 rounded-2xl w-full max-w-[200px] mx-auto shadow-inner">
                        <button 
                            onClick={() => setView('image')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black transition-all ${view === 'image' ? 'bg-white dark:bg-zinc-700 shadow-md text-blue-600' : 'text-zinc-500'}`}
                        >
                            <FaDumbbell /> FOTO
                        </button>

                        <button 
                            onClick={() => setView('video')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black transition-all ${view === 'video' ? 'bg-white dark:bg-zinc-700 shadow-md text-blue-600' : 'text-zinc-500'}`}
                        >
                            <FaVideo /> VIDEO
                        </button>
                    </div>
                )}

                {/* Info Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                        Información General
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                            <p className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 mb-1">Tipo</p>
                            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-semibold capitalize">
                                {exercise.type === 'strength' ? <FaDumbbell /> : <FaRunning />}
                                {exercise.type}
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                            <p className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 mb-1">Músculo</p>
                            <p className="text-zinc-800 dark:text-zinc-200 font-semibold capitalize">
                                {exercise.muscleGroup}
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 col-span-2">
                            <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Equipamiento</p>
                            <p className="text-zinc-800 dark:text-zinc-200 font-semibold capitalize">
                                {exercise.equipment}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Botón de acción rápido */}
                <div className="grid gap-3 pt-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                        Acciones del ejercicio
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => navigate(`/exercises/edit/${exercise.id}`)}
                            className="flex items-center justify-center gap-2 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-transform"
                        >
                            <FaDumbbell className="text-xs" />
                            Editar
                        </button>

                        {/* Botón Eliminar - Secundario/Peligro */}
                        <button 
                            // onClick={() => handleDelete(exercise.id)}
                            className="flex items-center justify-center gap-2 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-bold text-sm border border-red-100 dark:border-red-900/30 active:scale-95 transition-transform"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ExerciseDetailPage;
