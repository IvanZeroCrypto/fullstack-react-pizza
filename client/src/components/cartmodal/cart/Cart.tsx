import { Link } from "react-router-dom";
import Button from "../../shared/button/Button";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";

import { useEffect } from "react";
import SkeletonCartModal from "../../skeletons/SkeletonCartModal";
import useCartStores from "../../../store/cartStores";

interface ICartProps {
  closeCart: () => void;
}

const Cart = ({ closeCart }: ICartProps) => {
  const { basketGoods, fetchBasket, totalPrice, loading } = useCartStores();

  useEffect(() => {
    fetchBasket();
  }, [fetchBasket]);

  return (
    <div className="w-full h-full bg-gray-100 ">
      <>
        {loading ? (
          <p className=" p-3  flex flex-col max-h-[70%]  gap-2 ">
            <SkeletonCartModal />
          </p>
        ) : basketGoods?.length ? (
          <div data-testid="cart">
            <h1 className="font-medium text-center text-lg py-2">
              В корзине {basketGoods.length} продукта
            </h1>
            <div
              data-testid="cart-item"
              className="flex flex-col max-h-[70%]  gap-2 overflow-y-auto"
            >
              {basketGoods.length > 0 &&
                basketGoods.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
            </div>
            <div className="bg-white p-6 absolute bottom-0 w-full">
              <div className=" flex items-center justify-between mb-3 pt-2 font-medium">
                <span>Итого:</span>
                <span className="">{totalPrice} ₽</span>
              </div>
              <Link to="/cart" onClick={closeCart}>
                <Button className="bg-orange-500 text-white font-bold w-full">
                  - Оформить заказ -
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <EmptyCart closeCart={closeCart} />
        )}
      </>
    </div>
  );
};

export default Cart;
