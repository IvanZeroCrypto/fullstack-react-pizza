import { create } from "zustand";
import AuthService from "../http/services/AuthService";
import { IDataCheckOutResponse, TUser } from "../types/User";
import axios, { AxiosResponse } from "axios";

interface IAuthStore {
  isAuth: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  user: TUser;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const useAuthStore = create<IAuthStore>((set) => ({
  isAuth: false,
  user: {} as TUser,
  isLoading: false,
  error: null,
  isAdmin: false,
  clearError: () => set({ error: "" }),
  register: async (email: string, password: string) => {
    set({ isLoading: true, error: "", isAuth: false });
    try {
      const response = await AuthService.register(email, password);
      localStorage.setItem("token", response.data.accessToken);
      set({
        isLoading: false,
        isAuth: true,
        user: response.data.user,
        isAdmin: response.data.user.role === "ADMIN" ? true : false,
      });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        set({ error: e?.message, isLoading: false });
      } else {
        set({ error: "Неизвестная ошибка", isLoading: false });
      }
    }
  },
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: "", isAuth: false });
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem("token", response.data.accessToken);
      set({
        isLoading: false,
        isAuth: true,
        user: response.data.user,
        isAdmin: response.data.user.role === "ADMIN" ? true : false,
        error: "",
      });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        set({ error: e?.message, isLoading: false });
      } else {
        set({ error: "Неизвестная ошибка", isLoading: false });
      }
    }
  },
  checkAuth: async () => {
    set({ isLoading: true, error: "", isAuth: false });
    try {
      const { data, status }: AxiosResponse<IDataCheckOutResponse> =
        await AuthService.checkAuth();

      if (data && status === 201) {
        localStorage.removeItem("token");
      }
      set({
        isLoading: false,
        isAuth: true,
        user: data.user,
        isAdmin: data.user.role === "ADMIN" ? true : false,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ error: error?.message, isLoading: false });
      } else {
        set({ error: "Неизвестная ошибка", isLoading: false });
      }
      set({
        isLoading: false,
        isAuth: false,
        user: {} as TUser,
      });
    }
  },
  logout: async () => {
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      set({
        isLoading: false,
        isAuth: false,
        user: {} as TUser,
        isAdmin: false,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ error: error?.message, isLoading: false });
      } else {
        set({ error: "Неизвестная ошибка", isLoading: false });
      }
      set({
        isLoading: false,
        isAuth: false,
        user: {} as TUser,
        isAdmin: false,
      });
    }
  },
}));
export default useAuthStore;
