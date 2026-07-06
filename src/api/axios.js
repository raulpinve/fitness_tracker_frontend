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