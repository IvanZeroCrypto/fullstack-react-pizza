import { TUser } from "../types/User";

export interface AuthResponse {
  accessToken: string;
  user: TUser;
  message: string;
}
