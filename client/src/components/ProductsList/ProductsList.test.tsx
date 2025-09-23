import { render, screen } from "@testing-library/react";
import ProductsList from "./ProductsList";
import { IProduct } from "../../response/ProductResponse";

describe("ProductsList", () => {
  const mockItems: IProduct[] = [
    {
      id: 1,
      name: "Чизкейк",
      price: "100",
      categoryId: 0,
      description: "",
      image: "",
      portion: "",
      type: [],
      ingredients: [],
    },
    {
      id: 2,
      name: "Бутерброд",
      price: "200",
      categoryId: 0,
      description: "",
      image: "",
      portion: "",
      type: [],
      ingredients: [],
    },
  ];
  it("Должен проверить что если массив продуктов не пустой будет показана cardProduct", () => {
    render(<ProductsList items={mockItems} title="Завтраки" />);
    expect(screen.getAllByTestId("card-product")).toHaveLength(2);
  });
  it("Должен проверить что если массив продуктов  пустой не будет показана cardProduct", () => {
    render(<ProductsList items={[]} title="Завтраки" />);
    expect(screen.queryAllByTestId("card-product")).toHaveLength(0);
  });
  it("Должен проверить что если массив продуктов не пустой  будет показан title и сами продукты рендерятся ли", () => {
    render(<ProductsList items={mockItems} title="Завтраки" />);
    expect(screen.getByText(/завтраки/i)).toBeInTheDocument();
    expect(screen.getByText("Чизкейк")).toBeInTheDocument();
    expect(screen.getByText("Бутерброд")).toBeInTheDocument();
  });
  it("Должен проверить что если массив продуктов  пустой  не будет показан title и сами продукты", () => {
    render(<ProductsList items={[]} title="Завтраки" />);
    expect(screen.queryByText(/завтраки/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Чизкейк")).not.toBeInTheDocument();
    expect(screen.queryByText("Бутерброд")).not.toBeInTheDocument();
  });
  it("Должен проверить что у div id равен title", () => {
    render(<ProductsList items={mockItems} title="Завтраки" />);
    expect(screen.getByTestId("products-list")).toHaveAttribute(
      "id",
      "Завтраки"
    );
  });
});
