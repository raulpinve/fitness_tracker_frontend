import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useWorkoutSetServices } from '../../../services/workoutSet.service';

const ExerciseBlock = ({ exercise, workout, onRemove  }) => {
    const [sets, setSets] = useState([]);
    const { register, handleSubmit, reset } = useForm();
    const { getAllWorkoutSets, createWorkoutSet } = useWorkoutSetServices();

    useEffect(() => {
        const fetchSets = async () => {
            try {
                // Endpoint that filters: WHERE workout_id = $1 AND exercise_id = $2
                const res = await getAllWorkoutSets(workout?.id, exercise.exerciseId);
                setSets(res.data); 
            } catch (error) {
                console.error(error)                
            }
        };
        fetchSets();
    }, [exercise.exerciseId, workout.id]);

    const onSubmitSet = async (data) => {
        try {
            const response = await createWorkoutSet({
                workoutId: workout.id,
                exerciseId: exercise.exerciseId,
                reps: parseInt(data.reps),
                weight: parseFloat(data.weight)
            });

            if (response.statusCode === 201) {
                // We update the visual list instantly
                setSets([...sets, response.data]);
                reset(); 
            }
        } catch (error) {
            console.error("Error al guardar el set", error);
        }
    };

    return (
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm relative">
            {!workout.finishedAt && (
                <button 
                    onClick={() => onRemove(exercise.exerciseId)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-sm"
                >
                    Saltar
                </button>
            )}
            <h3 className="text-xl font-bold mb-4">{exercise.name}</h3>
            <div className="space-y-2 mb-4">
                {sets.map((set, index) => (
                    <div key={set.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border-l-4 border-blue-400">
                        <span className="font-bold text-gray-500">SET {index + 1}</span>
                        <div className="flex gap-4">
                            <span>{set.weight} kg</span>
                            <span>{set.reps} reps</span>
                        </div>
                    </div>
                ))}
            </div>

            {!workout.finishedAt && (
                <form onSubmit={handleSubmit(onSubmitSet)} className="flex gap-2 items-end border-t border-gray-200 pt-4">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-500">Peso (kg)</label>
                        <input 
                            type="number" step="0.25"
                            {...register("weight", { required: true })}
                            className="input-form"
                            placeholder="0"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-500">Reps</label>
                        <input 
                            type="number"
                            {...register("reps", { required: true })}
                            className="input-form"
                            placeholder="0"
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                        +
                    </button>
                </form>
            )}
        </div>
    );
};

export default ExerciseBlock;
