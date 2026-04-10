import { useAxiosInterceptor } from "../hooks/useAxiosInterceptor";

export const useWorkoutServices = () => {
    const api = useAxiosInterceptor();

    const workoutService = {
        createWorkout: async(data) => {
            const res = await api.post(`/workouts`, data);
            return res.data;
        },
        getWorkout: async(workoutId) => {
            const res = await api.get(`/workouts/${workoutId}`);
            return res.data;
        },
        getAllWorkouts: async() => {
            const res = await api.get("/workouts");
            return res.data;
        }, 
        updateWorkout: async(workoutId, data) => {
            const res = await api.update(`/workouts/${workoutId}`, data);
            return res.data;
        }, 
        deleteWorkout: async(workoutId) => {
            const res = await api.delete(`/workouts/${workoutId}`);
            return res.data;
        },
        finishWorkout: async (id) => {
            const res = await api.patch(`/workouts/${id}/finish`); 
            return res.data;
        }
    }
    return workoutService;
}
