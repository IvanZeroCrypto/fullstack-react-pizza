export type TUser = {
  id: string;
  email: string;
  isActivated: boolean;
  role: string;
};

export interface IDataCheckOutResponse {
  user: TUser;
}
