import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExerciseServices } from '../../services/exercises.service';
import Header from '../../shared/components/Header';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaDumbbell, FaRunning, FaVideo } from 'react-icons/fa';
import { toast } from 'sonner';
import BottomSheet from '../../shared/components/BottomSheet';
import Button from '../../shared/components/Button';
import ExerciseProgressChart from './components/ExerciseProgressChart';
import { LuBookOpen } from 'react-icons/lu';

const muscleGroupNames = {
    pecho: 'Pecho',
    espalda: 'Espalda',
    lumbares: 'Lumbares',
    hombros: 'Hombros',
    biceps: 'Bíceps',
    triceps: 'Tríceps',
    antebrazos: 'Antebrazos',
    cuadriceps: 'Cuádriceps',
    isquios: 'Isquiotibiales', 
    gluteos: 'Glúteos',
    gemelos: 'Gemelos',
    aductores: 'Aductores',
    abs: 'Abdominales',
    cardio: 'Cardio',
    full_body: 'Cuerpo Completo'
};

const equipmentNames = {
    barras: 'Barras',
    mancuernas: 'Mancuernas',
    maquinas: 'Máquinas',
    poleas: 'Poleas',
    banco: 'Banco',
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
    const API_URL = import.meta.env.VITE_API_URL;
    const { getExerciseProgress } = useExerciseServices();
    const [progressData, setProgressData] = useState([]);
    const [loadingProgress, setLoadingProgress] = useState(true);
    const [isVertical, setIsVertical] = useState(false);

    // This function will be triggered when the video loads its metadata
    const handleVideoMetadata = (e) => {
        const { videoWidth, videoHeight } = e.target;
        // If height is greater than width, it's vertical
        if (videoHeight > videoWidth) {
            setIsVertical(true);
        }
    };

    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        if (naturalHeight > naturalWidth) {
            setIsVertical(true);
        } else {
            setIsVertical(false);
        }
    };

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await getExerciseProgress(exerciseId);

                // Limpiamos los datos antes de guardarlos en el estado
                const formattedData = res.data.map(item => ({
                    ...item,
                    // El signo + convierte el string a número inmediatamente
                    // parseFloat también funciona, pero + es más rápido
                    value: +Number(item.value).toFixed(1) 
                }));

                setProgressData(formattedData);
            } catch (error) {
                console.error("Error al cargar progreso:", error);
            } finally {
                setLoadingProgress(false);
            }
        };

        if (exerciseId) fetchProgress();
    }, [exerciseId]);

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const res = await getExercise(exerciseId);
                setExercise(res.data);
            } catch {
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
            <div className="max-w-2xl mx-auto p-4 space-y-6 pb-20">
               {/* Multimedia: Video or Image */}
                <div className={`overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 shadow-xl relative flex items-center justify-center border border-gray-200 dark:border-zinc-800 mx-auto 
                    /* Transición suave de todas las propiedades físicas */
                    transition-[aspect-ratio,max-width,height] duration-700 ease-in-out
                    ${view === 'video' 
                        ? (isVertical ? 'aspect-3/4 max-w-[320px]' : 'aspect-video w-full') 
                        : 'aspect-square max-w-[400px] w-full' // Usamos aspect-square como base para que no "salte"
                    }`}>
                    
                    {view === 'video' && exercise.video ? (
                        <video 
                            key="video-player" // Key ayuda a React a renderizar limpio
                            src={`${folderPath}${exercise.video}`} 
                            onLoadedMetadata={handleVideoMetadata}
                            controls 
                            className="w-full h-full object-cover bg-black animate-in fade-in duration-500" 
                            muted
                            loop
                        />
                    ) : exercise.avatar ? (
                        <img 
                            key="image-display"
                            src={`${folderPath}${exercise.avatar}`} 
                            onLoad={handleImageLoad} 
                            alt={exercise.name}
                            /* 'object-contain' mantiene la imagen entera sin deformar el contenedor */
                            className="w-full h-full object-contain p-4 animate-in fade-in duration-500" 
                        />
                    ) : (
                        <FaDumbbell size={48} className="text-zinc-400" />
                    )}
                </div>

                {/* View Selector */}
                {exercise.video && exercise.avatar && (
                    <div className="flex bg-zinc-200 dark:bg-zinc-900 p-1 rounded-2xl w-full max-w-50 mx-auto shadow-inner">
                        <button 
                            onClick={() => {setView('image'), setIsVertical(false)}}
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

                <div className="pt-2 pb-2 px-2 flex items-stretch gap-3">
                    <div className="w-1.5 rounded-full bg-linear-to-b from-blue-600 to-blue-400 shadow-[2px_0_12px_rgba(37,99,235,0.3)]" />
                    <div className="flex flex-col justify-center">
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase italic tracking-tight leading-none">
                            {exercise.name}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                                Ficha <span className="text-blue-600">Técnica</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 dark:border-zinc-900">
                    <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6 border-b border-zinc-50 dark:border-zinc-900 pb-2 italic">
                        Especificaciones Técnicas
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* TIPO DE EJERCICIO */}
                        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex flex-col justify-center">
                            <p className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1 italic">Tipo</p>
                            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-black uppercase text-xs italic leading-none">
                                {exercise.type === 'strength' ? <FaDumbbell className="text-blue-500" /> : <FaRunning className="text-blue-500" />}
                                <span>{exercise.type === 'strength' ? 'Fuerza' : 'Cardio'}</span>
                            </div>
                        </div>

                        {/* EQUIPAMIENTO */}
                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-center">
                            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1 italic">Equipamiento</p>
                            <p className="text-zinc-800 dark:text-zinc-200 font-black uppercase text-xs italic leading-none tracking-tighter">
                                {equipmentNames[exercise.equipment] || exercise.equipment}
                            </p>
                        </div>

                        {/* MÚSCULOS INVOLUCRADOS (Layout de Alto Impacto) */}
                        <div className="p-6 rounded-[2.2rem] bg-orange-50 dark:bg-orange-900/10 border border-orange-100/50 dark:border-orange-900/20 col-span-2 shadow-inner">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[8px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em] italic">
                                    Grupos Musculares <span className="opacity-40">/ Target</span>
                                </p>
                                {/* Un pequeño contador técnico */}
                                <span className="text-[8px] font-black text-orange-300 dark:text-orange-800">
                                    {exercise.muscleGroups?.length || 0} SELECCIONADOS
                                </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-2.5">
                                {exercise.muscleGroups && exercise.muscleGroups.map((muscle, index) => {
                                    const isPrimary = index === 0;
                                    return (
                                        <span 
                                            key={muscle} 
                                            className={`px-3.5 py-1.5 rounded-xl font-black uppercase text-[10px] italic transition-all duration-500 flex items-center gap-1.5 ${
                                                isPrimary 
                                                ? "bg-orange-600 text-white shadow-[0_8px_16px_rgba(234,88,12,0.3)] scale-105 border border-orange-500" 
                                                : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
                                            }`}
                                        >
                                            {/* Punto indicador para el primario */}
                                            {isPrimary && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                            
                                            {muscleGroupNames[muscle] || muscle}
                                            
                                            {isPrimary && (
                                                <span className="text-[7px] font-black bg-orange-700/50 px-1 rounded ml-0.5">
                                                    PRI
                                                </span>
                                            )}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>


                {exercise.type === 'strength' && (
                    <div className="pt-4">
                        {loadingProgress ? (
                            <div className="h-55 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-[2.5rem]" />
                        ) : progressData.length > 1 ? (
                            <ExerciseProgressChart data={progressData} />
                        ) : (
                            <div className="p-8 text-center bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-loose">
                                    Entrena más para ver tu <span className="text-blue-500">progreso</span> 📈
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {exercise.description.split('|').map((section, index) => {
                    const titles = ["Posición Inicial", "Ejecución", "Tips Extra"];
                    
                    // USAMOS ESTA REGEX: Detecta saltos de línea reales (\n) 
                    // o el texto literal "\n" si es que viene así de la DB
                    const lines = section.split(/\r?\n|\\n/).filter(line => line.trim() !== '');

                    return (
                        <div key={index} className="relative">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-lg uppercase tracking-[0.2em]">
                                    {titles[index] || "Detalle"}
                                </span>
                            </div>
                            
                            <div className="space-y-3 pl-1">
                                {lines.map((line, i) => (
                                    <div key={i} className="flex items-start gap-3 group">
                                        {/* El Bullet Azul Industrial */}
                                        <div className="w-1 h-3.5 bg-blue-600 rounded-full mt-1 flex-shrink-0" />
                                        
                                        <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 leading-tight italic">
                                            {line.trim()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Actions */}
                <div className="grid gap-3 pt-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                        Gestión de ejercicio
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <Button 
                            colorButton={`primary`}
                            loading={loading}
                            onClick={() => navigate(`/exercises/${exercise.id}/edit`)}
                            className="py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/10"
                        >
                            Editar
                        </Button>

                        <Button 
                            colorButton={`danger`}
                            loading={loading}
                            onClick={() => setOpenButtonSheet(true)}
                            className="py-4 rounded-2xl font-black uppercase tracking-widest"
                        >
                            Eliminar
                        </Button>
                    </div>
                </div>
            </div>

            <BottomSheet open={openButtonSheet} onClose={() => setOpenButtonSheet(false)}>
                <div className="max-w-md mx-auto max-h-[85vh] overflow-y-auto no-scrollbar pt-2 pb-6">
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
