import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import Button from "../../shared/button/Button";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useForm } from "react-hook-form";
import useAuthStore from "../../../store/authStore";
import useCartStores from "../../../store/cartStores";
import toast from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { login, error, clearError, isAuth, isLoading } = useAuthStore();
  const { fetchBasket } = useCartStores();

  useEffect(() => {
    clearError();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    mode: "onChange",
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
      const searchParams = new URLSearchParams(location.search);
      const from = searchParams.get("from") || "/";
      fetchBasket();
      navigate(from);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Неизвестная ошибка");
      }
    }
  };
  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex  justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        action=""
        className="absolute flex flex-col gap-1  top-1/2 -translate-y-1/2 w-[300px] "
      >
        <input
          {...register("email", {
            required: "Заполните поле",
            pattern: {
              value:
                /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/,
              message: "Невалидный email",
            },
          })}
          aria-invalid={errors.email ? "true" : "false"}
          type="email"
          placeholder="Email"
          className="rounded-xl border p-2"
        />
        {errors.email && (
          <p className="text-red-500" role="alert">
            {errors.email.message}
          </p>
        )}
        <div className="w-[300px] relative ">
          <input
            {...register("password", {
              required: "Заполните поле",
              minLength: {
                value: 6,
                message: "Минимум 6 символов",
              },
              maxLength: {
                value: 15,
                message: "Максимум 15 символов",
              },
            })}
            aria-invalid={errors.password ? "true" : "false"}
            type={showPassword ? "text" : "password"}
            placeholder="Пароль"
            className="rounded-xl border p-2 w-full"
          />
          {errors.password && (
            <p className="text-red-500" role="alert">
              {errors.password.message}
            </p>
          )}
          {error && <div className="text-red-500">{error}</div>}
          <div className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer ">
            {showPassword ? (
              <IoMdEyeOff onClick={() => setShowPassword(false)} size={20} />
            ) : (
              <IoMdEye onClick={() => setShowPassword(true)} size={20} />
            )}
          </div>
        </div>
        <div className="flex items-center text-[14px] my-1">
          <p>Нет аккаунта?</p>
          <Link to="/register" className="underline text-blue-500 ml-1">
            Регистрация
          </Link>
        </div>
        <Button type="submit" loading={isLoading}>
          Войти
        </Button>
      </form>
    </div>
  );
};

export default Login;
