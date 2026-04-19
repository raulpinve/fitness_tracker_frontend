import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import Button from '../../shared/components/Button';
import { useForm, Controller  } from 'react-hook-form';
import MessageError from '../../shared/components/MessageError';
import { toast } from 'sonner';
import { handleErrors } from '../../utils/handleErrors';
import { useExerciseServices } from '../../services/exercises.service';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';
import { FaDumbbell } from 'react-icons/fa';
import { LuVideo } from 'react-icons/lu';
import { equipmentNames, muscleGroupNames } from './utils/exerciseConstants';

const ExerciseEditPage = () => {
    const { register, handleSubmit, setError, formState: { errors }, setValue, watch, control } = useForm({ 
    mode: "onChange",
        defaultValues: {
            muscleGroups: [] 
        }
    });
    const [loading, setLoading] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const { updateExercise, getExercise } = useExerciseServices();
    const [selectedMuscles, setSelectedMuscles] = useState([]);
    const navigate = useNavigate();
    const { exerciseId } = useParams();
    const { state } = useLocation();
    const [loadingData, setLoadingData] = useState(!state?.exercise);

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Evitamos llamadas si ya estamos cargando
                const sourceData = state?.exercise || (await getExercise(exerciseId)).data;
                
                // 2. Seteamos valores de uno en uno
                setValue("name", sourceData.name);
                setValue("type", sourceData.type);
                setValue("equipment", sourceData.equipment);
                setValue("description", sourceData.description || "");

                const muscles = Array.isArray(sourceData.muscleGroups) 
                    ? sourceData.muscleGroups 
                    : sourceData.muscleGroups ? [sourceData.muscleGroups] : [];

                // 3. Sincronizamos estados
                setSelectedMuscles(muscles);
                setValue("muscleGroups", muscles);
                
            } catch (error) {
                console.error("Error en loadData:", error);
            } finally {
                setLoadingData(false);
            }
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exerciseId]); 


    const onSubmit = async (values) => {
        setMessageError(false);
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("type", values.type);
            formData.append("equipment", values.equipment);
            formData.append("description", values.description);

            // Iteramos sobre el array para que el Backend (Formidable) lo reconstruya correctamente
            if (values.muscleGroups && values.muscleGroups.length > 0) {
                values.muscleGroups.forEach(muscle => {
                    formData.append("muscleGroups", muscle);
                });
            }

            // Solo enviamos archivos si el usuario seleccionó uno nuevo
            // Verificamos si es un File (nuevo) o solo el nombre del string (viejo)
            if (values.image && values.image[0] instanceof File) {
                formData.append("image", values.image[0]);
            }
            
            if (values.video && values.video[0] instanceof File) {
                formData.append("video", values.video[0]);
            }

            await updateExercise(exerciseId, formData);
            
            toast.success('Ejercicio editado exitosamente.');
            navigate("/exercises/" + exerciseId);
            
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally {
            setLoading(false);
        }
    };


    if (loadingData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-4xl" />
            </div>
        );
    }

    return (
        <>
            <Header title={`Editar ejercicio`} showBack={true} />
            <div className="p-4">
                <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' className='grid gap-2'>
                    {/* Nombre */}
                    <div>
                        <label htmlFor="name" className="label-form">
                            Nombre del ejercicio<span className="input-required">*</span>
                        </label>
                        <input 
                            className={`${errors.name && errors.name.message ? "input-form-error" : ""} input-form`}
                            {...register("name", {
                                required: {
                                    value: true,
                                    message: "Debe proporcionar un nombre.",
                                },
                                minLength: {
                                    value: 2,
                                    message: "El nombre debe tener al menos dos caracteres.",
                                },
                                maxLength: {
                                    value: 100,
                                    message: "El nombre no debe exceder los 100 caracteres.",
                                },
                            })}
                            id="nombre"
                        />
                        {errors.name && (<p className="input-message-error">{errors.name.message}</p>)} 
                    </div>

                    {/* Type */}
                    <div>
                        <label htmlFor="type" className="label-form">
                            Tipo<span className="input-required">*</span>
                        </label>
                        <div className="relative">
                            <select
                                {...register("type", {
                                    required: "Debe seleccionar un tipo"
                                })}
                                className={`${errors.type && errors.type.message ? "input-form-error" : ""} input-form`}
                            >
                                <option value="">Seleccionar</option>
                                <option value="strength">Fuerza</option>
                                <option value="cardio">Cardio</option>
                            </select>
                            <IoIosArrowDown className='absolute top-3.5 right-3 dark:text-zinc-400' />
                            {errors.type && (<p className="input-message-error">{errors.type.message}</p>)} 
                        </div>
                    </div>

                    {/* Sección de Músculos con Controller */}
                    <div>
                        <label className="label-form mb-3 block">
                            Grupos Musculares<span className="input-required">*</span>
                        </label>
                        
                        <Controller
                            name="muscleGroups"
                            control={control} // <--- Asegúrate de extraer 'control' de useForm
                            rules={{ required: "Selecciona al menos un grupo muscular" }}
                            render={({ field: { value, onChange } }) => {
                                // 'value' es el array actual de músculos
                                const currentSelected = Array.isArray(value) ? value : [];

                                return (
                                    <div className="flex flex-wrap gap-2 p-4 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                                        {Object.entries(muscleGroupNames).map(([key, name]) => {
                                            const isSelected = currentSelected.includes(key);
                                            const isPrimary = currentSelected[0] === key;

                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => {
                                                        const newSelection = isSelected
                                                            ? currentSelected.filter(m => m !== key)
                                                            : [...currentSelected, key];
                                                        
                                                        // 'onChange' actualiza el valor en react-hook-form automáticamente
                                                        onChange(newSelection);
                                                    }}
                                                    className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase italic transition-all duration-300 border ${
                                                        isSelected 
                                                        ? isPrimary 
                                                            ? "bg-orange-600 border-orange-500 text-white shadow-lg scale-105" 
                                                            : "bg-zinc-800 dark:bg-zinc-200 border-zinc-700 dark:text-zinc-900 text-white"
                                                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400"
                                                    }`}
                                                >
                                                    {name}
                                                    {isPrimary && <span className="ml-1 text-[8px] opacity-60">★</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            }}
                        />
                        {errors.muscleGroups && (
                            <p className="input-message-error mt-2">{errors.muscleGroups.message}</p>
                        )}
                    </div>

                    {/* Mensaje de error para los músculos */}
                    {errors.muscleGroups && <p className="input-message-error mt-2">{errors.muscleGroups.message}</p>}


                    {/* Registro oculto para que la validación "required" funcione */}
                    <input type="hidden" {...register("muscleGroups", { required: true })} />



                    {/* Equipment */}
                    <div>
                        <label htmlFor="equipment" className="label-form">
                            Equipamiento<span className="input-required">*</span>
                        </label>
                        <div className="relative">
                            <select
                                {...register("equipment", {
                                    required: "Debe seleccionar el equipamiento"
                                })}
                                className={`${errors.equipment ? "input-form-error" : ""} input-form`}
                            >
                                <option value="">Seleccionar</option>
                                {Object.entries(equipmentNames).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                            <IoIosArrowDown className='absolute top-3.5 right-3 dark:text-zinc-400 pointer-events-none' />
                            {errors.equipment && (
                                <p className="input-message-error">{errors.equipment.message}</p>
                            )} 
                        </div>
                    </div>

                    {/* Descripción con separador mágico */}
                    <div className="">
                        <label htmlFor="description" className="label-form">
                            Instrucciones de Ejecución <span className="text-[10px] text-zinc-400 font-normal">(Opcional)</span>
                        </label>
                        <div className="relative">
                            <textarea
                                id="description"
                                {...register("description")}
                                placeholder="Posición inicial | Ejecución del movimiento | Tips extras"
                                className={`${errors.description && errors.description.message ? "input-form-error" : ""} input-form h-24`}
                            />
                            {/* Tip de ayuda visual debajo del campo */}
                            <div className="mt-2 flex items-center gap-2 px-1">
                                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight">
                                    Usa una barra <span className="text-blue-500">"|"</span> para separar Posición Inicial de Ejecución.
                                </p>
                            </div>
                            {errors.description && (
                                <p className="input-message-error">{errors.description.message}</p>
                            )}
                        </div>
                    </div>
                        
                    <div className="  flex items-center gap-4 pt-8 pb-4">
                        <div className="h-px flex-1 bg-linear-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
                        <div className="flex items-center gap-2">
                            <LuVideo className="text-blue-600" size={14} />
                            <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em] whitespace-nowrap">
                                Archivos Multimedia
                            </span>
                        </div>
                        <div className="h-px flex-1 bg-linear-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
                    </div>
    
                    {/* Exercise image */}
                    <div>
                        <label htmlFor="image" className="label-form">Imagen de Portada (Avatar)</label>
                        <input 
                            id="image"
                            type="file" 
                            accept="image/png, image/jpeg, image/webp"
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                cursor-pointer"
                            {...register("image", {
                                validate: {
                                    lessThan2Mb: (files) => 
                                        !files[0] || files[0].size < 2000000 || "La imagen debe pesar menos de 2MB",
                                    acceptedFormats: (files) => 
                                        !files[0] || ['image/jpeg', 'image/png', 'image/webp'].includes(files[0].type) || 
                                        "Solo se permiten formatos JPG, PNG o WebP"
                                }
                            })}

                        />
                        {errors.image && <p className="input-message-error">{errors.image.message}</p>} 
                    </div>
                        
                    {/* Exercise vide */}
                    <div>
                        <label htmlFor="video" className="label-form">Video de Ejecución</label>
                        <input 
                            id="video"
                            type="file" 
                            accept="video/mp4, video/webm"
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                cursor-pointer"
                            {...register("video", {
                                validate: {
                                    lessThan15Mb: (files) => 
                                        !files[0] || files[0].size < 15000000 || "El video debe pesar menos de 15MB",
                                    acceptedFormats: (files) => 
                                        !files[0] || ['video/mp4', 'video/webm', 'video/quicktime'].includes(files[0].type) || 
                                        "Solo se permiten videos MP4, WebM o MOV"
                                }
                            })}
                        />
                        {errors.video && <p className="input-message-error">{errors.video.message}</p>} 
                    </div>

                    {messageError && 
                        <MessageError>
                            {messageError}
                        </MessageError>
                    }   
                    <Button 
                        colorButton={`primary`}
                        loading={loading}
                        className='mt-4'
                    >
                        <FaDumbbell className="text-xs" /> Editar
                    </Button>
                </form>
            </div>
        </>
    );
};

export default ExerciseEditPage;