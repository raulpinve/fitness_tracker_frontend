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

const ExerciseCreatePage = () => {
    const {register, handleSubmit, setError, formState: { errors }, setValue} = useForm({  mode: "onChange" });
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
            formData.append("muscleGroup", values.muscleGroup);
            formData.append("equipment", values.equipment);
            formData.append("description", values.description);
            
            if (values.image && values.image[0]) {
                formData.append("image", values.image[0]);
            }
            if (values.video && values.video[0]) {
                formData.append("video", values.video[0]);
            }
            const res = await createExercise(formData);
            setValue("name", "");
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

                    {/* Muscular group */}
                    <div>
                        <label htmlFor="muscleGroup" className="label-form">
                            Grupo muscular<span className="input-required">*</span>
                        </label>
                        <div className="relative">
                            <select
                                {...register("muscleGroup", {
                                    required: "Debe seleccionar un tipo"
                                })}
                                className={`${errors.muscleGroup && errors.muscleGroup.message ? "input-form-error" : ""} input-form`}
                            >
                                <option value="">Seleccionar</option>
                                <option value="pecho">Pecho</option>
                                <option value="espalda">Espalda</option>
                                <option value="hombros">Hombros</option>
                                <option value="biceps">Bíceps</option>
                                <option value="triceps">Triceps</option>
                                <option value="antebrazos">Antebrazos</option>
                                <option value="cuadriceps">Cuádriceps</option>
                                <option value="isquios">Isquios</option>
                                <option value="gluteos">Gluteos</option>
                                <option value="gemelos">Gemelos</option>
                                <option value="abs">Abdominales</option>
                                <option value="cardio">Cardio</option>
                                <option value="full_body">Full body</option>
                            </select>
                            <IoIosArrowDown className='absolute top-3.5 right-3 dark:text-zinc-400' />
                            {errors.muscleGroup && (<p className="input-message-error">{errors.muscleGroup.message}</p>)} 
                        </div>
                    </div>

                    {/* Equipment */}
                    <div>
                        <label htmlFor="equipment" className="label-form">
                            Equipamiento<span className="input-required">*</span>
                        </label>
                        <div className="relative">
                            <select
                                {...register("equipment", {
                                    required: "Debe seleccionar un tipo"
                                })}
                                className={`${errors.equipment && errors.equipment.message ? "input-form-error" : ""} input-form`}
                            >
                                <option value="">Seleccionar</option>
                                <option value="barras">Barras</option>
                                <option value="mancuernas">Mancuernas</option>
                                <option value="maquinas">Máquinas</option>
                                <option value="poleas">Poleas</option>
                                <option value="peso_corporal">Peso corporal</option>
                                <option value="bandas">Bandas</option>
                                <option value="kettlebells">Kettlebells</option>
                                <option value="ninguno">Ninguno</option>
                            </select>
                            <IoIosArrowDown className='absolute top-3.5 right-3 dark:text-zinc-400' />
                            {errors.equipment && (<p className="input-message-error">{errors.equipment.message}</p>)} 
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