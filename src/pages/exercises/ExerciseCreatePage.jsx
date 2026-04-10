import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import Button from '../../shared/components/Button';
import { useForm } from 'react-hook-form';
import { IoChevronDown } from 'react-icons/io5';
import MessageError from '../../shared/components/MessageError';
import { toast } from 'sonner';
import { handleErrors } from '../../utils/handleErrors';
import { useExerciseServices } from '../../services/exercises.service';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';

const ExerciseCreatePage = () => {
    const {register, handleSubmit, setError, formState: { errors }, setValue} = useForm({  mode: "onChange" });
    const [loading, setLoading] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const {createExercise} = useExerciseServices();
    const navigate = useNavigate();

    const onSubmit = async(values) => {
        setMessageError(false)
        setLoading(true)
        try {
            await createExercise(values);
            setValue("name", "");
            navigate("/exercises");
            toast.success('Ejercicio creado exitosamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }

    return (
        <>
            <Header 
                title={`Crear ejercicio`}
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

                    {/* Tipo */}
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
                            <IoIosArrowDown className='absolute top-3.5 right-3' />
                            {errors.type && (<p className="input-message-error">{errors.type.message}</p>)} 

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
                        Guardar
                    </Button>
                </form>
            </div>
        </>
    );
};

export default ExerciseCreatePage;