import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import Button from '../../shared/components/Button';
import { useForm } from 'react-hook-form';
import MessageError from '../../shared/components/MessageError';
import { toast } from 'sonner';
import { handleErrors } from '../../utils/handleErrors';
import { useRoutineServices } from '../../services/routine.service';
import { useNavigate } from 'react-router-dom';

const RoutineCreatePage = () => {
    const {register, handleSubmit, setError, formState: { errors }, setValue} = useForm({  mode: "onChange" });
    const [loading, setLoading] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const {createRoutine} = useRoutineServices();
    const navigate = useNavigate();

    const onSubmit = async(values) => {
        setMessageError(false)
        setLoading(true)
        try {
            await createRoutine(values);
            setValue("name", "");
            navigate("/routines");
            toast.success('Rutina creada exitosamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }

    return (
        <>
            <Header 
                title={`Crear rutina`}
                showBack={true}
            />
            <div className="p-4">
                <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' className='grid gap-2'>
                    {/* Nombre */}
                    <div>
                        <label htmlFor="name" className="label-form">
                            Nombre de la rutina<span className="input-required">*</span>
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

export default RoutineCreatePage;