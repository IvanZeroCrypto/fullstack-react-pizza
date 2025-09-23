import { AxiosResponse } from "axios";
import { AuthResponse } from "../../response/Authresponse";
import { api } from "..";
import { IDataCheckOutResponse, TUser } from "../../types/User";

export default class AuthService {
  static async register(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>("/register", { email, password });
  }
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>("/login", { email, password });
  }

  static async logout(): Promise<void> {
    return api.post("/logout");
  }
  static async checkAuth(): Promise<AxiosResponse<IDataCheckOutResponse>> {
    return api.get("/check-auth");
  }
}
