import { sizePizzaNumber } from "../../../../../contans";
import cn from "clsx";
interface ISizeTypeButtonProps {
  typePizzaListItem: string[];
  setSizePizza: React.Dispatch<React.SetStateAction<number>>;
  setTypePizza: React.Dispatch<React.SetStateAction<number>>;
  sizePizza: number;
  typePizza: number;
}

const SizeTypeButton = ({
  typePizzaListItem,
  setSizePizza,
  setTypePizza,
  sizePizza,
  typePizza,
}: ISizeTypeButtonProps) => {
  return (
    <>
      <div className="flex bg-[#f3f3f7] rounded-3xl p-[3px] h-8 text-xs mb-2">
        {sizePizzaNumber?.map((num) => (
          <button
            onClick={() => setSizePizza(num)}
            className={cn(
              "w-1/3 rounded-3xl   ",
              sizePizza === num && "bg-white shadow-md "
            )}
            key={num}
          >
            {num}см
          </button>
        ))}
      </div>
      <div className="flex bg-[#f3f3f7] rounded-3xl p-[3px] h-8 text-xs mb-2">
        {typePizzaListItem?.map((type, i) => (
          <button
            onClick={() => setTypePizza(i)}
            className={cn(
              " rounded-3xl ",
              typePizzaListItem.length === 2 ? "w-1/2" : "w-full",
              typePizza === i && "bg-white shadow-md"
            )}
            key={type}
          >
            {type}
          </button>
        ))}
      </div>
    </>
  );
};

export default SizeTypeButton;
