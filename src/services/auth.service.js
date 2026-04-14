import { useAxiosInterceptor } from "../hooks/useAxiosInterceptor";

export const useAuthServices = () => {
    const api = useAxiosInterceptor();
    
    const authService = {
        login: async(data) => {
            const res = await api.post("/auth/login", data);
            return res.data;
        },
        signUp: async (data) => {
            const res = await api.post("/auth/register", data);
            return res.data;
        },
        logOut: async (data) => {
            const res = await api.post("/auth/logout", data);
            return res.data;
        },
    } 
    return authService;
}