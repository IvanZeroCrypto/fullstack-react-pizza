import { render, screen, waitFor } from "@testing-library/react";
import useAuthStore from "../../../store/authStore";
import { MemoryRouter, Navigate } from "react-router-dom";
import Register from "./Register";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";

jest.mock("../../../store/authStore");
const mockUseAuthStore = useAuthStore as unknown as jest.Mock;
const mockNavigate = Navigate as jest.MockedFunction<typeof Navigate>;
jest.mock("react-icons/io", () => ({
  IoMdEye: function MockIoMdEye(props: any) {
    return (
      <button
        data-testid={props["data-testid"] || "mock-eye"}
        onClick={props.onClick}
        data-size={props.size}
      >
        Eye Icon (Visible)
      </button>
    );
  },
  IoMdEyeOff: function MockIoMdEyeOff(props: any) {
    return (
      <button
        data-testid={props["data-testid"] || "mock-eye-off"}
        onClick={props.onClick}
        data-size={props.size}
      >
        Eye Off Icon (Hidden)
      </button>
    );
  },
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Navigate: jest.fn(({ to }) => `Redirected to ${to}`),
}));
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Register", () => {
  const user = userEvent.setup();
  const mockRegisterFn = jest.fn();
  const mockCleanError = jest.fn();
  const mockSetShowPassword = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuthStore.mockReturnValue({
      register: mockRegisterFn,
      error: "",
      clearError: mockCleanError,
      isAuth: false,
      isLoading: false,
    });
  });

  const renderRegister = () => {
    return render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
  };

  it("Должен проверить что при посещени страницы Register если isAuth = true должен быть редирект на главную страницу", () => {
    mockUseAuthStore.mockReturnValue({
      register: mockRegisterFn,
      error: "",
      clearError: mockCleanError,
      isAuth: true,
      isLoading: false,
    });
    renderRegister();
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/" }, {});
  });
  it("Должен проверить что при рендере компонента вызывается функция cleanError", () => {
    renderRegister();
    expect(mockCleanError).toHaveBeenCalledTimes(1);
  });
  it("Должен проверить что правильно обрабатывает ввод электронной почты", async () => {
    renderRegister();

    const inputEmail = screen.getByPlaceholderText("Email");
    await user.type(inputEmail, "test@mail.ru");
    expect(inputEmail).toHaveValue("test@mail.ru");
  });
  it("Должен выбросить ошибку ели email невалидный", async () => {
    renderRegister();

    const inputEmail = screen.getByPlaceholderText("Email");
    await user.type(inputEmail, "invalid-email");
    await user.tab();
    expect(await screen.findByText("Невалидный email")).toBeInTheDocument();
  });
  it("Должен проверить что пароль обработается и перелючение видимости пароля тоже работает", async () => {
    renderRegister();

    const inputPassword = screen.getByPlaceholderText("Пароль");
    const eyeBtn = screen.getByTestId("mock-eye");

    await user.type(inputPassword, "mypassword");

    expect(inputPassword).toHaveValue("mypassword");
    expect(inputPassword).toHaveAttribute("type", "password");

    await user.click(eyeBtn);
    expect(await screen.findByPlaceholderText("Пароль")).toHaveAttribute(
      "type",
      "text"
    );

    const eyeBtnOff = screen.getByTestId("mock-eye-off");
    await user.click(eyeBtnOff);
    expect(await screen.findByPlaceholderText("Пароль")).toHaveAttribute(
      "type",
      "password"
    );
  });
  it("Должен проверить что если пароль  меньше 6 символов то будет предуреждение Минимум 6 символов  ", async () => {
    renderRegister();

    const inputPassword = screen.getByPlaceholderText("Пароль");
    await user.type(inputPassword, "12345");

    expect(await screen.findByText("Минимум 6 символов")).toBeInTheDocument();
  });
  it("Должен проверить что если  пароль  больше 15 символов то будет предупреждение Максимум 15 символов  ", async () => {
    renderRegister();

    const inputPassword = screen.getByPlaceholderText("Пароль");
    await user.type(inputPassword, "12345678912345679786");

    expect(await screen.findByText("Максимум 15 символов")).toBeInTheDocument();
  });
  it("Должен проверить что если пароль неодинаковы то будет ошибка пароли не совпадают и переключение видимости пароля работет", async () => {
    renderRegister();

    await user.type(screen.getByPlaceholderText("Пароль"), "mypassword");
    await user.type(
      screen.getByPlaceholderText("Повторите пароль"),
      "mypassword123"
    );

    expect(await screen.findByText("Пароли не совпадают")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Повторите пароль")).toHaveAttribute(
      "type",
      "password"
    );

    const eyeIcons = screen.getByTestId("confirm-password-eye");
    await user.click(eyeIcons);

    expect(
      await screen.findByPlaceholderText("Повторите пароль")
    ).toHaveAttribute("type", "text");

    const eyeOffIcons = screen.getByTestId("confirm-password-eyeOff");
    await user.click(eyeOffIcons);

    expect(
      await screen.findByPlaceholderText("Повторите пароль")
    ).toHaveAttribute("type", "password");
  });
  it("Проверка что рендерится текст уже есть аккаунт и так же ссылка и ее правильный href атрибут", async () => {
    renderRegister();
    expect(screen.getByText(/Уже есть аккаунт?/i)).toBeInTheDocument();
    const linkElement = screen.getByRole("link", { name: /Войти/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/login");
  });
  it("Проверка что рендерится кнопка регистрация и если поля пустые то будет ошибка у кадого поля Заполните поле", async () => {
    renderRegister();

    const btnRegister = screen.getByRole("button", { name: /регистрация/i });
    expect(btnRegister).toBeInTheDocument();
    expect(btnRegister).toHaveAttribute("type", "submit");

    await user.click(btnRegister);

    expect(await screen.findAllByText("Заполните поле")).toHaveLength(3);
  });

  it("Проверка что функция register вызвовется с правильными данными", async () => {
    renderRegister();

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Пароль");
    const consfirmPasswordInput =
      screen.getByPlaceholderText("Повторите пароль");

    await user.type(emailInput, "test@mail.ru");
    await user.type(passwordInput, "1234567");
    await user.type(consfirmPasswordInput, "1234567");

    const btnRegister = screen.getByRole("button", { name: /регистрация/i });
    await user.click(btnRegister);

    await waitFor(() => {
      expect(mockRegisterFn).toHaveBeenCalledWith("test@mail.ru", "1234567");
    });
  });
  it("Проверка что функция register вызвовется с правильными данными но сервер все равно вернул ошибку и должен вызваться toast.error", async () => {
    const errorMessage = "Server error";
    mockUseAuthStore.mockReturnValue({
      register: mockRegisterFn.mockRejectedValue(new Error(errorMessage)),
      error: "",
      clearError: mockCleanError,
      isAuth: false,
      isLoading: false,
    });
    renderRegister();

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Пароль");
    const consfirmPasswordInput =
      screen.getByPlaceholderText("Повторите пароль");

    await user.type(emailInput, "test@mail.ru");
    await user.type(passwordInput, "1234567");
    await user.type(consfirmPasswordInput, "1234567");

    const btnRegister = screen.getByRole("button", { name: /регистрация/i });
    await user.click(btnRegister);

    await waitFor(() => {
      expect(mockRegisterFn).toHaveBeenCalledWith("test@mail.ru", "1234567");
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
  it("Проверка что функция register вызвовется с правильными данными но будет неизвестная ошибка и toast.error ее выведет", async () => {
    mockUseAuthStore.mockReturnValue({
      register: mockRegisterFn.mockRejectedValue("Unknown error"),
      error: "",
      clearError: mockCleanError,
      isAuth: false,
      isLoading: false,
    });
    renderRegister();

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Пароль");
    const consfirmPasswordInput =
      screen.getByPlaceholderText("Повторите пароль");

    await user.type(emailInput, "test@mail.ru");
    await user.type(passwordInput, "1234567");
    await user.type(consfirmPasswordInput, "1234567");

    const btnRegister = screen.getByRole("button", { name: /регистрация/i });
    await user.click(btnRegister);

    await waitFor(() => {
      expect(mockRegisterFn).toHaveBeenCalledWith("test@mail.ru", "1234567");
      expect(toast.error).toHaveBeenCalledWith("Неизвестная ошибка");
    });
  });
});
