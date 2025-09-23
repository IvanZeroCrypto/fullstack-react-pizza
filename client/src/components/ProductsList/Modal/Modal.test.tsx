import { render, screen } from "@testing-library/react";
import { IProduct } from "../../../response/ProductResponse";
import Modal from "./Modal";
import React from "react";
import userEvent from "@testing-library/user-event";

jest.mock("./ProductImage/ProductImage", () => ({
  __esModule: true,
  default: function MockProductImage({ image, sizePizza }: any) {
    return <div data-testid="product-image-mock">ProductImage:{image}</div>;
  },
}));

jest.mock("./ProductForm/ProductFormPizza", () => ({
  __esModule: true,
  default: function MockProductFormPizza({
    item,
    setActiveModal,
    sizePizza,
    setSizePizza,
  }: any) {
    return (
      <div data-testid="pizza-form-mock">
        Pizza Form
        {sizePizza}
      </div>
    );
  },
}));
jest.mock("./ProductForm/ProductForm", () => ({
  __esModule: true,
  default: function MockProductForm({ item, setActiveModal }: any) {
    return <div data-testid="product-form-mock">MockProductForm</div>;
  },
}));
jest.mock("../../shared/closemodalbtn/CloseModalBtn", () => ({
  __esModule: true,
  default: function MockCloseModalBtn({ className, onClick }: any) {
    return (
      <button data-testid="close-btn-mock" onClick={onClick}>
        Close
      </button>
    );
  },
}));
jest.mock("react-icons/tfi", () => ({
  TfiArrowCircleDown: function MockTfiArrowCircleDown({
    size,
    color,
  }: {
    size: number;
    color: string;
  }) {
    return (
      <div data-testid="arrow-down-mock" data-size={size}>
        Arrow Down
      </div>
    );
  },
}));

jest.mock("@react-spring/web", () => ({
  useTransition: (activeModal: boolean) => {
    return (renderFn) => {
      if (activeModal) {
        return renderFn({ opacity: 1, transform: "scale(1)" }, true);
      }
      return null;
    };
  },
  animated: {
    div: ({ children, style, ...props }: any) => (
      <div {...props} style={style} data-testid="modal">
        {children}
      </div>
    ),
  },
}));
describe("Modal", () => {
  const mockSetActiveModal = jest.fn();
  const mockItem: IProduct = {
    id: 1,
    name: "Чизкейк",
    price: "100",
    categoryId: 0,
    description: "",
    image: "",
    portion: "",
    type: [],
    ingredients: [],
  };
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });
  const renderModal = () => {
    render(
      <Modal
        activeModal={true}
        setActiveModal={mockSetActiveModal}
        item={mockItem}
      />
    );
  };
  it("Должен проверить что компонент виден пользователю если activeModal = true", () => {
    renderModal();
    const modal = screen.getByTestId("modal");
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveClass("scale-100");
  });
  it("Должен проверить что при клике вне модального окна оно закроется", async () => {
    renderModal();
    const modal = screen.getByTestId("modal");

    await user.click(modal);

    expect(mockSetActiveModal).toHaveBeenCalledWith(false);
  });
  it("Должен проверить что компонент не виден пользователю если activeModal = false", () => {
    render(
      <Modal
        activeModal={false}
        setActiveModal={mockSetActiveModal}
        item={mockItem}
      />
    );
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });
  it("Должен проверить что компонент дочерний ProductImage рендерится", () => {
    renderModal();
    expect(screen.getByTestId("product-image-mock")).toBeInTheDocument();
  });
  it("Должен проверить что при клике на контент часть модальное окно не закрывается ", async () => {
    renderModal();
    const element = screen.getByTestId("content-modal");
    await user.click(element);
    expect(mockSetActiveModal).not.toHaveBeenCalled();
  });
  it("Должен проверить что если item это  пицца то модальное окно будет иметь корректные классы ", async () => {
    const mockItemPizza: IProduct = {
      id: 1,
      name: "pizza",
      price: "300",
      categoryId: 1,
      description: "pizza",
      image: "image.png",
      portion: "",
      type: ["Тонкое"],
      ingredients: [],
    };
    render(
      <Modal
        activeModal={true}
        setActiveModal={mockSetActiveModal}
        item={mockItemPizza}
      />
    );
    const element = screen.getByTestId("content-modal");

    expect(element).toHaveClass(
      "max-w-[534px] md:max-w-[924px] w-full  pt-6  md:justify-between "
    );
  });
  it("Должен проверить что если item это не пицца а простой продукт то модальное окно будет иметь корректные классы ", async () => {
    renderModal();
    const element = screen.getByTestId("content-modal");

    expect(element).toHaveClass(
      "max-w-[500px] w-full h-[60%] flex-col text-center mx-auto "
    );
  });
  it("Должен проверить что если item это  пицца то  рендерится ProductFormPizza", async () => {
    const mockItemPizza: IProduct = {
      id: 1,
      name: "pizza",
      price: "300",
      categoryId: 1,
      description: "pizza",
      image: "image.png",
      portion: "",
      type: ["Тонкое"],
      ingredients: [],
    };
    render(
      <Modal
        activeModal={true}
        setActiveModal={mockSetActiveModal}
        item={mockItemPizza}
      />
    );

    expect(screen.getByTestId("pizza-form-mock")).toBeInTheDocument();
    expect(screen.queryByTestId("product-form-mock")).not.toBeInTheDocument();
  });
  it("Должен проверить что если item это не  пицца то  рендерится ProductForm", async () => {
    renderModal();

    expect(screen.getByTestId("product-form-mock")).toBeInTheDocument();
    expect(screen.queryByTestId("pizza-form-mock")).not.toBeInTheDocument();
  });
  it("Должен проверить что рендерится CloseModalBtn и клик по ней закрывает модальное окно", async () => {
    renderModal();

    const btnCloseModal = screen.getByTestId("close-btn-mock");

    expect(btnCloseModal).toBeInTheDocument();

    await user.click(btnCloseModal);
    expect(mockSetActiveModal).toHaveBeenCalledWith(false);
  });
  it("Должен проверить что рендерится кнопка  закрыть модальное окно для маленьких экранов и клик по ней закрывает модальное окно", async () => {
    renderModal();

    const btnCloseModalmini = screen.getByTestId("btn-close-modal-mini");

    expect(btnCloseModalmini).toBeInTheDocument();
    expect(btnCloseModalmini).toHaveClass("lg:hidden absolute top-3 left-4");

    await user.click(btnCloseModalmini);
    expect(mockSetActiveModal).toHaveBeenCalledWith(false);
  });
});
