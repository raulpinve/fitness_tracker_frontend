import { useExerciseServices } from '../../services/exercises.service';
import MessageError from '../../shared/components/MessageError';
import { StrengthForm } from './components/StrengthForm';
import { useParams } from 'react-router-dom';
import { CardioForm } from './components/CardioForm';
import Header from '../../shared/components/Header';
import React, { useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

const RoutineExerciseCreatePage = () => {
    const { register, control, formState: { errors }  } = useForm({ mode: "onChange" });
    const [availableExercises, setAvailableExercises] = useState([]);
    const [messageError, setMessageError] = useState(false);
    const { getAllExercises } = useExerciseServices();
    const { routineId } = useParams();
  
    useEffect(() => {
        const fetchDataExercises = async () => {
            try {
                const res = await getAllExercises(1, 100);
                setAvailableExercises(res.data);
            } catch {
                toast.error("Error al recuperar el listado de ejercicios");
            }
        };
        fetchDataExercises();
    }, []);

    const selectedExerciseId = useWatch({
        control,
        name: "exerciseId"
    });
    const selectedExercise = availableExercises.find(ex => ex.id === selectedExerciseId);

    return (
        <>
            <Header title="Agregar ejercicio" showBack={true} />
            <div className="p-4">
                <div className='grid gap-4'>
                    <div>
                        <label className="label-form">Ejercicio <span className="input-required">*</span></label>
                        <div className="relative">
                            <select 
                                {...register("exerciseId", { required: "Selecciona un ejercicio" })}
                                className={`input-form ${errors.exerciseId ? 'input-form-error' : ''}`}
                            >
                                <option value="">Seleccione uno...</option>
                                {availableExercises.map(ex => (
                                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                                ))}
                            </select>
                            <span className='absolute top-3 right-3 pointer-events-none dark:text-zinc-400'>
                                <IoIosArrowDown />
                            </span>
                        </div>
                    </div>
                    {selectedExercise?.type === 'strength' && (
                        <StrengthForm 
                            exercise={selectedExercise} 
                            routineId={routineId} 
                            setMessageError={setMessageError}
                        />
                    )}
                    {selectedExercise?.type === 'cardio' && (
                        <CardioForm 
                            exercise={selectedExercise} 
                            routineId={routineId} 
                            setMessageError={setMessageError}
                        />
                    )}
                    {messageError && <MessageError>{messageError}</MessageError>}
                </div>
            </div>
        </>
    );
};

export default RoutineExerciseCreatePage;
