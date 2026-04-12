import { useAxiosInterceptor } from "../hooks/useAxiosInterceptor";

export const useCardioLogServices = () => {
    const api = useAxiosInterceptor();

    const cardioLogService = {
        createCardioLog: async(data) => {
            const res = await api.post(`/cardio-logs`, data);
            return res.data;
        },
        getCardioLog: async(cardioLogId) => {
            const res = await api.get(`/cardio-logs/${cardioLogId}`);
            return res.data;
        },
        getAllCardioLogs: async(workoutExerciseId) => {
            const res = await api.get("/cardio-logs", {
                params: {
                    workoutExerciseId: workoutExerciseId,
                }
            });
            return res.data;
        }, 
        updateCardioLogs: async(cardioLogId, data) => {
            const res = await api.patch(`/cardio-logs/${cardioLogId}`, data);
            return res.data;
        }, 
        deleteCardioLog: async(cardioLogId) => {
            const res = await api.delete(`/cardio-logs/${cardioLogId}`);
            return res.data;
        }
    }
    return cardioLogService;
}
