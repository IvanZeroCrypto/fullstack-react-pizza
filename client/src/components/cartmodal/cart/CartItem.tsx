import QuantityBtn from "./quantity-btn/QuantityBtn";
import DeleteBtn from "../../shared/delete-btn/DeleteBtn";
import CartService from "../../../http/services/CartService";
import toast from "react-hot-toast";
import { IItems } from "../../../response/CartResponse";
import useCartStores from "../../../store/cartStores";

interface ICartItemProps {
  item: IItems;
}

const CartItem = ({ item }: ICartItemProps) => {
  const { fetchBasket } = useCartStores();

  const removeProduct = async () => {
    try {
      const data = await CartService.deleteProductCart(item.id);
      if (data.status === 200) {
        toast.success("Продукт удален");
        fetchBasket();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Неизвестная ошибка");
      }
    }
  };
  return (
    <div
      data-testid="cart-item"
      className="bg-white w-full p-4 flex items-center "
    >
      <img
        className="w-[50px] h-[50px]"
        src={`${
          process.env.API_URL ? process.env.API_URL : "http://localhost:5000"
        }${item.image}`}
      />
      <div className="flex flex-col w-full  ml-5">
        <div className="flex items-center justify-between">
          <h2 className=" font-medium ">{item.name}</h2>

          <DeleteBtn onClick={removeProduct} className="hover:scale-110" />
        </div>

        {item.customization?.size && item.customization?.type && (
          <span
            data-testid="size-weight-type"
            className=" text-xs  text-textCartProduct mb-[2px] font-medium"
          >
            {item.customization?.size} см, {item.customization?.type} тесто ,
            {item.customization?.weight} г
          </span>
        )}
        {item.customization?.portion && (
          <span
            data-testid="portion"
            className=" text-xs  text-textCartProduct mb-[2px] font-medium"
          >
            {item.customization?.portion}
          </span>
        )}

        <div className="flex flex-wrap  text-xs gap-1 text-textCartProduct  ">
          {item.customization?.ingredients?.map((ingredient, index) => (
            <span key={index}> {ingredient}</span>
          ))}
        </div>
        <div className="flex items-center justify-between ">
          <QuantityBtn
            className="mt-4"
            id={item.id}
            quantity={item.quantity!}
          />
          <div className="font-medium">
            {item.price && item.price * item.quantity!} ₽
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
