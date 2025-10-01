import { type FC, type ReactNode } from "react";

import { Navigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";

interface IProtectedRouteAuth {
  children: ReactNode;
}

const ProtectedRouteAuth: FC<IProtectedRouteAuth> = ({ children }) => {
  const { isAuth } = useAuthStore();

  if (!isAuth) {
    return <Navigate to="/register" />;
  }
  return children;
};

export default ProtectedRouteAuth;
