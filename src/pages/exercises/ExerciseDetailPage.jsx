import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExerciseServices } from '../../services/exercises.service';
import Header from '../../shared/components/Header';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaDumbbell, FaRunning, FaVideo } from 'react-icons/fa';
import { toast } from 'sonner';
import BottomSheet from '../../shared/components/BottomSheet';
import Button from '../../shared/components/Button';

const muscleGroupNames = {
    pecho: 'Pecho',
    espalda: 'Espalda',
    hombros: 'Hombros',
    biceps: 'Bíceps',
    triceps: 'Tríceps',
    antebrazos: 'Antebrazos',
    cuadriceps: 'Cuádriceps',
    isquios: 'Isquios',
    gluteos: 'Glúteos',
    gemelos: 'Gemelos',
    abs: 'Abdominales',
    cardio: 'Cardio',
    full_body: 'Cuerpo Completo'
};

const equipmentNames = {
    barras: 'Barras',
    mancuernas: 'Mancuernas',
    maquinas: 'Máquinas',
    máquinas: 'Máquinas', 
    poleas: 'Poleas',
    peso_corporal: 'Peso Corporal',
    bandas: 'Bandas Elásticas',
    kettlebells: 'Kettlebells',
    ninguno: 'Sin equipo'
};

const ExerciseDetailPage = () => {
    const navigate = useNavigate();
    const { exerciseId } = useParams();
    const { getExercise } = useExerciseServices();
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const { deleteExercise } = useExerciseServices();
    const [isLoadingDelete, setIsLoadingDelete] = useState();
    const [openButtonSheet, setOpenButtonSheet] = useState(false);
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

    const handleDelete = async (exerciseId) => {
        setIsLoadingDelete(true);
        try {
            await deleteExercise(exerciseId);
            toast("Ejercicio eliminado exitosamente.");

            setOpenButtonSheet(false);
            navigate("/exercises");
        } catch {
            toast.error("Ha ocurrido un error al momento de eliminar el ejercicio");
        } finally {
            setIsLoadingDelete(false);
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center h-screen dark:bg-zinc-950">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-4xl" />
        </div>
    );

    const folderPath = `${API_URL}/uploads/exercises/${exercise.id}/`;

    return (
        <>
            <Header title={exercise.name} showBack={true} backTo={`/exercises`} />
            <div className="max-w-2xl mx-auto p-4 space-y-6">
                {/* Multimedia: Video o Imagen */}
                <div className="overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800 shadow-xl aspect-video relative flex items-center justify-center border border-gray-200 dark:border-zinc-800">
                    {view === 'video' && exercise.video ? (
                        <video 
                            src={`${folderPath}${exercise.video}`} 
                            controls 
                            className="w-full h-full object-contain bg-black" 
                            muted
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
                            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-semibold">
                                {exercise.type === 'strength' ? <FaDumbbell /> : <FaRunning />}
                                <span className="capitalize">{exercise.type === 'strength' ? 'Fuerza' : 'Cardio'}</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                            <p className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 mb-1">Músculo</p>
                            <p className="text-zinc-800 dark:text-zinc-200 font-semibold">
                                {muscleGroupNames[exercise.muscleGroup] || exercise.muscleGroup}
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 col-span-2">
                            <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Equipamiento</p>
                            <p className="text-zinc-800 dark:text-zinc-200 font-semibold">
                                {equipmentNames[exercise.equipment] || exercise.equipment}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 pt-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                        Acciones del ejercicio
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <Button 
                            colorButton={`primary`}
                            loading={loading}
                            onClick={() => navigate(`/exercises/${exercise.id}/edit`)}
                            className='mt-4'
                        >
                            <FaDumbbell className="text-xs" />
                            Editar
                        </Button>

                        <Button 
                            colorButton={`danger`}
                            loading={loading}
                            className='mt-4'
                            onClick={() => setOpenButtonSheet(true)}
                        >
                            Eliminar
                        </Button>
                     
                    </div>
                </div>
            </div>

            <BottomSheet open={openButtonSheet} onClose={() => setOpenButtonSheet(false)}>
                <div className="pt-2 pb-6">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-14 h-14 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-7 h-7 text-red-600 dark:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                            ¿Eliminar ejercicio?
                        </p>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 px-8 mt-1 leading-relaxed">
                            Estás a punto de borrar <span className="font-bold text-zinc-800 dark:text-zinc-200">"{exercise.name}"</span>. Esta acción no se puede deshacer.
                        </p>
                    </div>

                    <div className="grid gap-3 px-2">
                        <button
                            disabled={isLoadingDelete}
                            onClick={() => handleDelete(exercise.id)}
                            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold flex justify-center gap-3 items-center transition-all active:scale-95 shadow-lg shadow-red-500/20"
                        >
                            {isLoadingDelete ? <AiOutlineLoading3Quarters className='animate-spin' /> : "Sí, eliminar ejercicio"}
                        </button>

                        <button
                            className="w-full py-4 text-gray-500 dark:text-zinc-400 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors text-sm"
                            onClick={() => setOpenButtonSheet(false)}
                        >
                            No, mantener ejercicio
                        </button>
                    </div>
                </div>
            </BottomSheet>


        </>
    );
};

export default ExerciseDetailPage;
