import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/useAuth';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export const useAxiosInterceptor = () => {
  const { accessToken, setAccessToken, logout } = useAuth();

  useEffect(() => {
    // 1. Interceptor de Petición
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization'] && accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. Interceptor de Respuesta (Refresh Logic)
    const responseIntercept = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          try {
            // Llamada al refresh
            const response = await axios.post('http://localhost:3000/auth/refresh', {}, { withCredentials: true });
            const newAccessToken = response.data.accessToken;

            setAccessToken(newAccessToken); // Actualizamos el Contexto
            
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return api(prevRequest); // Reintentamos la petición original
          } catch (refreshError) {
            logout(); // Si falla el refresh, cerramos sesión
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    // Limpieza de interceptores al desmontar
    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, setAccessToken, logout]);

  return api;
};