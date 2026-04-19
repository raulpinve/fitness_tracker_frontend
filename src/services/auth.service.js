import axios from "axios"; // Importamos axios normal para rutas públicas
import { useAxiosInterceptor } from "../hooks/useAxiosInterceptor";

const publicApi = axios.create({
    baseURL: "/api"
});

export const useAuthServices = () => {
    // Mantenemos el interceptor solo para rutas que SÍ requieren token (como logout o me)
    const privateApi = useAxiosInterceptor();
    
    const authService = {
        login: async(data) => {
            // Usamos publicApi para que no intente validar tokens inexistentes
            const res = await publicApi.post("/auth/login", data);
            return res.data;
        },
        signUp: async (data) => {
            // Usamos publicApi para el registro
            const res = await publicApi.post("/auth/register", data);
            return res.data;
        },
        logOut: async (data) => {
            // El logout sí suele requerir el token para limpiar la sesión en el server
            const res = await privateApi.post("/auth/logout", data);
            return res.data;
        },
    } 
    return authService;
}
