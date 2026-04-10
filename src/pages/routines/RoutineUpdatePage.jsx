import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import Button from '../../shared/components/Button';
import { useForm } from 'react-hook-form';
import MessageError from '../../shared/components/MessageError';
import { toast } from 'sonner';
import { handleErrors } from '../../utils/handleErrors';
import { useRoutineServices } from '../../services/routine.service';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const RoutineUpdatePage = () => {
    const {register, handleSubmit, setError, formState: { errors }, setValue} = useForm({  mode: "onChange" });
    const [loading, setLoading] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const { updateRoutine } = useRoutineServices();
    const { getRoutine } = useRoutineServices();
    const { routineId } = useParams();
    const { state } = useLocation();
    const [loadingData, setLoadingData] = useState(!state?.exercise);
    const navigate = useNavigate();
    
    const onSubmit = async(values) => {
        setMessageError(false)
        setLoading(true)
        try {
            await updateRoutine(routineId, values);
            setValue("name", "");
            navigate("/routines");
            toast.success('Rutina editada exitosamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                const sourceData = state?.exercise || (await getRoutine(routineId)).data;
                setValue("name", sourceData.name);
            } catch {
                toast.error("Error al obtener la información de la rutina");
            } finally {
                setLoadingData(false);
            }
        };
        loadData();
    }, [routineId, state, setValue, getRoutine]);

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
                title={`Editar rutina`}
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

export default RoutineUpdatePage;