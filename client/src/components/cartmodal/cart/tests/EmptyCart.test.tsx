import { fireEvent, render, screen } from "@testing-library/react";
import EmptyCart from "../EmptyCart";

describe("EmptyCart", () => {
  const mockCloseCart = jest.fn();
  it("Проверка рендерится сам компонент", () => {
    render(<EmptyCart closeCart={mockCloseCart} />);
    expect(screen.getByTestId("empty-cart")).toBeInTheDocument();
  });
  it("Проверка рендерится ли текст корзина пуста", () => {
    render(<EmptyCart closeCart={mockCloseCart} />);
    expect(screen.getByText(/корзина пустая/i)).toBeInTheDocument();
  });
  it("Проверка рендерится ли текст  Добавьте хотя бы один товар, чтобы совершить заказ", () => {
    render(<EmptyCart closeCart={mockCloseCart} />);
    expect(
      screen.getByText(/добавьте хотя бы один товар, чтобы совершить заказ/i)
    ).toBeInTheDocument();
  });
  it("Проверка рендерится ли кнопка с текстом вернуться назад и корректный клик по ней", () => {
    render(<EmptyCart closeCart={mockCloseCart} />);
    const button = screen.getByRole("button", { name: /вернуться назад/i });
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
    expect(mockCloseCart).toHaveBeenCalledTimes(1);
  });
});
