import { TfiArrowCircleDown } from "react-icons/tfi";
import cn from "clsx";
import { FC, useState } from "react";
import ProductFormPizza from "./ProductForm/ProductFormPizza";
import ProductForm from "./ProductForm/ProductForm";
import CloseModalBtn from "../../shared/closemodalbtn/CloseModalBtn";
import { animated, useTransition } from "@react-spring/web";
import { IProduct } from "../../../response/ProductResponse";
import React from "react";
import ProductImage from "./ProductImage/ProductImage";

interface IModalProps {
  item: IProduct;
  activeModal: boolean;
  setActiveModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: FC<IModalProps> = React.memo(
  ({ item, setActiveModal, activeModal }) => {
    const [sizePizza, setSizePizza] = useState(25);

    // const pizza = item.type && item;

    const transitions = useTransition(activeModal, {
      from: { opacity: 0, transform: "scale(0.3)" },
      enter: { opacity: 1, transform: "scale(1)" },
      leave: { opacity: 0, transform: "scale(0.3)" },
    });
    return (
      <>
        {transitions(
          (style, open) =>
            open && (
              <animated.div
                data-testid="modal"
                style={style}
                onClick={() => setActiveModal(false)}
                className={cn(
                  " fixed top-0 left-0 right-0   h-full bg-[#000000c3] z-50 flex justify-center items-center  pointer-events-auto",
                  activeModal ? " scale-100" : "scale-0"
                )}
              >
                <div
                  data-testid="content-modal"
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    " h-full  sm:h-[620px] lg:h-[590px] italic bg-white rounded-[20px] px-3 pb-2 relative    md:flex gap-1 mx-3  ",
                    !item.type?.length
                      ? "max-w-[500px] w-full h-[60%] flex-col text-center mx-auto"
                      : " max-w-[534px] md:max-w-[924px] w-full  pt-6  md:justify-between "
                  )}
                >
                  <ProductImage image={item.image} sizePizza={sizePizza} />

                  {item.type && item.type.length > 0 ? (
                    <ProductFormPizza
                      item={item.type && item}
                      setActiveModal={setActiveModal}
                      sizePizza={sizePizza}
                      setSizePizza={setSizePizza}
                    />
                  ) : (
                    <ProductForm
                      item={item.type.length === 0 ? item : ({} as IProduct)}
                      setActiveModal={setActiveModal}
                    />
                  )}
                  <CloseModalBtn
                    className=" top-[6px] -right-9 hover:scale-110 hidden lg:block  "
                    onClick={() => setActiveModal(false)}
                  />
                  <button
                    data-testid="btn-close-modal-mini"
                    onClick={() => setActiveModal(false)}
                    className="lg:hidden absolute top-3 left-4"
                  >
                    <TfiArrowCircleDown size={35} color="#989898" />
                  </button>
                </div>
              </animated.div>
            )
        )}
      </>
    );
  }
);

export default Modal;
