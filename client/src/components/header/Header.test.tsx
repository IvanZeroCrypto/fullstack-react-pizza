import { render, screen, waitFor } from "@testing-library/react";
import useAuthStore from "../../store/authStore";
import useCartStores from "../../store/cartStores";
import userEvent from "@testing-library/user-event";
import Header from "./Header";
import { MemoryRouter } from "react-router-dom";
import { TbRuler2Off } from "react-icons/tb";

jest.mock("../../store/authStore");
jest.mock("../../store/cartStores");

const mockUseAuthStore = useAuthStore as unknown as jest.Mock;
const mockUseCartStores = useCartStores as unknown as jest.Mock;

const mockConfirm = jest.fn();
const mockAlert = jest.fn();
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

describe("Header", () => {
  const mockLogout = jest.fn();
  const mockHandleLogout = jest.fn();
  const mockClearBasket = jest.fn();

  const user = userEvent.setup();

  beforeAll(() => {
    global.window = Object.create(window);
    Object.defineProperty(window, "confirm", {
      value: mockConfirm,
      writable: true,
    });
    Object.defineProperty(window, "alert", {
      value: mockAlert,
      writable: true,
    });
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockConfirm.mockReturnValue(true);
    mockUseAuthStore.mockReturnValue({
      isAuth: true,
      logout: mockLogout,
      isAdmin: false,
      isLoading: false,
    });
    mockUseCartStores.mockReturnValue({
      clearBasket: mockClearBasket,
    });
    mockLocalStorage.getItem.mockClear();
  });
  afterEach(() => {
    mockConfirm.mockReset();
    mockAlert.mockReset();
  });
  afterAll(() => {
    delete global.window.confirm;
    delete global.window.alert;
  });

  const renderHeader = () => {
    return render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  };
  it("Проверка что рендерится дочерний компонент Logo", () => {
    renderHeader();
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });
  it("Проверка что если isLoading = true пользователю покажется скелетон", () => {
    mockUseAuthStore.mockReturnValue({
      isAuth: false,
      logout: mockLogout,
      isAdmin: false,
      isLoading: true,
    });
    renderHeader();
    expect(screen.getByTestId("skeleton-btn-header")).toBeInTheDocument();
    expect(screen.queryByTestId("header")).not.toBeInTheDocument();
  });
  it("Проверка что если isLoading = false  скелетона нет а виден  header", () => {
    renderHeader();
    expect(screen.queryByTestId("skeleton-btn-header")).not.toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });
  it("Проверка что если isAdmin = true то будет видна пользователю кнопка ссылка и проверка что правильный атрибут href у этой кнопки", () => {
    mockUseAuthStore.mockReturnValue({
      isAuth: true,
      logout: mockLogout,
      isAdmin: true,
      isLoading: false,
    });
    renderHeader();

    const linkBtn = screen.getByRole("link", { name: /админ панель/i });
    expect(linkBtn).toBeInTheDocument();
    expect(linkBtn).toHaveAttribute("href", "/admin");
  });
  it("Проверка что если isAdmin = false то кнопка ссылки не будет видна пользователю ", () => {
    renderHeader();

    const linkBtn = screen.queryByRole("link", { name: /админ панель/i });
    expect(linkBtn).not.toBeInTheDocument();
  });
  it("Проверка что если isAuth = true и в localStorage есть токен то видна пользователю кнопка выйти  и что кнопка войти не видна ", async () => {
    mockLocalStorage.getItem.mockReturnValue("fake-token");
    renderHeader();

    const button = screen.getByText(/Выйти/i);
    const linkBtn = screen.queryByRole("link", { name: /Войти/i });

    expect(button).toBeInTheDocument();
    expect(linkBtn).not.toBeInTheDocument();
  });
  it("Проверка что если isAuth = false и в localStorage есть токен то  пользователю не видна кнопка выйти и что кнопка войти видна и что у этой кнопки правильный атрибут href ", () => {
    mockUseAuthStore.mockReturnValue({
      isAuth: false,
      logout: mockLogout,
      isAdmin: false,
      isLoading: false,
    });
    mockLocalStorage.getItem.mockReturnValue("fake-token");
    renderHeader();

    const button = screen.queryByText(/Выйти/i);
    const linkBtn = screen.getByRole("link", { name: /Войти/i });
    expect(button).not.toBeInTheDocument();
    expect(linkBtn).toBeInTheDocument();
    expect(linkBtn).toHaveAttribute("href", "/login");
  });
  it("Проверка что если isAuth = true и в localStorage нет токена  то  пользователю не видна кнопка выйти  и что кнопка войти видна", () => {
    mockLocalStorage.getItem.mockReturnValue("");
    renderHeader();

    const button = screen.queryByText(/Выйти/i);
    const linkBtn = screen.getByRole("link", { name: /Войти/i });
    expect(button).not.toBeInTheDocument();
    expect(linkBtn).toBeInTheDocument();
  });
  it("Проверка что если isAuth = false и в localStorage нет токена  то  пользователю не видна кнопка выйти  и что кнопка войти видна", () => {
    mockUseAuthStore.mockReturnValue({
      isAuth: false,
      logout: mockLogout,
      isAdmin: false,
      isLoading: false,
    });
    mockLocalStorage.getItem.mockReturnValue("");
    renderHeader();

    const button = screen.queryByText(/Выйти/i);
    const linkBtn = screen.getByRole("link", { name: /Войти/i });
    expect(button).not.toBeInTheDocument();
    expect(linkBtn).toBeInTheDocument();
  });
  it("Проверка что window.confirm вызывается с корректным текстом и вернет true  а так же проверка что вызвался logout ,clearBasket и что alert не сработал", async () => {
    mockLocalStorage.getItem.mockReturnValue("fake-token");
    renderHeader();

    const button = screen.getByText(/Выйти/i);
    await user.click(button);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledWith(
        "Вы действительно хотите выйти из системы"
      );
      expect(mockLogout).toHaveBeenCalled();
      expect(mockClearBasket).toHaveBeenCalled();
      expect(mockAlert).not.toHaveBeenCalled();
    });
  });
  it("Проверка что window.confirm вызывается с корректным текстом и вернет false  а так же проверка что alert показал ошибку ", async () => {
    const error = new Error("Logout failed");
    const mockLogoutFunc = jest.fn().mockRejectedValue(error);
    mockLocalStorage.getItem.mockReturnValue("fake-token");
    mockConfirm.mockReturnValue(true);
    mockUseAuthStore.mockReturnValue({
      isAuth: true,
      logout: mockLogoutFunc,
      isAdmin: false,
      isLoading: false,
    });
    renderHeader();

    const button = screen.getByText(/Выйти/i);
    await user.click(button);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(error);
    });
  });
});
