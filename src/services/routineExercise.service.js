import { useAxiosInterceptor } from "../hooks/useAxiosInterceptor";

export const useRoutineExerciseService = () => {
    const api = useAxiosInterceptor();

    const routineExerciseService = {
        createRoutineExercise: async(data) => {
            const res 
            = await api.post(`/routine-exercises`, data);
            return res.data;
        },
        getRoutineExercise: async(routineExerciseId) => {
            const res = await api.get(`/routine-exercises/${routineExerciseId}`);
            return res.data;
        },
        getAllRoutineExercises: async(routineId, page, pageSize = 100) => {
            const res = await api.get(`/routine-exercises/routine/${routineId}`, {
                params: {
                    page, 
                    pageSize
                }
            });
            return res.data;
        }, 
        updateRoutineExercise: async(routineExerciseId, data) => {
            const res = await api.patch(`/routine-exercises/${routineExerciseId}`, data);
            return res.data;
        }, 
        deleteRoutineExercise: async(routineExerciseId) => {
            const res = await api.delete(`/routine-exercises/${routineExerciseId}`);
            return res.data;
        }
    } 
    return routineExerciseService;
}