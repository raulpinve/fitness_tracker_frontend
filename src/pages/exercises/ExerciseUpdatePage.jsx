import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import Button from '../../shared/components/Button';
import { useForm } from 'react-hook-form';
import { IoChevronDown } from 'react-icons/io5';
import MessageError from '../../shared/components/MessageError';
import { toast } from 'sonner';
import { handleErrors } from '../../utils/handleErrors';
import { useExerciseServices } from '../../services/exercises.service';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const ExerciseUpdatePage = () => {
    const {register, handleSubmit, setError, formState: { errors }, setValue, reset} = useForm({  mode: "onChange" });
    const [loading, setLoading] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const { updateExercise } = useExerciseServices();
    const navigate = useNavigate();
    const { getExercise } = useExerciseServices();
    const { exerciseId } = useParams();
    const { state } = useLocation();
    const [loadingData, setLoadingData] = useState(!state?.exercise);

    const onSubmit = async(values) => {
        setMessageError(false)
        setLoading(true)
        try {
            await updateExercise(exerciseId, values);
            setValue("name", "");
            setValue("type", "");
            navigate("/exercises");
            toast.success('Ejercicio editado exitosamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                const sourceData = state?.exercise || (await getExercise(exerciseId)).data;
                setValue("name", sourceData.name);
                setValue("type", sourceData.type);
            } catch {
                toast.error("Error al obtener la información del ejercicio");
            } finally {
                setLoadingData(false);
            }
        };
        loadData();
    }, [exerciseId, state, setValue, getExercise]);

    if (loadingData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-4xl" />
            </div>
        );
    }
     
    return (
        <>
            <Header 
                title={`Editar ejercicio`}
                showBack={true}
            />
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

                    {/* tipo */}
                    <div>
                        <label htmlFor="type" className="label-form">
                            Tipo <span className="input-required">*</span>
                        </label>
                        <div className="relative">
                            <select 
                                id='type' className={`${errors.type && errors.type.message ? "input-form-error" : ""} input-form`}
                                {...register("type", {
                                    required: "Debe seleccionar un tipo"
                                })}
                            >
                                <option value="">Seleccionar...</option>
                                <option value="strength">Fuerza</option>
                                <option value="cardio">Cardio</option>
                            </select>
                            <label htmlFor="type">
                                <IoChevronDown  className='absolute right-3 top-3.5' />
                            </label>
                        </div>
                    </div>

                    {messageError && 
                        <MessageError>
                            {messageError}
                        </MessageError>
                    }   
                    
                    <Button 
                        colorButton={`primary`}
                        loading={loading}
                    >
                        Guardar cambios
                    </Button>
                </form>
            </div>
        </>
    );
};

export default ExerciseUpdatePage;