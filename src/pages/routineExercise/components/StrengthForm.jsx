import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../../shared/components/Button';
import { useRoutineExerciseService } from '../../../services/routineExercise.service';
import { handleErrors } from '../../../utils/handleErrors';

export const StrengthForm = ({ exercise, routineId, setMessageError, initialData }) => {
    const { routineExerciseId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const { createRoutineExercise, updateRoutineExercise } = useRoutineExerciseService();

    const { register, handleSubmit, setError, formState: { errors } } = useForm({
        defaultValues: initialData || {
            targetSets: '',
            targetReps: '',
            targetWeight: ''
        }
    });

    const onSubmit = async (values) => {
        setLoading(true);
        setMessageError(false);
        try {
            const payload = {
                ...values,
                exerciseId: exercise.id,
                routineId: routineId,
                targetSets: parseInt(values.targetSets),
                targetReps: parseInt(values.targetReps),
                targetWeight: values.targetWeight ? parseFloat(values.targetWeight) : null
            };

            if (initialData) {
                await updateRoutineExercise(routineExerciseId, payload);
                toast.success('Ejercicio actualizado correctamente');
            } else {
                await createRoutineExercise(payload);
                toast.success('Ejercicio agregado a la rutina');
            }
            navigate(`/routines/${routineId}/exercises`);
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <label className="label-form">Series <span className="input-required">*</span></label>
                    <input 
                        type="number" 
                        placeholder="Ej: 4"
                        min={0}
                        className={`input-form ${errors.targetSets ? 'input-form-error' : ''}`}
                        {...register("targetSets", { 
                            required: "Requerido", 
                            min: { value: 1, message: "Mínimo 1" } 
                        })} 
                    />
                    {errors.targetSets && <p className="input-message-error">{errors.targetSets.message}</p>}
                </div>
                <div>
                    <label className="label-form">Reps <span className="input-required">*</span></label>
                    <input 
                        type="number" 
                        placeholder="Ej: 12"
                        min={0}
                        className={`input-form ${errors.targetReps ? 'input-form-error' : ''}`}
                        {...register("targetReps", { 
                            required: "Requerido", 
                            min: { value: 1, message: "Mínimo 1" } 
                        })} 
                    />
                    {errors.targetReps && <p className="input-message-error">{errors.targetReps.message}</p>}
                </div>
                <div>
                    <label className="label-form">Peso (kg)</label>
                    <input 
                        min={0}

                        type="number" 
                        step="0.25"
                        placeholder="Ej: 50"
                        className="input-form"
                        {...register("targetWeight", {
                            min: { value: 0, message: "El peso no puede ser negativo" }
                        })}  
                    />
                </div>
            </div>
            <Button colorButton="primary" loading={loading}>
                {initialData ? 'Actualizar Ejercicio' : 'Guardar Ejercicio'}
            </Button>
        </form>
    );
};
