import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { IItems } from "../../../../response/CartResponse";
import CartItem from "../CartItem";
import toast from "react-hot-toast";
import CartService from "../../../../http/services/CartService";
import useCartStores from "../../../../store/cartStores";
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../../../../http/services/CartService", () => ({
  __esModule: true,
  default: {
    deleteProductCart: jest.fn(),
  },
}));

jest.mock("../../../../store/cartStores");
const mockUseCartStores = useCartStores as jest.MockedFunction<
  typeof useCartStores
>;

const mockItem: IItems = {
  cartId: "1",
  id: "123",
  image: "image.png",
  name: "pizza",
  description: "pizza product",
  productId: "5",
  quantity: 2,
  price: 300,
  customization: {
    ingredients: ["сыр", "томаты"],
    size: 40,
    type: "Тонкое",
    weight: "600",
    portion: "100 г",
  },
};
describe("CartItem", () => {
  const mockFetchBasket = jest.fn();
  beforeEach(() => {
    mockUseCartStores.mockReturnValue({ fetchBasket: mockFetchBasket });
    (CartService.deleteProductCart as unknown as jest.Mock).mockResolvedValue({
      status: 200,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Проверка что рендрится сам компонент если есть item ", () => {
    render(<CartItem item={mockItem} />);
    expect(screen.getByTestId("cart-item")).toBeInTheDocument();
  });
  it("Проверка что рендрится ли img с корректным атрибутом ", () => {
    render(<CartItem item={mockItem} />);
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      `https://fullstack-react-pizza.onrender.com${mockItem.image}`
    );
    expect(image).toHaveClass("w-[50px] h-[50px]");
  });

  it("Проверка что рендрится корректное имя ", () => {
    render(<CartItem item={mockItem} />);
    expect(screen.getByText("pizza")).toBeInTheDocument();
  });
  it("Проверка что рендрится дочерний компонент DeleteBtn ", () => {
    render(<CartItem item={mockItem} />);
    expect(screen.getByTestId("delete-btn")).toBeInTheDocument();
  });
  it("Проверка что порция а так же размер,тип , вес  пиццы рендерится корректно ", () => {
    render(<CartItem item={mockItem} />);
    expect(screen.getByText(/40 см/i)).toBeInTheDocument();
    expect(screen.getByText(/Тонкое тесто/i)).toBeInTheDocument();
    expect(screen.getByText(/600 г/i)).toBeInTheDocument();
    expect(screen.getByText(/100 г/i)).toBeInTheDocument();
  });
  it("Проверка что размер,тип и вес пиццы рендерится корректно ", () => {
    const mockItem: IItems = {
      cartId: "1",
      id: "123",
      image: "image.png",
      name: "pizza",
      description: "pizza product",
      productId: "5",
      quantity: 2,
      price: 300,
      customization: {
        ingredients: ["", ""],
        size: 0,
        type: "",
        weight: "",
        portion: "",
      },
    };
    render(<CartItem item={mockItem} />);
    expect(screen.queryByTestId("size-weight-type")).not.toBeInTheDocument();
    expect(screen.queryByTestId("portion")).not.toBeInTheDocument();
  });
  it("Проверка что рендрится все ингредиенты ", () => {
    render(<CartItem item={mockItem} />);
    expect(screen.getByText(/сыр/i)).toBeInTheDocument();
    expect(screen.getByText(/томаты/i)).toBeInTheDocument();
  });
  it("Проверка что рендрится компонент QuantityBtn ", () => {
    render(<CartItem item={mockItem} />);
    expect(screen.getByTestId("quantity-btn")).toBeInTheDocument();
  });
  it("Проверка что цена товара корректная", () => {
    render(<CartItem item={mockItem} />);
    expect(screen.getByText("600 ₽")).toBeInTheDocument();
  });
  it("должен успешно удалять продукт и показывать toast.success", async () => {
    (CartService.deleteProductCart as jest.Mock).mockResolvedValue({
      status: 200,
    });
    render(<CartItem item={mockItem} />);

    const deleteBtn = screen.getByTestId("delete-btn");
    await fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(CartService.deleteProductCart).toHaveBeenCalledWith(mockItem.id);
      expect(toast.success).toHaveBeenCalledWith("Продукт удален");
      expect(mockFetchBasket).toHaveBeenCalled();
    });
  });
  it("должен вывести ошибку при удалении и показать toast.error", async () => {
    const errorMessage = "Ошибка сервера";

    (CartService.deleteProductCart as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    render(<CartItem item={mockItem} />);

    const deleteBtn = screen.getByTestId("delete-btn");
    fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(CartService.deleteProductCart).toHaveBeenCalledWith(mockItem.id);
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(mockFetchBasket).not.toHaveBeenCalled();
    });
  });
  it("должен показать общую ошибку при неизвестном формате ошибки", async () => {
    (CartService.deleteProductCart as jest.Mock).mockRejectedValue(
      "Unknown error"
    );

    render(<CartItem item={mockItem} />);

    const deleteBtn = screen.getByTestId("delete-btn");
    fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Неизвестная ошибка");
    });
  });
});
