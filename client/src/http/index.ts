import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { AuthResponse } from "../response/Authresponse";
import { redirect } from "react-router-dom";

declare module "axios" {
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
}


const API_URL = import.meta.env.MODE === 'production'
  ? "https://your-app.vercel.app/api"
  : "http://localhost:5000/api";

export const api: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<{ message?: string }>) => {
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    const originalRequest = error.config;

    if (
      error.response?.status == 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem("token", response.data.accessToken);
        return api.request(originalRequest);
      } catch (error) {
        redirect("/login");
      }
    }
    return Promise.reject(error);
  }
);
