import React from "react";
import Sidebar from "../sidebar/Sidebar";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../../header/Header";
import useAuthStore from "../../../store/authStore";

const AdminLayout = () => {
  const { isAdmin } = useAuthStore();
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <Header />
      <div className="">
        <Sidebar />
        <div className="">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
