import { createBrowserRouter, RouterProvider } from "react-router-dom";
import useAuthStore from "./store/authStore";
import { useEffect } from "react";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/admin-layout/AdminLayout";

import React from "react";
import LazyLoad from "./components/shared/lazy-load/LazyLoad";
import Home from "./components/pages/home/Home";

const Register = React.lazy(
  () => import("./components/pages/register/Register")
);
const Login = React.lazy(() => import("./components/pages/login/Login"));
const CartPage = React.lazy(
  () => import("./components/pages/cart-page/CartPage")
);
const CreateCategory = React.lazy(
  () => import("./components/admin/create-category/CreateCategory")
);
const CreateProduct = React.lazy(
  () => import("./components/admin/create-product/CreateProduct")
);
const UpdateProduct = React.lazy(
  () => import("./components/admin/create-product/UpdateProduct")
);

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      checkAuth();
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        {
          path: "cart",
          element: (
            <LazyLoad>
              <CartPage />
            </LazyLoad>
          ),
        },
        {
          path: "register",
          element: (
            <LazyLoad>
              <Register />
            </LazyLoad>
          ),
        },
        {
          path: "login",
          element: (
            <LazyLoad>
              <Login />
            </LazyLoad>
          ),
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          path: "create-category",
          element: (
            <LazyLoad>
              <CreateCategory />
            </LazyLoad>
          ),
        },
        {
          path: "create-product",
          element: (
            <LazyLoad>
              <CreateProduct />
            </LazyLoad>
          ),
        },
        {
          path: "update-product/:id",
          element: (
            <LazyLoad>
              <UpdateProduct />
            </LazyLoad>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
