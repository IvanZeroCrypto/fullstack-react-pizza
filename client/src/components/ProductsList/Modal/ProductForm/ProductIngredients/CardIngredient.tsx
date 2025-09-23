import { useState } from "react";
import cn from "clsx";
import styles from "./CardIngredients.module.css";
import { TbCircleCheck } from "react-icons/tb";
import { IIngredient } from "../../../../../response/ProductResponse";

interface ICardIngredientProps {
  ingredient: IIngredient;
  addIngredient: (key: IIngredient) => void;
}

const CardIngredient = ({
  ingredient,
  addIngredient,
}: ICardIngredientProps) => {
  const [active, setActive] = useState<boolean>(false);

  const handleSelectIngredient = () => {
    setActive(!active);
    addIngredient(ingredient);
  };

  return (
    <div
      onClick={handleSelectIngredient}
      className={cn(
        " text-center  p-[6px]  rounded-xl  flex flex-col justify-between cursor-pointer relative  ",
        styles.customShadow,
        active && "border border-orange-500"
      )}
    >
      {active && (
        <div className="absolute top-1 right-1 text-orange-500">
          <TbCircleCheck />
        </div>
      )}

      <div>
        <img className="w-[88px] " src={ingredient.image} alt="img" />
        <h3 className="text-xs mt-1 mb-2">{ingredient.name}</h3>
      </div>
      <span className="text-base font-normal">{ingredient.price} ₽</span>
    </div>
  );
};

export default CardIngredient;
