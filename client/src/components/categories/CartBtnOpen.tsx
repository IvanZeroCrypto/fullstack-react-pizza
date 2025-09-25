import useAuthStore from "../../store/authStore";
import Button from "../shared/button/Button";
import { BsCart4 } from "react-icons/bs";
import SkeletonBtnHeader from "../skeletons/SkeletonBtnHeader";
import useCartStores from "../../store/cartStores";
interface ICartBtnOpenProps {
  openCart?: () => void;
}

const CartBtnOpen = ({ openCart }: ICartBtnOpenProps) => {
  const { basketGoods, totalPrice, loading } = useCartStores();
  const { isLoading } = useAuthStore();

  const lengthBasket = basketGoods
    ? basketGoods.reduce((acc, val) => acc + val.quantity, 0)
    : 0;

  return (
    <>
      {isLoading || loading ? (
        <SkeletonBtnHeader />
      ) : (
        <Button
          data-testid="cart-open-btn"
          onClick={openCart}
          className="border bg-primary text-white font-semibold flex items-center  gap-2 justify-between mx-auto mt-4 md:mt-0 md:mx-0"
        >
          <span>{lengthBasket || 0}</span>
          <span>|</span>
          <span>{totalPrice || 0} ₽</span>
          <BsCart4 />
        </Button>
      )}
    </>
  );
};

export default CartBtnOpen;
