import axios from "axios";

const baseUrl = "/api";

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

let accessToken = null;

export const setAccessTokenGlobal = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;


api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          baseUrl,
          {},
          { withCredentials: true }
        );

        setAccessTokenGlobal(data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);

      } catch (err) {
        console.log("Sesión expirada");
      }
    }

    return Promise.reject(error);
  }
);