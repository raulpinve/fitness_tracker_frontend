import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExerciseServices } from '../../services/exercises.service';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

// Iconos y Componentes
import { LuSearch, LuDumbbell, LuX, LuChevronDown, LuCheck } from 'react-icons/lu';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Header from '../../shared/components/Header';
import MessageError from '../../shared/components/MessageError';
import FilterBarExercise from '../exercises/components/FilterBarExercise';
import { StrengthForm } from './components/StrengthForm';
import { CardioForm } from './components/CardioForm';

const RoutineExerciseCreatePage = () => {
    const { register, control, setValue, watch, formState: { errors } } = useForm({ mode: "onChange" });
    const [availableExercises, setAvailableExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [messageError, setMessageError] = useState(false);

    // Estados para el Filtro
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({ type: "", muscleGroup: "" });

    const { routineId } = useParams();
    const navigate = useNavigate();
    const { getAllExercises } = useExerciseServices();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Traemos los ejercicios (ajusta el límite según necesites)
                const res = await getAllExercises(1, 200);
                setAvailableExercises(res.data);
            } catch {
                toast.error("Error al recuperar ejercicios");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Lógica de filtrado local para que sea instantáneo
    const filteredExercises = useMemo(() => {
        return availableExercises.filter(ex => {
            const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
            const matchesType = !filters.type || ex.type === filters.type;
            // Filtro por array de músculos (el nuevo sistema)
            const matchesMuscle = !filters.muscleGroup || ex.muscleGroups.includes(filters.muscleGroup);
            return matchesSearch && matchesType && matchesMuscle;
        });
    }, [availableExercises, search, filters]);

    const selectedExerciseId = watch("exerciseId");
    const selectedExercise = availableExercises.find(ex => ex.id === selectedExerciseId);

    if (loading) return (
        <div className="flex justify-center items-center h-screen dark:bg-zinc-950">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-4xl" />
        </div>
    );

    return (
        <>
            <Header title="Añadir Ejercicio" showBack={true} />
            <div className="max-w-2xl mx-auto p-4 space-y-8">
                <div className="space-y-2">
                    <label className="label-form">Ejercicio Target <span className="input-required">*</span></label>
                    <button 
                        type="button"
                        onClick={() => setIsSelectorOpen(true)}
                        className={`w-full group flex items-center justify-between px-5 py-3.5 rounded-2xl border transition-all duration-300 ${
                            selectedExercise 
                            ? "bg-white dark:bg-zinc-950 border-blue-500/30 shadow-sm" 
                            : "bg-zinc-100/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
                        }`}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            {/* Icono más pequeño y discreto */}
                            <div className={`p-2 rounded-xl transition-colors ${
                                selectedExercise 
                                ? 'bg-blue-600/10 text-blue-600' 
                                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                            }`}>
                                <LuDumbbell size={16} />
                            </div>

                            <div className="flex flex-col items-start min-w-0">
                                {/* Texto de categoría pequeño arriba */}
                                <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] leading-none mb-1">
                                    {selectedExercise ? 'Ejercicio Seleccionado' : 'Target'}
                                </span>
                                
                                {/* Nombre del ejercicio principal */}
                                <span className={`text-xs font-bold uppercase italic truncate leading-none ${
                                    selectedExercise ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'
                                }`}>
                                    {selectedExercise ? selectedExercise.name : 'Tocar para buscar...'}
                                </span>
                            </div>
                        </div>

                        {/* Lado derecho: Acción */}
                        <div className="flex items-center gap-2">
                            {selectedExercise && (
                                <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
                            )}
                            <LuSearch 
                                className={`transition-colors ${selectedExercise ? 'text-blue-500' : 'text-zinc-300 dark:text-zinc-700'}`} 
                                size={16} 
                            />
                        </div>
                    </button>

                    {errors.exerciseId && <p className="input-message-error px-4">Debes elegir un ejercicio</p>}
                </div>

                {/* --- FORMULARIOS DE CARGA --- */}
                {selectedExercise?.type === 'strength' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <StrengthForm exercise={selectedExercise} routineId={routineId} setMessageError={setMessageError} />
                    </div>
                )}
                
                {selectedExercise?.type === 'cardio' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardioForm exercise={selectedExercise} routineId={routineId} setMessageError={setMessageError} />
                    </div>
                )}

                {messageError && <MessageError>{messageError}</MessageError>}
            </div>

            {isSelectorOpen && (
                <div className="absolute inset-0 z-[60] bg-white dark:bg-zinc-950 flex flex-col animate-in slide-in-from-bottom duration-300">
                    {/* Header del Buscador - Ajustado al ancho del layout */}
                    <div className="px-6 py-8 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl z-20">
                        <div className="flex flex-col gap-1">
                            
                            {/* Título principal con estilo industrial */}
                            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase italic tracking-tighter leading-none">
                                Buscar <span className="text-blue-600">Ejercicio</span>
                            </h2>
                            
                            {/* Contador discreto */}
                            <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mt-1">
                                {filteredExercises.length} Disponibles en la base de datos
                            </span>
                        </div>

                        {/* Botón de cerrar más integrado */}
                        <button 
                            onClick={() => setIsSelectorOpen(false)} 
                            className="w-12 h-12 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[1.2rem] active:scale-90 transition-all text-zinc-400 hover:text-red-500"
                        >
                            <LuX size={24} strokeWidth={3} />
                        </button>
                    </div>

                    
                    {/* Lista de Ejercicios */}
                    <div className="p-4 flex-1 overflow-y-auto no-scrollbar pb-32">
                        <FilterBarExercise 
                            search={search} setSearch={setSearch}
                            filters={filters} setFilters={setFilters}
                            totalRecords={filteredExercises.length}
                        />

                        <div className="grid gap-3 mt-6">
                            {filteredExercises.length > 0 ? (
                                filteredExercises.map(ex => (
                                    <button
                                        key={ex.id}
                                        type="button"
                                        onClick={() => {
                                            setValue("exerciseId", ex.id, { shouldValidate: true });
                                            setIsSelectorOpen(false);
                                        }}
                                        className={`flex items-center justify-between p-4 rounded-[2rem] border transition-all duration-300 ${
                                            selectedExerciseId === ex.id 
                                            ? "bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20 scale-[0.98]" 
                                            : "bg-white dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 text-left">
                                            <div className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                                                {ex.avatarThumbnail && (
                                                    <img src={`${API_URL}/uploads/exercises/${ex.id}/${ex.avatarThumbnail}`} className="w-full h-full object-cover" alt="" />
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-black uppercase italic leading-tight truncate">{ex.name}</span>
                                                <span className={`text-[8px] font-black uppercase mt-1 tracking-widest ${selectedExerciseId === ex.id ? 'text-blue-100' : 'text-zinc-500'}`}>
                                                    {ex.muscleGroups?.join(' • ')}
                                                </span>
                                            </div>
                                        </div>
                                        {selectedExerciseId === ex.id && <LuCheck size={20} className="text-white shrink-0" />}
                                    </button>
                                ))
                            ) : (
                                <div className="py-20 text-center">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sin resultados para tu búsqueda</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Input oculto para validación de useForm */}
            <input type="hidden" {...register("exerciseId", { required: "Selecciona un ejercicio" })} />
        </>
    );
};

export default RoutineExerciseCreatePage;
