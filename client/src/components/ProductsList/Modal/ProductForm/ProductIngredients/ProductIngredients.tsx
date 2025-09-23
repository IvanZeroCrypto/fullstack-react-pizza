import CardIngredient from "./CardIngredient";

import { IIngredient } from "../../../../../response/ProductResponse";
import { FC } from "react";

interface IProductIngredientsProps {
  ingredients: IIngredient[];
  addIngredient: (key: IIngredient) => void;
}

const ProductIngredients: FC<IProductIngredientsProps> = ({
  ingredients,
  addIngredient,
}) => {
  return (
    <div className="mt-[14px] mb-6">
      <h1 className="text-xl font-semibold mb-3">Добавить по вкусу</h1>
      <div className="grid grid-cols-3 gap-2">
        {ingredients?.map((ingredient) => (
          <CardIngredient
            key={ingredient.id}
            ingredient={ingredient}
            addIngredient={addIngredient}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductIngredients;
