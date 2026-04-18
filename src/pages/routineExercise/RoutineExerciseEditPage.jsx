import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import MessageError from '../../shared/components/MessageError';
import { toast } from 'sonner';
import { useLocation, useParams } from 'react-router-dom';
import { useExerciseServices } from '../../services/exercises.service';
import { useRoutineExerciseService } from '../../services/routineExercise.service';
import { StrengthForm } from './components/StrengthForm';
import { CardioForm } from './components/CardioForm';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const RoutineExerciseEditPage = () => {
    const { getRoutineExercise } = useRoutineExerciseService();
    const { getAllExercises } = useExerciseServices();
    const { routineExerciseId } = useParams();
    const { state } = useLocation();
    const [loadingData, setLoadingData] = useState(true);
    const [messageError, setMessageError] = useState(false);
    const [availableExercises, setAvailableExercises] = useState([]);
    const [routineExercise, setRoutineExercise] = useState(state?.routineExercise || null);

    // 1. Load exercise list (to display the name in the "label")
    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const res = await getAllExercises(1, 100);
                setAvailableExercises(res.data);
            } catch {
                toast.error("Error al recuperar el listado de ejercicios");
            }
        };
        fetchExercises();
    }, []);

    // 2. Load exercise data to edit if it doesn't come in the 'state'
    useEffect(() => {
        const loadData = async () => {
            if (state?.routineExercise) {
                setLoadingData(false);
                return;
            }
            try {
                const res = await getRoutineExercise(routineExerciseId);
                setRoutineExercise(res.data);
            } catch {
                toast.error("Error al obtener la información del ejercicio");
            } finally {
                setLoadingData(false);
            }
        };
        loadData();
    }, [routineExerciseId, state]);

    if (loadingData) return (
        <div className="flex justify-center items-center h-screen dark:bg-zinc-950">
            <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-4xl" />
        </div>
    );

    return (
        <>
            <Header title="Editar ejercicio" showBack={true} />
            <div className="p-4">
                <div className='grid gap-4'>
                    {/* Información del ejercicio (no editable para no romper la lógica) */}
                    <div>
                        <label className="label-form ">Ejercicio seleccionado:</label>
                        <div className="p-3 bg-gray-100 dark:bg-zinc-800 dark:text-gray-200 text-sm font-bold rounded-lg text-gray-700">
                            {routineExercise?.exerciseName || 
                             availableExercises.find(ex => ex.id === routineExercise?.exerciseId)?.name}
                        </div>
                    </div>

                    {/* Renderizado condicional del formulario correcto */}
                    {routineExercise?.exerciseType?.toLowerCase() === 'strength' && (
                        <StrengthForm 
                            exercise={{ id: routineExercise.exerciseId }} 
                            routineId={routineExercise.routineId} 
                            initialData={routineExercise}
                            setMessageError={setMessageError}
                        />
                    )}

                    {routineExercise?.exerciseType?.toLowerCase() === 'cardio' && (
                        <CardioForm 
                            exercise={{ id: routineExercise.exerciseId }} 
                            routineId={routineExercise.routineId} 
                            initialData={routineExercise}
                            setMessageError={setMessageError}
                        />
                    )}
                    {messageError && <MessageError>{messageError}</MessageError>}
                </div>
            </div>
        </>
    );
};

export default RoutineExerciseEditPage;
