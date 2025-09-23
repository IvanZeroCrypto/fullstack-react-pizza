import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useCategoryStore from "../../store/categoryStore";
import useProductsStore from "../../store/productsStore";
import useStore from "../../store/store";
import Categories from "./Categories";
// jest.mock("react", () => ({
//   ...jest.requireActual("react"),
//   memo: (Component: any) => Component, // убираем memo для всех компонентов
// }));

jest.mock("../../store/categoryStore");
jest.mock("../../store/productsStore");
jest.mock("../../store/store");

const mockUseCategoryStore = useCategoryStore as unknown as jest.Mock;
const mockUseProductsStore = useProductsStore as unknown as jest.Mock;
const mockUseStore = useStore as unknown as jest.Mock;

jest.mock("@react-spring/web", () => ({
  useTrail: (length: number) =>
    Array(length).fill({
      opacity: 1,
      transform: "translateX(0px) ",
      from: { opacity: 0, transform: "translateX(-20px)" },
      delay: 200,
    }),
  animated: {
    a: jest
      .fn()
      .mockImplementation(({ children, ...props }) => (
        <a {...props}>{children}</a>
      )),
  },
}));
jest.mock("./CartBtnOpen", () => ({
  __esModule: true,
  default: function mockCartOpenBtn() {
    return <button data-testid="mock-cart-btn-open">Open</button>;
  },
}));
jest.mock("../skeletons/SkeletonItemCategory", () => ({
  __esModule: true,
  default: function mockSkeletonItemCategory() {
    return <button data-testid="mock-skeleton-item-category">Skeleton</button>;
  },
}));

describe("Categories", () => {
  const user = userEvent.setup();
  const mockCategoriesList = ["Пиццы", "Завтрак", "Напитки"];
  const mockOpenCart = jest.fn();

  const mockUpdateActiveId = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseProductsStore.mockReturnValue({
      categoriesList: mockCategoriesList,
      isLoading: false,
      productsList: [],
      getAllProducts: jest.fn(),
    });
    mockUseCategoryStore.mockReturnValue({
      loading: false,
      categories: [],
      getAllCategories: jest.fn(),
    });
  });
  it("Должен показывать скелетон если loading = true", () => {
    mockUseCategoryStore.mockReturnValue({
      loading: true,
      categories: [],
      getAllCategories: jest.fn(),
    });
    render(<Categories openCart={mockOpenCart} />);
    expect(screen.getAllByTestId("mock-skeleton-item-category")).toHaveLength(
      5
    );
  });
  it("Должен не показывать скелетон если loading = false", () => {
    mockUseCategoryStore.mockReturnValue({
      loading: false,
      categories: [],
      getAllCategories: jest.fn(),
    });
    render(<Categories openCart={mockOpenCart} />);
    expect(
      screen.queryByTestId("mock-skeleton-item-category")
    ).not.toBeInTheDocument();
  });
  it("Должен показывать корректно все категории из списка", () => {
    render(<Categories openCart={mockOpenCart} />);
    expect(screen.getByText("Пиццы")).toBeInTheDocument();
    expect(screen.getByText("Завтрак")).toBeInTheDocument();
    expect(screen.getByText("Напитки")).toBeInTheDocument();
  });
  it("Должен не показываться если нет категорий в списке", () => {
    mockUseProductsStore.mockReturnValue({
      categoriesList: [],
      isLoading: false,
      productsList: [],
      getAllProducts: jest.fn(),
    });
    render(<Categories openCart={mockOpenCart} />);
    expect(screen.queryByTestId("categories-list")).not.toBeInTheDocument();
  });
  it("Должен проверить рендерится ли дочерний компонент CartOpenBtn", () => {
    render(<Categories openCart={mockOpenCart} />);
    expect(screen.getByTestId("mock-cart-btn-open")).toBeInTheDocument();
  });
  it("Должен проверить у категорий правильный href атрибут", () => {
    render(<Categories openCart={mockOpenCart} />);

    const linkPizza = screen.getByRole("link", { name: "Пиццы" });
    const linkBreakFast = screen.getByRole("link", { name: "Завтрак" });
    const linkDrink = screen.getByRole("link", { name: "Напитки" });

    expect(linkPizza).toHaveAttribute("href", "/#Пиццы");
    expect(linkBreakFast).toHaveAttribute("href", "/#Завтрак");
    expect(linkDrink).toHaveAttribute("href", "/#Напитки");
  });
  it("Должен проверить что при клике на категорию updateActiveId вызывается с правильным индексом категории", async () => {
    mockUseStore.mockImplementation((selector) => {
      const state = {
        activeId: 0,
        updateActiveId: mockUpdateActiveId,
      };
      return selector ? selector(state) : state;
    });
    render(<Categories openCart={mockOpenCart} />);

    const linkPizza = screen.getByRole("link", { name: "Пиццы" });
    const linkBreakFast = screen.getByRole("link", { name: "Завтрак" });
    const linkDrink = screen.getByRole("link", { name: "Напитки" });

    await user.click(linkPizza);
    expect(mockUpdateActiveId).toHaveBeenCalledWith(0);

    await user.click(linkBreakFast);
    expect(mockUpdateActiveId).toHaveBeenCalledWith(1);

    await user.click(linkDrink);
    expect(mockUpdateActiveId).toHaveBeenCalledWith(2);

    expect(mockUpdateActiveId).toHaveBeenCalledTimes(3);
  });
  it("Должен проверить что при клике на категорию пиццы ей  присваивается класс text-primary", async () => {
    mockUseStore.mockImplementation((selector) => {
      const state = {
        activeId: 0,
        updateActiveId: mockUpdateActiveId,
      };
      return selector ? selector(state) : state;
    });
    render(<Categories openCart={mockOpenCart} />);

    const linkPizza = screen.getByRole("link", { name: "Пиццы" });
    const linkBreakFast = screen.getByRole("link", { name: "Завтрак" });
    const linkDrink = screen.getByRole("link", { name: "Напитки" });

    expect(linkPizza).toHaveClass("text-primary");
    expect(linkBreakFast).not.toHaveClass("text-primary");
    expect(linkDrink).not.toHaveClass("text-primary");
  });
  it("Должен проверить что при клике на категорию завтрак ей  присваивается класс text-primary", async () => {
    mockUseStore.mockImplementation((selector) => {
      const state = {
        activeId: 1,
        updateActiveId: mockUpdateActiveId,
      };
      return selector ? selector(state) : state;
    });
    render(<Categories openCart={mockOpenCart} />);

    const linkPizza = screen.getByRole("link", { name: "Пиццы" });
    const linkBreakFast = screen.getByRole("link", { name: "Завтрак" });
    const linkDrink = screen.getByRole("link", { name: "Напитки" });

    await user.click(linkBreakFast);

    expect(linkBreakFast).toHaveClass("text-primary");
    expect(linkPizza).not.toHaveClass("text-primary");
    expect(linkDrink).not.toHaveClass("text-primary");

    expect(mockUpdateActiveId).toHaveBeenCalledWith(1);
  });
  it("Должен проверить что при клике на категорию напитки ей  присваивается класс text-primary", async () => {
    mockUseStore.mockImplementation((selector) => {
      const state = {
        activeId: 2,
        updateActiveId: mockUpdateActiveId,
      };
      return selector ? selector(state) : state;
    });
    render(<Categories openCart={mockOpenCart} />);

    const linkPizza = screen.getByRole("link", { name: "Пиццы" });
    const linkBreakFast = screen.getByRole("link", { name: "Завтрак" });
    const linkDrink = screen.getByRole("link", { name: "Напитки" });


    await user.click(linkDrink);

    expect(linkDrink).toHaveClass("text-primary");
    expect(linkPizza).not.toHaveClass("text-primary");
    expect(linkBreakFast).not.toHaveClass("text-primary");

    expect(mockUpdateActiveId).toHaveBeenCalledWith(2);
  });
});
