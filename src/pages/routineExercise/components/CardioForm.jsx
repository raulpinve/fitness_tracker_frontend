import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../../shared/components/Button';
import { useRoutineExerciseService } from '../../../services/routineExercise.service';
import { handleErrors } from '../../../utils/handleErrors';

export const CardioForm = ({ exercise, routineId, setMessageError, initialData }) => {
    // 1. Obtenemos el ID de la relación desde la URL
    const { routineExerciseId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // 2. Servicios
    const { createRoutineExercise, updateRoutineExercise } = useRoutineExerciseService();

    // 3. Configuración del Formulario con conversión de segundos a minutos
    const { register, handleSubmit, setError } = useForm({
        defaultValues: initialData ? {
            targetDurationMinutes: initialData.targetDurationSeconds ? initialData.targetDurationSeconds / 60 : '',
            targetDistanceKm: initialData.targetDistanceKm || ''
        } : {}
    });

    const onSubmit = async (values) => {
        setLoading(true);
        setMessageError(false);
        try {
            // 4. Preparamos el payload convirtiendo minutos a segundos para la DB
            const payload = {
                exerciseId: exercise.id,
                routineId,
                targetDistanceKm: values.targetDistanceKm ? parseFloat(values.targetDistanceKm) : null,
                targetDurationSeconds: values.targetDurationMinutes ? parseInt(values.targetDurationMinutes) * 60 : null
            };

            if (initialData) {
                // LÓGICA DE EDICIÓN
                await updateRoutineExercise(routineExerciseId, payload);
                toast.success('Ejercicio de cardio actualizado');
            } else {
                // LÓGICA DE CREACIÓN
                await createRoutineExercise(payload);
                toast.success('Ejercicio de cardio agregado');
            }

            // Redirección común
            navigate(`/routines/${routineId}/exercises`);
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="label-form">Tiempo (minutos)</label>
                    <input 
                        type="number" 
                        placeholder="Ej: 30"
                        className="input-form"
                        {...register("targetDurationMinutes")} 
                    />
                </div>
                <div>
                    <label className="label-form">Distancia (km)</label>
                    <input 
                        type="number" 
                        step="0.1" 
                        placeholder="Ej: 5.0"
                        className="input-form"
                        {...register("targetDistanceKm")} 
                    />
                </div>
            </div>
            <p className="text-xs text-gray-400 italic">Define al menos una meta: tiempo o distancia.</p>
            
            <Button colorButton="primary" loading={loading}>
                {initialData ? 'Actualizar Cardio' : 'Guardar Cardio'}
            </Button>
        </form>
    );
};
