import WhiteBlock from "../shared/white-block/WhiteBlock";
import { MdOutlinePriceChange } from "react-icons/md";
import { LiaTruckSolid } from "react-icons/lia";
import Button from "../shared/button/Button";
import { IPaymentProps } from "../payment-modal/Payment";

const BlockTotalPrice = ({
  setActivePay,
  delivery,
  totalPrice,
}: IPaymentProps) => {
  return (
    <WhiteBlock title="Итого:" className="relative">
      <h1 className="text-[26px] font-extrabold absolute  top-10 ">
        {totalPrice ? totalPrice + delivery : 0} ₽
      </h1>

      <div className=" border-t-gray-400 mt-9 py-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <MdOutlinePriceChange color={"#B9B9B9"} />
            <span className="pl-1 text-base font-normal">
              Стоимость товаров:
            </span>
          </div>
          <div className="font-bold">{totalPrice} ₽</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <LiaTruckSolid color={"#B9B9B9"} />
            <span className="pl-1 text-base font-normal">Доставка:</span>
          </div>
          <div className="font-bold">{totalPrice ? delivery : 0} ₽</div>
        </div>
        <Button
          type="submit"
          // onClick={() => setActivePay(true)}
          disabled={!totalPrice}
          className="bg-primary text-white font-semibold mt-7 w-full  disabled:bg-gray-500 "
        >
          Перейти к оплате
        </Button>
      </div>
    </WhiteBlock>
  );
};

export default BlockTotalPrice;
