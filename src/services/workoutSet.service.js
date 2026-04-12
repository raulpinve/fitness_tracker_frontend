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
        getAllWorkoutSets: async(workoutExerciseId) => {
            const res = await api.get("/workout-sets", {
                params: {
                    workoutExerciseId: workoutExerciseId,
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
