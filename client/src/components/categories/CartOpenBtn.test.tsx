import { render, screen } from "@testing-library/react";
import useAuthStore from "../../store/authStore";
import useCartStores from "../../store/cartStores";
import CartBtnOpen from "./CartBtnOpen";
import userEvent from "@testing-library/user-event";

jest.mock("../../store/authStore");
jest.mock("../../store/cartStores");

const mockUseAuthStore = useAuthStore as unknown as jest.Mock;
const mockUseCartStores = useCartStores as unknown as jest.Mock;
jest.mock("../skeletons/SkeletonBtnHeader", () => ({
  __esModule: true,
  default: function MockSkeletonbtnHeader() {
    return <div data-testid="mock-skeleton-btn-header">Skeleton</div>;
  },
}));
jest.mock("react-icons/bs", () => ({
  BsCart4: function MockBsCart4() {
    return <div data-testid="mock-bs-cart">bscart</div>;
  },
}));

const mockBasketGoods = [
  {
    id: "1",
    name: "pizza",
    price: 300,
  },
  {
    id: "2",
    name: "coffee",
    price: 100,
  },
];

describe("CartOpenBtn", () => {
  const mockOpenCart = jest.fn();
  const user = userEvent.setup();
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      isLoading: false,
    });
    mockUseCartStores.mockReturnValue({
      basketGoods: mockBasketGoods,
      totalPrice: 400,
      loading: false,
    });
  });
  it("Должен проверить рендерится ли скелетон если isLoading=true или loading = true", () => {
    mockUseAuthStore.mockReturnValue({
      isLoading: true,
    });
    mockUseCartStores.mockReturnValue({
      basketGoods: [],
      totalPrice: 0,
      loading: true,
    });
    render(<CartBtnOpen />);
    expect(screen.getByTestId("mock-skeleton-btn-header")).toBeInTheDocument();
  });
  it("Должен проверить рендерится ли скелетон если isLoading=false или loading = true", () => {
    mockUseAuthStore.mockReturnValue({
      isLoading: false,
    });
    mockUseCartStores.mockReturnValue({
      basketGoods: [],
      totalPrice: 0,
      loading: true,
    });
    render(<CartBtnOpen />);
    expect(screen.getByTestId("mock-skeleton-btn-header")).toBeInTheDocument();
  });
  it("Должен проверить рендерится ли скелетон если isLoading=true или loading = false", () => {
    mockUseAuthStore.mockReturnValue({
      isLoading: true,
    });
    mockUseCartStores.mockReturnValue({
      basketGoods: [],
      totalPrice: 0,
      loading: false,
    });
    render(<CartBtnOpen />);
    expect(screen.getByTestId("mock-skeleton-btn-header")).toBeInTheDocument();
  });
  it("Должен проверить что  скелетон невиден  если isLoading=false или loading = false", () => {
    mockUseAuthStore.mockReturnValue({
      isLoading: false,
    });
    mockUseCartStores.mockReturnValue({
      basketGoods: [],
      totalPrice: 0,
      loading: false,
    });
    render(<CartBtnOpen />);
    expect(
      screen.queryByTestId("mock-skeleton-btn-header")
    ).not.toBeInTheDocument();
  });
  it("Должен проверить что рендерится кнопка и что при клике на нее вызывается функция openCart", async () => {
    render(<CartBtnOpen openCart={mockOpenCart} />);

    const button = screen.getByTestId("cart-open-btn");
    await user.click(button);

    expect(button).toBeInTheDocument();
    expect(mockOpenCart).toHaveBeenCalled();
  });
  it("Должен проверить что если в basketGoods есть элементы то будет рендерится в кнопке текст длинна массива basketGoods и totalPrice всех элементов в basketGoods ", async () => {
    render(<CartBtnOpen openCart={mockOpenCart} />);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("|")).toBeInTheDocument();
    expect(screen.getByText("400 ₽")).toBeInTheDocument();
  });
  it("Должен проверить что если в basketGoods нет элементов то будет рендерится в кнопке текст 0 и totalPrice будет равен 0 ", async () => {
    mockUseCartStores.mockReturnValue({
      basketGoods: [],
      totalPrice: 0,
      loading: false,
    });
    render(<CartBtnOpen openCart={mockOpenCart} />);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("|")).toBeInTheDocument();
    expect(screen.getByText("0 ₽")).toBeInTheDocument();
  });
  it("Должен проверить что рендерится иконка корзины", async () => {
    render(<CartBtnOpen openCart={mockOpenCart} />);

    expect(screen.getByTestId("mock-bs-cart")).toBeInTheDocument();
  });
});
