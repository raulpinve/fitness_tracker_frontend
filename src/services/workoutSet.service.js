import { useAxiosInterceptor } from "../hooks/useAxiosInterceptor";

export const useWorkoutSetServices = () => {
    const api = useAxiosInterceptor();

    const workoutSetService = {
        createWorkoutSet: async(data) => {
            const res = await api.post(`/workout-sets`, data);
            return res.data;
        },
        getWorkoutSet: async(workoutSetId) => {
            const res = await api.get(`/workout-sets/${workoutSetId}`);
            return res.data;
        },
        getAllWorkoutSets: async(workoutId, exerciseId = null) => {
            const res = await api.get("/workout-sets", {
                params: {
                    workoutId,
                    exerciseId 
                }
            });
            return res.data;
        }, 
        updateWorkoutSet: async(workoutSetId, data) => {
            const res = await api.patch(`/workout-sets/${workoutSetId}`, data);
            return res.data;
        }, 
        deleteWorkoutSet: async(workoutSetId) => {
            const res = await api.delete(`/workout-sets/${workoutSetId}`);
            return res.data;
        }
    }
    return workoutSetService;
}
