import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});


// 🔥 TOKEN GLOBAL (LO QUE PREGUNTASTE)
let accessToken = null;

export const setAccessTokenGlobal = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;


// 🔐 REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// 🔄 RESPONSE INTERCEPTOR (REFRESH)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          "http://localhost:3000/auth/refresh",
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