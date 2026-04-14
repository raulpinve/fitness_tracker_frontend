import { useAxiosInterceptor } from "../hooks/useAxiosInterceptor";

export const useUserServices = () => {
    const api = useAxiosInterceptor();
    
    const userService = {
        getUserStats: async(data) => {
            const res = await api.get("/users/stats", data);
            return res.data;
        },
        updateUserInfo: async(data) => {
            const res = await api.put("/users", data);
            return res.data;
        }
    } 
    return userService;
}