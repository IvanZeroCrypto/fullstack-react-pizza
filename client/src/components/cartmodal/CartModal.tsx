import CloseModalBtn from "../shared/closemodalbtn/CloseModalBtn";
import Cart from "./cart/Cart";
import { animated, useTransition, config } from "@react-spring/web";

interface ICartModalProps {
  activeCart: boolean;
  closeCart: () => void;
}

const CartModal = ({ activeCart, closeCart }: ICartModalProps) => {
  const transitions = useTransition(activeCart, {
    from: { opacity: 0, transform: "translateX(500px)" },
    enter: { opacity: 1, transform: "translateX(0px)" },
    leave: { opacity: 0, transform: "translateX(500px)" },
  });

  return (
    <>
      {transitions(
        (style, activeCart) =>
          activeCart && (
            <animated.div
              data-testid="overlay-modal"
              style={style}
              onClick={closeCart}
              className=" fixed top-0 left-0 right-0  h-full bg-[#000000c3] z-50 pointer-events-auto  "
            >
              <div
                data-testid="modal-stop"
                onClick={(e) => e.stopPropagation()}
                className="bg-white sm:w-[438px] w-full h-full absolute right-0 "
              >
                <Cart closeCart={closeCart} />
                <CloseModalBtn
                  className=" right-5 top-3   sm:top-1/2 sm:-translate-y-1/2 sm:-left-9 over:rotate-180  "
                  onClick={closeCart}
                />
              </div>
            </animated.div>
          )
      )}
    </>
  );
};

export default CartModal;
