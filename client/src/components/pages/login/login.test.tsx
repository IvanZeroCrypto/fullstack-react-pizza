import { render, screen, waitFor } from "@testing-library/react";
import useAuthStore from "../../../store/authStore";
import { MemoryRouter, Navigate } from "react-router-dom";
import Login from "./Login";
import useCartStores from "../../../store/cartStores";
import userEvent from "@testing-library/user-event";
import { undefined } from "zod";
import toast from "react-hot-toast";

jest.mock("../../../store/authStore");
jest.mock("../../../store/cartStores");
const mockUseAuthStore = useAuthStore as unknown as jest.Mock;
const mockUseCartStore = useCartStores as unknown as jest.Mock;
const mockNavigate = Navigate as jest.MockedFunction<typeof Navigate>;
const mockNavigation = jest.fn();
const mockUseLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Navigate: jest.fn(({ to }) => `Redirected to ${to}`),
  useNavigate: () => mockNavigation,
  useLocation: () => mockUseLocation(),
}));
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
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
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
describe("Login", () => {
  const mockLoginFn = jest.fn();
  const mockCleanError = jest.fn();
  const mockFetchBasket = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuthStore.mockReturnValue({
      login: mockLoginFn,
      error: "",
      clearError: mockCleanError,
      isAuth: false,
      isLoading: false,
    });
    mockUseCartStore.mockReturnValue({
      fetchBasket: mockFetchBasket,
    });
  });

  const renderLogin = () => {
    return render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  };
  it("Должен проверить что при посещени страницы Login если isAuth = true должен быть редирект на главную страницу", () => {
    mockUseAuthStore.mockReturnValue({
      login: mockLoginFn,
      error: "",
      clearError: mockCleanError,
      isAuth: true,
      isLoading: false,
    });
    renderLogin();
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/" }, {});
  });
  it("Должен проверить что правильно обрабатывает ввод электронной почты", async () => {
    renderLogin();

    const inputEmail = screen.getByPlaceholderText("Email");
    await user.type(inputEmail, "test@mail.ru");
    expect(inputEmail).toHaveValue("test@mail.ru");
  });
  it("Должен выбросить ошибку ели email невалидный", async () => {
    renderLogin();

    const inputEmail = screen.getByPlaceholderText("Email");
    await user.type(inputEmail, "invalid-email");
    await user.tab();
    expect(await screen.findByText("Невалидный email")).toBeInTheDocument();
  });
  it("Должен проверить что пароль обработается и перелючение видимости пароля тоже работает", async () => {
    renderLogin();
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
    renderLogin();
    const inputPassword = screen.getByPlaceholderText("Пароль");
    await user.type(inputPassword, "12345");
    expect(await screen.findByText("Минимум 6 символов")).toBeInTheDocument();
  });
  it("Должен проверить что если  пароль  больше 15 символов то будет предупреждение Максимум 15 символов  ", async () => {
    renderLogin();
    const inputPassword = screen.getByPlaceholderText("Пароль");
    await user.type(inputPassword, "12345678912345679786");
    expect(await screen.findByText("Максимум 15 символов")).toBeInTheDocument();
  });
  it("Проверка что рендерится текст Нет аккаунта и так же ссылка и ее правильный href атрибут", async () => {
    renderLogin();
    expect(screen.getByText(/Нет аккаунта?/i)).toBeInTheDocument();
    const linkElement = screen.getByRole("link", { name: /Регистрация/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/register");
  });
  it("Проверка что рендерится кнопка войти и если поля пустые то будет ошибка у кадого поля Заполните поле", async () => {
    renderLogin();

    const btnLogin = screen.getByRole("button", { name: /войти/i });
    expect(btnLogin).toBeInTheDocument();
    expect(btnLogin).toHaveAttribute("type", "submit");

    await user.click(btnLogin);

    expect(await screen.findAllByText("Заполните поле")).toHaveLength(2);
  });
  it("Проверка что функция login вызвовется с правильными данными", async () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Пароль");

    await user.type(emailInput, "test@mail.ru");
    await user.type(passwordInput, "1234567");

    const btnLogin = screen.getByRole("button", { name: /войти/i });
    await user.click(btnLogin);

    await waitFor(() => {
      expect(mockLoginFn).toHaveBeenCalledWith("test@mail.ru", "1234567");
    });
  });
  it("Должен выполнить редирект на URL из параметра  from", async () => {
    mockUseLocation.mockReturnValue({
      search: "?from=/protected-page",
    });
    mockUseAuthStore.mockReturnValue({
      login: mockLoginFn.mockResolvedValue(undefined),
      error: "",
      clearError: mockCleanError,
      isAuth: false,
      isLoading: false,
    });
    renderLogin();
    await user.type(screen.getByPlaceholderText("Email"), "test@mail.ru");
    await user.type(screen.getByPlaceholderText("Пароль"), "password123");
    await user.click(screen.getByRole("button", { name: /войти/i }));
    await waitFor(() => {
      expect(mockNavigation).toHaveBeenCalledWith("/protected-page");
      expect(mockFetchBasket).toHaveBeenCalled();
    });
  });
  it("Должен выполнить редирект на  /  при некорректном параметре from", async () => {
    mockUseLocation.mockReturnValue({
      search: "",
    });
    mockUseAuthStore.mockReturnValue({
      login: mockLoginFn.mockResolvedValue(undefined),
      error: "",
      clearError: mockCleanError,
      isAuth: false,
      isLoading: false,
    });
    renderLogin();
    await user.type(screen.getByPlaceholderText("Email"), "test@mail.ru");
    await user.type(screen.getByPlaceholderText("Пароль"), "password123");
    await user.click(screen.getByRole("button", { name: /войти/i }));
    await waitFor(() => {
      expect(mockNavigation).toHaveBeenCalledWith("/");
    });
  });
  it("Должен выполнить редирект на / при некорректном параметре from", async () => {
    mockUseLocation.mockReturnValue({
      search: "?from=",
    });
    mockUseAuthStore.mockReturnValue({
      login: mockLoginFn.mockResolvedValue(undefined),
      error: "",
      clearError: mockCleanError,
      isAuth: false,
      isLoading: false,
    });
    renderLogin();
    await user.type(screen.getByPlaceholderText("Email"), "test@mail.ru");
    await user.type(screen.getByPlaceholderText("Пароль"), "password123");
    await user.click(screen.getByRole("button", { name: /войти/i }));
    await waitFor(() => {
      expect(mockNavigation).toHaveBeenCalledWith("/");
    });
  });
  it("Проверка что функция login вызвовется с правильными данными но сервер все равно вернул ошибку и должен вызваться toast.error", async () => {
    const errorMessage = "Server error";
    mockUseAuthStore.mockReturnValue({
      login: mockLoginFn.mockRejectedValue(new Error(errorMessage)),
      error: "",
      clearError: mockCleanError,
      isAuth: false,
      isLoading: false,
    });
    renderLogin();

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Пароль");

    await user.type(emailInput, "test@mail.ru");
    await user.type(passwordInput, "1234567");

    const btnLogin = screen.getByRole("button", { name: /войти/i });
    await user.click(btnLogin);

    await waitFor(() => {
      expect(mockLoginFn).toHaveBeenCalledWith("test@mail.ru", "1234567");
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
  it("Проверка что функция register вызвовется с правильными данными но будет неизвестная ошибка и toast.error ее выведет", async () => {
    mockUseAuthStore.mockReturnValue({
      login: mockLoginFn.mockRejectedValue("Unknown error"),
      error: "",
      clearError: mockCleanError,
      isAuth: false,
      isLoading: false,
    });
    renderLogin();
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Пароль");

    await user.type(emailInput, "test@mail.ru");
    await user.type(passwordInput, "1234567");

    const btnLogin = screen.getByRole("button", { name: /войти/i });
    await user.click(btnLogin);

    await waitFor(() => {
      expect(mockLoginFn).toHaveBeenCalledWith("test@mail.ru", "1234567");
      expect(toast.error).toHaveBeenCalledWith("Неизвестная ошибка");
    });
  });
});
