import { MdOutlinePayment } from "react-icons/md";
const PayForm = () => {
  return (
    <div className="rounded-md p-3 border">
      <div className="flex gap-1 justify-end items-center mb-2">
        <span className="text-lg text-blue-500 font-extrabold italic">
          VISA
        </span>
        <span className="text-lg  font-extrabold italic text-green-500">
          МИР
        </span>
        <MdOutlinePayment color="#ffe417" />
      </div>
      <form action="">
        <input
          placeholder="Номер карты"
          className="border w-full mb-5 h-11 px-1 outline-none bg-gray-100 rounded-md"
          type="text"
        />
        <div className="flex items-center">
          <input
            placeholder="MM/ГГ"
            className="border w-1/2 mr-12 h-11 px-1 outline-none bg-gray-100 rounded-md placeholder:italic"
            type="text"
          />
          <input
            placeholder="CVV/CVC"
            className="border w-1/2 h-11 px-1 outline-none bg-gray-100 rounded-md placeholder:italic"
            type="text"
          />
        </div>
      </form>
    </div>
  );
};

export default PayForm;
