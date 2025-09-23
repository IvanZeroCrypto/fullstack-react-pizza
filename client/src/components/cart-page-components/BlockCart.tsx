import { RiDeleteBin6Line } from "react-icons/ri";
import CartItem from "../cartmodal/cart/CartItem";
import WhiteBlock from "../shared/white-block/WhiteBlock";
import { useTransition, animated } from "@react-spring/web";
import useCartStores from "../../store/cartStores";
import CartService from "../../http/services/CartService";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
const BlockCart = () => {
  const { basketGoods, fetchBasket } = useCartStores();

  const resetCart = async () => {
    try {
      const data = await CartService.deleteCart();
      if (data.status === 200) {
        await fetchBasket();
        toast.success("Корзина очищена");
      }
    } catch (error) {
      alert(error);
    }
  };

  const transitions = useTransition(basketGoods, {
    from: { opacity: 0, transform: "translate3d(0,40px,0)" },
    enter: { opacity: 1, transform: "translate3d(0,0px,0)" },
    leave: { opacity: 0, transform: "translate3d(0,40px,0)" },
  });

  if (basketGoods.length === 0) {
    return <Navigate to="/" />;
  }

  return (
    <WhiteBlock
      title="1.Корзина"
      className="relative max-h-[430px]  overflow-auto "
    >
      <button
        onClick={resetCart}
        className="absolute right-10 top-6 flex items-center gap-1 text-gray-400"
      >
        <RiDeleteBin6Line />
        <span className="text-xs">Очистить корзину</span>
      </button>

      <div className="flex flex-col">
        {basketGoods.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </WhiteBlock>
  );
};

export default BlockCart;
