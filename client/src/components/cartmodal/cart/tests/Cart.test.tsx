import { fireEvent, render, screen } from "@testing-library/react";
import Cart from "./Cart";
import useCartStores from "../../../store/cartStores";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

jest.mock("../../../store/cartStores", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Link: ({ to, children, ...rest }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

// jest.mock("@react-spring/web", () => ({
//   animated: jest.fn(({ children, ...props }) => (
//     <div {...props}>{children}</div>
//   )),
//   useTransition: jest.fn(
//     (items) => (fn: (arg0: {}, arg1: any) => any) =>
//       items.map((item: any) => fn({}, item))
//   ),
//   config: {},
// }));
const mockedUseCartStores = useCartStores as jest.MockedFunction<
  typeof useCartStores
>;

describe("Cart", () => {
  const mockCloseCart = jest.fn();
  const mockBasketGoods = [
    {
      id: "1",
      name: "pizza",
      price: 300,
    },
    {
      id: "2",
      name: "coffe",
      price: 100,
    },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
    (useCartStores as unknown as jest.Mock).mockImplementation(() => ({
      basketGoods: [],
      fetchBasket: jest.fn(),
      totalPrice: 0,
      loading: false,
    }));
  });

  it("Должен показывать скелетон если loading = true", () => {
    mockedUseCartStores.mockReturnValue({
      loading: true,
      basketGoods: [],
      fetchBasket: jest.fn(),
      totalPrice: 0,
    });
    render(
      <MemoryRouter>
        <Cart closeCart={mockCloseCart} />
      </MemoryRouter>
    );
    expect(screen.getByTestId("Skeleton-cart-modal")).toBeInTheDocument();
  });
  it("Должен проверить что при первом рендере функция fetchBasket вызывается ", () => {
    const mockFetchBasket = jest.fn();
    mockedUseCartStores.mockReturnValue({
      loading: false,
      basketGoods: [],
      fetchBasket: mockFetchBasket,
      totalPrice: 0,
    });
    render(
      <MemoryRouter>
        <Cart closeCart={mockCloseCart} />
      </MemoryRouter>
    );
    expect(mockFetchBasket).toHaveBeenCalledTimes(1);
  });
  it("Должен проверить что если длинна массива с продуктами больше 0 то компонент виден и отображается totalPrice корректный ", () => {
    mockedUseCartStores.mockReturnValue({
      loading: false,
      basketGoods: mockBasketGoods,
      fetchBasket: jest.fn(),
      totalPrice: 400,
    });
    render(
      <MemoryRouter>
        <Cart closeCart={mockCloseCart} />
      </MemoryRouter>
    );
    expect(mockBasketGoods.length).toBeGreaterThan(0);
    expect(screen.getByText("400 ₽")).toBeInTheDocument();
  });

  it("Должен проверить что рендерится CartItem ", () => {
    mockedUseCartStores.mockReturnValue({
      loading: false,
      basketGoods: mockBasketGoods,
      fetchBasket: jest.fn(),
      totalPrice: 400,
    });
    render(
      <MemoryRouter>
        <Cart closeCart={mockCloseCart} />
      </MemoryRouter>
    );
    expect(screen.getByTestId("cart-item")).toBeInTheDocument();
  });
  it("Должен проверить что рендерится коректная запись в корзине 2 продукта ", () => {
    mockedUseCartStores.mockReturnValue({
      loading: false,
      basketGoods: mockBasketGoods,
      fetchBasket: jest.fn(),
      totalPrice: 400,
    });
    render(
      <MemoryRouter>
        <Cart closeCart={mockCloseCart} />
      </MemoryRouter>
    );
    expect(screen.getByText(/В корзине 2 продукта/i)).toBeInTheDocument();
  });
  it("Должен проверить что если длинна массива с продуктами равна 0 то рендерится другой компонент EmptyCart пустая корзина  ", () => {
    const mockBasketGoods: string | any[] = [];
    mockedUseCartStores.mockReturnValue({
      loading: false,
      basketGoods: mockBasketGoods,
      fetchBasket: jest.fn(),
      totalPrice: 400,
    });
    render(
      <MemoryRouter>
        <Cart closeCart={mockCloseCart} />
      </MemoryRouter>
    );
    expect(mockBasketGoods.length).toBe(0);
    expect(screen.getByText(/корзина пустая/i)).toBeInTheDocument();
    expect(screen.queryByTestId("cart")).not.toBeInTheDocument();
  });
  it("Проверяем, что у ссылки правильный атрибут href и что кнопка рендерится", () => {
    mockedUseCartStores.mockReturnValue({
      loading: false,
      basketGoods: mockBasketGoods,
      fetchBasket: jest.fn(),
      totalPrice: 400,
    });
    render(
      <BrowserRouter>
        <Cart closeCart={mockCloseCart} />
      </BrowserRouter>
    );

    const orderButton = screen.getByRole("link", { name: /оформить заказ/i });
    expect(orderButton).toBeInTheDocument();
    expect(orderButton).toHaveAttribute("href", "/cart");
  });
  it("Проверяем, что при клике на кнопку оформить заказ выызвается функция closeCart", () => {
    mockedUseCartStores.mockReturnValue({
      loading: false,
      basketGoods: mockBasketGoods,
      fetchBasket: jest.fn(),
      totalPrice: 400,
    });
    render(
      <BrowserRouter>
        <Cart closeCart={mockCloseCart} />
      </BrowserRouter>
    );

    const orderButton = screen.getByRole("link", { name: /оформить заказ/i });
    fireEvent.click(orderButton);
    expect(mockCloseCart).toHaveBeenCalledTimes(1);
  });
});
