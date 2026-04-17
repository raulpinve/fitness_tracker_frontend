import { useAxiosInterceptor } from "../hooks/useAxiosInterceptor";

export const useWorkoutExerciseServices = () => {
    const api = useAxiosInterceptor();

    const workoutExerciseService = {
        getWorkoutActiveExercises: async(workoutId) => {
            const res = await api.get("/workouts-exercises/active", {
                params: {
                    workoutId,
                }
            });
            return res.data;
        },
        createWorkoutExercise: async(data) => {
            const res = await api.post(`/workouts-exercises`, data);
            return res.data;
        },
        getWorkoutExercise: async(workoutId) => {
            const res = await api.get(`/workouts-exercises/${workoutId}`);
            return res.data;
        },
        getAllWorkoutExercises: async(workoutId) => {
            const res = await api.get("/workouts-exercises", {
                params: {
                    workoutId,
                }
            });
            return res.data;
        }, 
        deleteWorkoutExercise: async(workoutExerciseId) => {
            const res = await api.delete(`/workouts-exercises/${workoutExerciseId}`);
            return res.data;
        }
    }
    return workoutExerciseService;
}
