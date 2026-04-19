import React, { useState } from 'react';
import { useExerciseServices } from '../../services/exercises.service';
import MessageError from '../../shared/components/MessageError';
import { handleErrors } from '../../utils/handleErrors';
import Header from '../../shared/components/Header';
import Button from '../../shared/components/Button';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { LuInfo, LuVideo } from 'react-icons/lu';
import { equipmentNames, muscleGroupNames } from './utils/exerciseConstants';

const ExerciseCreatePage = () => {
    const { 
        register, 
        handleSubmit, 
        watch, 
        reset,
        setError,
        setValue, 
        formState: { errors } 
    } = useForm({
        defaultValues: {
            muscleGroups: [] 
        }
    });

    const [loading, setLoading] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const {createExercise} = useExerciseServices();
    const navigate = useNavigate();

    const onSubmit = async (values) => {
        setMessageError(false);
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("type", values.type);
            formData.append("equipment", values.equipment);
            formData.append("description", values.description);
            
            // Debemos añadir cada músculo individualmente bajo el mismo nombre de llave
            // para que el Backend (multer/express) lo reconstruya como un array.
            if (values.muscleGroups && values.muscleGroups.length > 0) {
                values.muscleGroups.forEach(muscle => {
                    // Quitamos los corchetes [] del nombre
                    formData.append("muscleGroups", muscle); 
                });
            }


            if (values.image && values.image[0]) {
                formData.append("image", values.image[0]);
            }
            if (values.video && values.video[0]) {
                formData.append("video", values.video[0]);
            }

            const res = await createExercise(formData);
            
            // Limpiamos el formulario (reset de react-hook-form es más limpio)
            reset(); 
            
            navigate(`/exercises/${res?.data?.id || ""}`);
            toast.success('Ejercicio creado exitosamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Header 
                title={`Crear ejercicio`}
                showBack={true}
            />
            <div className="p-4">
                <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' className='grid gap-2'>
                    {/* Name */}
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
                    {/* type */}
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

                    {/* Muscle Group */}
                    <div>
                        <label className="label-form mb-3 block">
                            Grupos Musculares<span className="input-required">*</span> 
                            <span className="text-[9px] font-normal lowercase ml-2 opacity-50 italic">(Toca para seleccionar varios)</span>
                        </label>

                        <div className={`flex flex-wrap gap-2 p-4 rounded-[2rem] border transition-all ${
                            errors.muscleGroups ? "border-red-500 bg-red-50/10" : "border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30"
                        }`}>
                            {Object.entries(muscleGroupNames).map(([key, value]) => {
                                // Obtenemos el valor actual del array desde react-hook-form
                                const currentMuscles = watch("muscleGroups") || [];
                                const isSelected = currentMuscles.includes(key);
                                const isPrimary = currentMuscles[0] === key;

                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => {
                                            const newMuscles = isSelected
                                                ? currentMuscles.filter(m => m !== key) // Quitar si ya está
                                                : [...currentMuscles, key];            // Agregar si no está
                                            
                                            // Actualizamos react-hook-form manualmente
                                            setValue("muscleGroups", newMuscles, { shouldValidate: true });
                                        }}
                                        className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase italic transition-all duration-300 border ${
                                            isSelected 
                                            ? isPrimary 
                                                ? "bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/20 scale-105" 
                                                : "bg-zinc-800 dark:bg-zinc-200 border-zinc-700 dark:border-zinc-300 text-white dark:text-zinc-900"
                                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400"
                                        }`}
                                    >
                                        {value}
                                        {isPrimary && <span className="ml-1 text-[8px] opacity-60">★</span>}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Input oculto para que react-hook-form mantenga la validación */}
                        <input 
                            type="hidden" 
                            {...register("muscleGroups", { 
                                required: "Debes seleccionar al menos un grupo muscular",
                                validate: v => v.length > 0 || "Selecciona al menos uno"
                            })} 
                        />

                        {errors.muscleGroups && (
                            <p className="input-message-error mt-2">{errors.muscleGroups.message}</p>
                        )}
                    </div>


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
                    <div className='mt-4'>
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
                        
                    {/* Exercise video */}
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

                    {messageError && <MessageError> {messageError} </MessageError>}   
                    
                    <Button 
                        colorButton={`primary`}
                        loading={loading}
                        className='mt-4'
                    >
                        Guardar
                    </Button>
                </form>
            </div>
        </>
    );
};

export default ExerciseCreatePage;