import { useAxiosInterceptor } from "../hooks/useAxiosInterceptor";

export const useRoutineServices = () => {
    const api = useAxiosInterceptor();

    const routineService = {
        createRoutine: async(data) => {
            const res = await api.post(`/routines`, data);
            return res.data;
        },
        getRoutine: async(routineId) => {
            const res = await api.get(`/routines/${routineId}`);
            return res.data;
        },
        getAllRoutines: async(page = 1, pageSize = 20) => {
            const res = await api.get("/routines", {
                params: {
                    page, 
                    pageSize
                }
            });
            return res.data;
        }, 
        updateRoutine: async(routineId, data) => {
            const res = await api.patch(`/routines/${routineId}`, data);
            return res.data;
        }, 
        deleteRoutine: async(routineId) => {
            const res = await api.delete(`/routines/${routineId}`);
            return res.data;
        }
    }
    return routineService;
}