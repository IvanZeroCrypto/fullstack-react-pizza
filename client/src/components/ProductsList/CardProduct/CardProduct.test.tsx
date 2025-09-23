import { render, screen, waitFor } from "@testing-library/react";
import ProductService from "../../../http/services/ProductService";
import { IItems } from "../../../response/CartResponse";
import useAuthStore from "../../../store/authStore";
import useProductsStore from "../../../store/productsStore";
import { MemoryRouter } from "react-router-dom";
import CardProduct from "./CardProduct";
import { IProduct } from "../../../response/ProductResponse";
import { userEvent } from "@testing-library/user-event";
import toast from "react-hot-toast";

jest.mock("../../../store/authStore");
jest.mock("../../../store/productsStore");

const mockUseProductsStore = useProductsStore as unknown as jest.Mock;
const mockUseAuthStore = useAuthStore as unknown as jest.Mock;
const mockConfirm = jest.fn();

jest.mock("../Modal/Modal", () => {
  return function MockModal({ activeModal, setActiveModal }: any) {
    return activeModal ? (
      <div data-testid="test-modal">Mock Modal Content</div>
    ) : null;
  };
});

jest.mock("../../../http/services/ProductService", () => ({
  __esModule: true,
  default: {
    deleteProduct: jest.fn(),
  },
}));
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
const mockItem: IProduct = {
  id: 1,
  categoryId: 0,
  description: "description",
  image: "image.png",
  name: "pizza",
  portion: "100 г",
  price: "100",
  type: [],
  ingredients: [],
};

describe("cardproduct", () => {
  const mockGetAllProducts = jest.fn();
  const user = userEvent.setup();
  beforeEach(() => {
    jest.clearAllMocks();

    mockConfirm.mockReturnValue(true);
    mockUseProductsStore.mockReturnValue({
      getAllProducts: mockGetAllProducts,
    });
    mockUseAuthStore.mockReturnValue({
      isAdmin: true,
    });
    (ProductService.deleteProduct as jest.Mock).mockResolvedValue(undefined);
  });
  beforeAll(() => {
    global.window = Object.create(window);
    Object.defineProperty(window, "confirm", {
      value: mockConfirm,
      writable: true,
    });
  });
  const renderCardProduct = () => {
    return render(
      <MemoryRouter>
        <CardProduct item={mockItem} />
      </MemoryRouter>
    );
  };
  it("должен проверить что если isAdmin = true то кнопка удалить видна", () => {
    renderCardProduct();
    const btn = screen.getByTestId("btn-clear");
    expect(btn).toBeInTheDocument();
  });
  it("должен проверить что при клике на удалить должна вызваться функция deleteProduct с правильным id , проверить что confirm  вызвался с корректным текстом и вернуд true ,что вызвался toast.success и getAllProducts", async () => {
    renderCardProduct();
    const btn = screen.getByTestId("btn-clear");
    await user.click(btn);
    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledWith(
        "Вы действительно хотите удалить продукт???"
      );
      expect(ProductService.deleteProduct).toHaveBeenCalledWith(mockItem.id);
      expect(toast.success).toHaveBeenCalledWith("Продукт удален");
      expect(mockGetAllProducts).toHaveBeenCalled();
    });
  });
  it("должен проверить что confirm вернул false то не вызовется deleteProduct, toast.success и getAllProducts", async () => {
    mockConfirm.mockReturnValue(false);
    renderCardProduct();
    const btn = screen.getByTestId("btn-clear");
    await user.click(btn);

    expect(mockConfirm).toHaveBeenCalledWith(
      "Вы действительно хотите удалить продукт???"
    );
    expect(ProductService.deleteProduct).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(mockGetAllProducts).not.toHaveBeenCalled();
  });
  it("должен проверить что если isAdmin = false то кнопка удалить не видна", () => {
    mockUseAuthStore.mockReturnValue({
      isAdmin: false,
    });
    renderCardProduct();
    const btn = screen.queryByTestId("btn-clear");
    expect(btn).not.toBeInTheDocument();
  });
  it("должен проверить что если isAdmin = true то Link отображается с правильным href", () => {
    renderCardProduct();
    const btn = screen.getByTestId("link-btn-card-product");
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("href", `/admin/update-product/${mockItem.id}`);
  });
  it("должен проверить что если isAdmin = false то Link не отображается ", () => {
    mockUseAuthStore.mockReturnValue({
      isAdmin: false,
    });
    renderCardProduct();
    const btn = screen.queryByTestId("link-btn-card-product");
    expect(btn).not.toBeInTheDocument();
  });
  it("должен проверить что изображение корректно рендерится с коректным src и что клик на изображение откроет модальное окно ", async () => {
    renderCardProduct();
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute(
      "src",
      `http://localhost:5000${mockItem.image}`
    );
    await user.click(img);
    expect(screen.getByTestId("test-modal")).toBeInTheDocument();
  });
  it("должен проверить что отображается имя,описание и цена ", () => {
    renderCardProduct();
    expect(screen.getByText(/pizza/i)).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/от 100 ₽/i)).toBeInTheDocument();
  });
  it("должен проверить что кнопка с рендерится и клик по ней откроет модальное окно ", async () => {
    renderCardProduct();
    const btn = screen.getByRole("button", { name: /Добавить/i });
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(screen.getByTestId("test-modal")).toBeInTheDocument();
  });
  it("должен проверить что удаление прошло с ошибкой и должен показаться тостер в ошибкой ", async () => {
    const error = "Invalid server";
    (ProductService.deleteProduct as jest.Mock).mockRejectedValue(
      new Error(error)
    );
    renderCardProduct();
    const btn = screen.getByTestId("btn-clear");

    await user.click(btn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(error);
    });
  });
  it("должен проверить что удаление прошло с общей ошибкой неизвестности", async () => {
    (ProductService.deleteProduct as jest.Mock).mockRejectedValue(
      "Unknown error"
    );
    renderCardProduct();
    const btn = screen.getByTestId("btn-clear");

    await user.click(btn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Неизвестная ошибка");
    });
  });
});
