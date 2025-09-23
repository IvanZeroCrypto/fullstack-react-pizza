import CardProduct from "./CardProduct/CardProduct";
import { IProduct } from "../../response/ProductResponse";
import React from "react";
import ScrollAnimate from "../scroll-animate/ScrollAnimate";

interface IProductsListProps {
  items: IProduct[];
  title: string;
}

const ProductsList = React.memo(({ items, title }: IProductsListProps) => {
  return (
    <div data-testid="products-list" id={title}>
      <ScrollAnimate type="slide-right">
        <h1 className="text-[36px] font-semibold my-8">
          {items.length !== 0 && title}
        </h1>
      </ScrollAnimate>

      <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6">
        {items.length !== 0 &&
          items.map((item) => <CardProduct key={item.name} item={item} />)}
      </div>
    </div>
  );
});

export default ProductsList;
