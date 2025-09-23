import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CartService from "../../../../http/services/CartService";
import useCartStores from "../../../../store/cartStores";
import QuantityBtn from "./QuantityBtn";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";

jest.mock("../../../../store/cartStores");
const mockUseCartStores = useCartStores as unknown as jest.Mock;
jest.mock("../../../../http/services/CartService", () => ({
  __esModule: true,
  default: {
    changeProductQuantity: jest.fn(),
  },
}));
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("QuantityBtn", () => {
  const mockFetchBasket = jest.fn();
  const user = userEvent.setup();
  const mockId = "123";
  beforeEach(() => {
    mockUseCartStores.mockReturnValue({
      fetchBasket: mockFetchBasket,
      basketGoods: [],
      loading: false,
      totalPrice: 0,
      clearBasket: jest.fn(),
    });
    (
      CartService.changeProductQuantity as unknown as jest.Mock
    ).mockResolvedValue({
      status: 200,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Должен проверить рендерится ли компонент и рендер quantity", () => {
    render(<QuantityBtn id={mockId} quantity={2} className="className" />);
    expect(screen.getByTestId("quantity-btn")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("Должен проверить рендерится ли кнопки + и -", () => {
    render(<QuantityBtn id={mockId} quantity={2} className="className" />);
    const minusBtn = screen.getByTestId("minus");
    const plusBtn = screen.getByTestId("plus");
    expect(minusBtn).toBeInTheDocument();
    expect(plusBtn).toBeInTheDocument();
  });
  it("Должен проверить вызывается ли функция quantityFunc с методом = minus", async () => {
    render(<QuantityBtn id={mockId} quantity={2} className="className" />);
    const minusBtn = screen.getByTestId("minus");
    await user.click(minusBtn);
    await waitFor(() => {
      expect(CartService.changeProductQuantity).toHaveBeenCalledWith({
        productId: mockId,
        method: "minus",
      });
      expect(mockFetchBasket).toHaveBeenCalled();
    });
  });
  it("Должен проверить вызывается ли функция quantityFunc с методом = plus", async () => {
    render(<QuantityBtn id={mockId} quantity={2} className="className" />);
    const plusBtn = screen.getByTestId("plus");
    await user.click(plusBtn);
    await waitFor(() => {
      expect(CartService.changeProductQuantity).toHaveBeenCalledWith({
        productId: mockId,
        method: "plus",
      });
      expect(mockFetchBasket).toHaveBeenCalled();
    });
  });
  it("Должен проверить что у кнопки минус появляется disabled если quantity = 1", () => {
    render(<QuantityBtn id={mockId} quantity={1} className="className" />);
    const minusBtn = screen.getByTestId("minus");
    expect(minusBtn).toBeDisabled();
  });
  it("Должен проверить что кнопка минус не должна быть disabled если quantity > 1", () => {
    render(<QuantityBtn id={mockId} quantity={2} className="className" />);
    const minusBtn = screen.getByTestId("minus");
    expect(minusBtn).not.toBeDisabled();
  });
  it("Должен вызвать fetchBasket если status = 200", async () => {
    (
      CartService.changeProductQuantity as unknown as jest.Mock
    ).mockResolvedValue({
      status: 200,
    });
    render(<QuantityBtn id={mockId} quantity={2} className="className" />);
    const minusBtn = screen.getByTestId("minus");
    await user.click(minusBtn);
    await waitFor(() => {
      expect(mockFetchBasket).toHaveBeenCalled();
    });
  });
  it("Должен показать toast.error если ошибка сервера кликом на кнопку минус", async () => {
    const errorMessage = "Ошибка сервера";
    (
      CartService.changeProductQuantity as unknown as jest.Mock
    ).mockRejectedValue(new Error(errorMessage));
    render(<QuantityBtn id={mockId} quantity={2} className="className" />);
    const minusBtn = screen.getByTestId("minus");
    await user.click(minusBtn);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(mockFetchBasket).not.toHaveBeenCalled();
    });
  });
  it("Должен показать общую ошибку при неизвестном формате ошибки  кликом на кнопку минус ", async () => {
    (
      CartService.changeProductQuantity as unknown as jest.Mock
    ).mockRejectedValue("Unknown error");
    render(<QuantityBtn id={mockId} quantity={2} className="className" />);
    const minusBtn = screen.getByTestId("minus");
    await user.click(minusBtn);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Неизвестная ошибка");
      expect(mockFetchBasket).not.toHaveBeenCalled();
    });
  });
  it("Должен показать toast.error если ошибка сервера  кликом на кнопку плюс", async () => {
    const errorMessage = "Ошибка сервера";
    (
      CartService.changeProductQuantity as unknown as jest.Mock
    ).mockRejectedValue(new Error(errorMessage));
    render(<QuantityBtn id={mockId} quantity={2} className="className" />);
    const plusBtn = screen.getByTestId("plus");
    await user.click(plusBtn);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(mockFetchBasket).not.toHaveBeenCalled();
    });
  });
  it("Должен показать общую ошибку при неизвестном формате ошибки  кликом на кнопку плюс", async () => {
    (
      CartService.changeProductQuantity as unknown as jest.Mock
    ).mockRejectedValue("Unknown error");
    render(<QuantityBtn id={mockId} quantity={2} className="className" />);
    const plusBtn = screen.getByTestId("plus");
    await user.click(plusBtn);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Неизвестная ошибка");
      expect(mockFetchBasket).not.toHaveBeenCalled();
    });
  });
});
