import cn from "clsx";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import CartService from "../../../../http/services/CartService";
import useCartStores from "../../../../store/cartStores";
import toast from "react-hot-toast";
interface IQuantityBtnProps {
  id: string;
  className: string;
  quantity: number;
}

const QuantityBtn = ({ className, id, quantity }: IQuantityBtnProps) => {
  const { fetchBasket } = useCartStores();

  const quantityFunc = async (method: string) => {
    try {
      const data = await CartService.changeProductQuantity({
        productId: id,
        method: method,
      });
      if (data.status === 200) {
        await fetchBasket();
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
      data-testid="quantity-btn"
      className={cn("flex items-center gap-1", className)}
    >
      <button
        data-testid="minus"
        type="button"
        onClick={() => quantityFunc("minus")}
        disabled={quantity === 1}
        className="text-primary  disabled:text-gray-500  disabled:hover:scale-100 hover:scale-110 "
      >
        <CiCircleMinus size={25} />
      </button>
      <span className="text-[14px] font-medium">{quantity}</span>
      <button
        data-testid="plus"
        type="button"
        onClick={() => quantityFunc("plus")}
        className="text-primary hover:scale-110"
      >
        <CiCirclePlus size={25} />
      </button>
    </div>
  );
};

export default QuantityBtn;
