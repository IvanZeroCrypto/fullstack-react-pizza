import { FC, useState } from "react";
import SizeTypeButton from "./SizeTypeButton";
import { typePizzaList } from "../../../../../contans";
import ProductIngredients from "./ProductIngredients/ProductIngredients";
import Button from "../../../shared/button/Button";
import { useSet } from "react-use";
import { IIngredient, IProduct } from "../../../../response/ProductResponse";
import toast from "react-hot-toast";
import CartService from "../../../../http/services/CartService";
import useCartStores from "../../../../store/cartStores";
interface IProductFormProps {
  item: IProduct;
  setActiveModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSizePizza: React.Dispatch<React.SetStateAction<number>>;
  sizePizza: number;
}

const ProductFormPizza: FC<IProductFormProps> = ({
  item,
  setActiveModal,
  setSizePizza,
  sizePizza,
}) => {
  const [isLoading, setIsloading] = useState(false);
  const [selectIngredients, { toggle: addIngredient }] = useSet<IIngredient>(
    new Set([])
  );

  const [typePizza, setTypePizza] = useState(0);

  const { fetchBasket } = useCartStores();

  const nameIngredients = Array.from(selectIngredients).map(
    (item) => item.name
  );

  console.log(item, "item");
  const pricePizza =
    sizePizza === 25
      ? parseFloat(item.price)
      : sizePizza === 30
      ? parseFloat(item.price) + 110
      : parseFloat(item.price) + 270;

  const totalPricePizza =
    Array.from(selectIngredients).reduce((acc, ingredient) => {
      return acc + parseFloat(ingredient.price);
    }, 0) + pricePizza;

  const addCartPizza = async () => {
    try {
      const product = {
        productId: item.id,
        pricePizza: totalPricePizza,
        type: typePizzaList[typePizza],
        size: sizePizza,
        weight: sizePizza === 25 ? "410" : sizePizza === 30 ? "620" : "860",
        ingredients: nameIngredients ? nameIngredients : [""],
      };
      setIsloading(true);
      const addPizza = await CartService.addCart(product);

      if (addPizza.status === 200) {
        setIsloading(false);

        fetchBasket();
        toast.success(`Пицца ${item.name} добавлена в корзину`);
        setActiveModal(false);
      }
    } catch (error) {
      setIsloading(false);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Неизвестная ошибка");
      }
    }
  };

  return (
    <div className=" absolute bottom-0 md:w-[400px] md:pl-10 md:relative  flex flex-col z-50 mx-auto md:mx-0">
      <div className=" max-h-[490px] h-full  md:max-h-[520px] p-2 overflow-y-auto">
        <h1 className="text-[24px] font-medium">{item.name}</h1>

        <>
          <div className="flex text-textCartProduct gap-1 text-sm pb-1">
            <span>{sizePizza} см, </span>
            <span>{typePizzaList[typePizza]} тесто,</span>
            <span>
              {sizePizza === 25 ? "410" : sizePizza === 30 ? "620" : "860"} г
            </span>
          </div>
          <div className="text-sm mb-3 ">{item.description}</div>
          <SizeTypeButton
            typePizzaListItem={item?.type}
            setSizePizza={setSizePizza}
            sizePizza={sizePizza}
            setTypePizza={setTypePizza}
            typePizza={typePizza}
          />
          <ProductIngredients
            ingredients={item.ingredients}
            addIngredient={addIngredient}
          />
        </>
      </div>
      <Button
        loading={isLoading}
        onClick={addCartPizza}
        className="w-[327px] mt-4 text-base mx-auto font-medium mb-2"
      >
        В корзину за {totalPricePizza} ₽
      </Button>
    </div>
  );
};

export default ProductFormPizza;
