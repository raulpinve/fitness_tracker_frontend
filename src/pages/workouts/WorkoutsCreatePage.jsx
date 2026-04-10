import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import Button from '../../shared/components/Button';
import { useForm } from 'react-hook-form';
import MessageError from '../../shared/components/MessageError';
import { toast } from 'sonner';
import { handleErrors } from '../../utils/handleErrors';
import { useRoutineServices } from '../../services/routine.service';
import { useWorkoutServices } from "../../services/workout.service";
import { useNavigate } from 'react-router-dom';

const WorkoutsCreatePage = () => {
    const {register, handleSubmit, setError, formState: { errors }, setValue} = useForm({  mode: "onChange" });
    const [loading, setLoading] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const {getAllRoutines} = useRoutineServices();
    const {createWorkout} = useWorkoutServices();
    const [routines, setRoutines] = useState([]);
    const [isLoadingRoutineData, setIsLoadingRoutineData] = useState();
    const navigate = useNavigate();

    const onSubmit = async(values) => {
        setMessageError(false)
        setLoading(true)
        try {
            const resWorkout = await createWorkout(values);
            navigate(`/routines/${resWorkout.data.id}`);
            toast.success('Rutina creada exitosamente.');
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally{
            setLoading(false)
        }
    }

    // Get all routines 
    useEffect(() => {
        const fecthData = async () => {
            setIsLoadingRoutineData(true);
            try {
                const res = await getAllRoutines(1, 100);
                setRoutines(res.data);
            } catch (error) {
                console.error(error);
                toast.error("No se pudieron cargar las rutinas");
            } finally {
                setIsLoadingRoutineData(false);
            }
        }
        fecthData();
    }, [])

    const getLocalDatetime = () => {
        const ahora = new Date();
        ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
        return ahora.toISOString().slice(0, 16);
    };

    return (
        <>
            <Header 
                title={`Crear entrenamiento`}
                showBack={true}
            />
            <div className="p-4">
                <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' className='grid gap-4'>
                    {/* Selección de Rutina (Opcional) */}
                    <div>
                        <label htmlFor="routineId" className="label-form">
                            Seleccione una rutina
                        </label>
                        <select 
                            className="input-form"
                            {...register("routineId")}
                            id="routineId"
                        >
                            <option value="">Entrenamiento Libre (Sin rutina)</option>
                            {routines.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Si no seleccionas ninguna, podrás añadir ejercicios sobre la marcha.</p>
                    </div>
                    <div>
                        <label htmlFor="startedAt" className="label-form">Fecha de inicio</label>
                        <input 
                            type="datetime-local"
                            className="input-form"
                            {...register("startedAt")}
                            defaultValue={getLocalDatetime()}
                        />
                    </div>
                    {messageError && <MessageError>{messageError}</MessageError>}
                    <Button colorButton="primary" loading={loading}>
                        Iniciar entrenamiento
                    </Button>
                </form>


            </div>
        </>
    );
};

export default WorkoutsCreatePage;