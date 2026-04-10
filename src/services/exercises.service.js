import { useAxiosInterceptor } from "../hooks/useAxiosInterceptor";

export const useExerciseServices = () => {
    const api = useAxiosInterceptor();

    const exerciseService = {
        createExercise: async(data) => {
            const res = await api.post(`/exercises`, data);
            return res.data;
        },
        getExercise: async(exerciseId) => {
            const res = await api.get(`/exercises/${exerciseId}`);
            return res.data;
        },
        getAllExercises: async (page = 1, pageSize = 20) => {
            const res = await api.get("/exercises", {
                params: {
                    page,
                    pageSize
                }
            });
            return res.data; 
        },
        updateExercise: async(exerciseId, data) => {
            const res = await api.patch(`/exercises/${exerciseId}`, data);
            return res.data;
        }, 
        deleteExercise: async(exerciseId) => {
            const res = await api.delete(`/exercises/${exerciseId}`);
            return res.data;
        }
    } 
    return exerciseService;
}