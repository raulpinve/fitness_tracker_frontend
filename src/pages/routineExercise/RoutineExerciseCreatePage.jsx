import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import { useForm } from 'react-hook-form';
import MessageError from '../../shared/components/MessageError';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import { useExerciseServices } from '../../services/exercises.service';
import { StrengthForm } from './components/StrengthForm';
import { CardioForm } from './components/CardioForm';

const RoutineExerciseCreatePage = () => {
    const { register, watch, formState: { errors } } = useForm({ mode: "onChange" });
    const [messageError, setMessageError] = useState(false);
    const [availableExercises, setAvailableExercises] = useState([]);
    const { getAllExercises } = useExerciseServices();
    const navigate = useNavigate();
    const { routineId } = useParams();

    const selectedExerciseId = watch("exerciseId");
    const selectedExercise = availableExercises.find(ex => ex.id === selectedExerciseId);

    useEffect(() => {
        const fetchDataExercises = async () => {
            try {
                const res = await getAllExercises(1, 100);
                setAvailableExercises(res.data);
            } catch (error) {
                toast.error("Error al recuperar el listado de ejercicios");
            }
        };
        fetchDataExercises();
    }, []);

    return (
        <>
            <Header title="Agregar ejercicio" showBack={true} />
            <div className="p-4">
                <div className='grid gap-4'>
                    {/* Selector del ejercicio fuera de los sub-formularios */}
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

                    {/* Formularios Independientes: Cada uno con su propio onSubmit */}
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
