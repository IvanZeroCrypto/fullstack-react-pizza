import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CloseModalBtn from "../shared/closemodalbtn/CloseModalBtn";
import Cart from "./cart/Cart";

import CartModal from "./CartModal";

jest.mock("@react-spring/web", () => ({
  animated: {
    div: jest.fn(({ children, style, ...props }) => (
      <div style={style} {...props}>
        {children}
      </div>
    )),
  },
  useTransition: jest.fn(
    (activeCart) =>
      (
        renderFn: (
          arg0: { opacity: number; transform: string },
          arg1: any
        ) => any
      ) => {
        if (activeCart) {
          return renderFn(
            { opacity: 1, transform: "translateX(0px)" },
            activeCart
          );
        }
        return null;
      }
  ),
  config: {
    default: {},
  },
}));

jest.mock("./cart/Cart", () => ({
  __esModule: true,
  default: ({ closeCart }: { closeCart: () => void }) => (
    <div data-testid="cart-component">Cart</div>
  ),
}));
jest.mock("../shared/closemodalbtn/CloseModalBtn", () => ({
  __esModule: true,
  default: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} data-testid="close-button">
      Close
    </button>
  ),
}));
describe("CartModal", () => {
  const mockCloseCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Компонент рендерится", () => {
    render(<CartModal activeCart={true} closeCart={mockCloseCart} />);
    expect(screen.getByTestId("overlay-modal")).toBeInTheDocument();
  });
  it("Компонент не рендерится при условии  activeCart={false}", () => {
    render(<CartModal activeCart={false} closeCart={mockCloseCart} />);
    expect(screen.queryByTestId("overlay-modal")).not.toBeInTheDocument();
  });
  it("Компонент не виден если был клик closeCart", () => {
    render(<CartModal activeCart={true} closeCart={mockCloseCart} />);
    const element = screen.getByTestId("overlay-modal");
    fireEvent.click(element);
    expect(mockCloseCart).toHaveBeenCalledTimes(1);
  });
  it("Проверка что когда делается клик на внутренний контент модалки то она не закрывается", () => {
    render(<CartModal activeCart={true} closeCart={mockCloseCart} />);
    const element = screen.getByTestId("modal-stop");
    fireEvent.click(element);
    expect(mockCloseCart).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId("overlay-modal")).toBeInTheDocument();
  });
  it("Проверка что рендерятся с корректными пропсами дочерние компоненты", () => {
    render(<CartModal activeCart={true} closeCart={mockCloseCart} />);
    expect(screen.getByTestId("cart-component")).toBeInTheDocument();
    expect(screen.getByTestId("close-button")).toBeInTheDocument();
  });
});
