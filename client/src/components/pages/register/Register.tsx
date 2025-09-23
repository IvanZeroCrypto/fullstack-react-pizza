import { useEffect, useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Button from "../../shared/button/Button";
import { Link, Navigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setConfirmShowPassword] =
    useState<boolean>(false);

  const {
    register: registration,
    error,
    clearError,
    isAuth,
    isLoading,
  } = useAuthStore();

  useEffect(() => {
    clearError();
  }, []);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ email: string; password: string; ConfirmPassword: string }>({
    mode: "onChange",
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await registration(data.email, data.password);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Неизвестная ошибка");
      }
    }
  };

  const password = watch("password");
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
          {" "}
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
          <div className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer ">
            {showPassword ? (
              <IoMdEyeOff onClick={() => setShowPassword(false)} size={20} />
            ) : (
              <IoMdEye onClick={() => setShowPassword(true)} size={20} />
            )}
          </div>
        </div>
        <div className="w-[300px] relative ">
          <input
            {...register("ConfirmPassword", {
              required: "Заполните поле",
              validate: (value) => value === password || "Пароли не совпадают",
            })}
            aria-invalid={errors.ConfirmPassword ? "true" : "false"}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Повторите пароль"
            className="rounded-xl border p-2 w-full"
          />
          <div className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer ">
            {showConfirmPassword ? (
              <IoMdEyeOff
                data-testid="confirm-password-eyeOff"
                onClick={() => setConfirmShowPassword(false)}
                size={20}
              />
            ) : (
              <IoMdEye
                data-testid="confirm-password-eye"
                onClick={() => setConfirmShowPassword(true)}
                size={20}
              />
            )}
          </div>
          {errors.ConfirmPassword && (
            <p className="text-red-500" role="alert">
              {errors.ConfirmPassword.message}
            </p>
          )}
          {error && <div className="text-red-500">{error}</div>}
        </div>
        <div className="flex items-center text-[14px] my-1">
          <p>Уже есть аккаунт?</p>
          <Link to="/login" className="underline text-blue-500 ml-1">
            Войти
          </Link>
        </div>
        <Button type="submit" loading={isLoading}>
          Регистрация
        </Button>
      </form>
    </div>
  );
};

export default Register;
