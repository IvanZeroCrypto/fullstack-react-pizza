import { SiFampay } from "react-icons/si";
import { GoQuestion } from "react-icons/go";

import PayForm from "./PayForm";
import Button from "../shared/button/Button";

export interface IPaymentProps {
  activePay?: boolean;
  setActivePay: React.Dispatch<React.SetStateAction<boolean>>;
  delivery: number;
  totalPrice?: number;
}
const Payment = ({
  activePay,
  setActivePay,
  delivery,
  totalPrice,
}: IPaymentProps) => {
  return (
    <>
      {activePay && (
        <div
          onClick={() => setActivePay(false)}
          className="fixed top-0 left-0 bottom-0 right-0 z-50 backdrop-blur-md flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="p-10 bg-white max-h-[500px] max-w-[400px] h-full w-full px-8 py-4 shadow rounded-lg  "
          >
            <div className="flex items-center justify-between border-b pb-3 border-b-gray-200 mb-10">
              <div className="text-blue-500 flex items-center">
                <SiFampay size={25} />
                <div className="text-lg font-extrabold italic">PayMaster</div>
              </div>
              <div className=" font-bold">
                <span className="text-lg font-bold">
                  {totalPrice && totalPrice + delivery}
                </span>
                ,00₽
              </div>
            </div>
            <div className="  w-[75%]  mx-auto">
              <PayForm />
              <div className="flex items-center gap-2 mt-2 text-gray-400">
                <input type="checkbox" name="" id="" />
                <label htmlFor="">Запомнить данные карты</label>
                <GoQuestion />
              </div>
              <input
                placeholder="Email для квитанции"
                className="border w-full h-11 px-1 outline-none bg-gray-100 rounded-md mt-3 mb-6"
                type="email"
              />
              <Button className="text-white  bg-teal-500 w-full font-medium">
                Оплатить {totalPrice && totalPrice + delivery},00₽
              </Button>
              <div className="w-full text-center">
                <button
                  onClick={() => setActivePay(false)}
                  className="underline bg-none text-blue-400 mt-12 "
                >
                  Отказаться от оплаты
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
