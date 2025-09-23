import { FC, useState } from "react";
import Button from "../../shared/button/Button";
import Modal from "../Modal/Modal";
import { MdClear } from "react-icons/md";
import { HiPencil } from "react-icons/hi2";
import useAuthStore from "../../../store/authStore";
import ProductService from "../../../http/services/ProductService";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { IProduct } from "../../../response/ProductResponse";
import ScrollAnimate from "../../scroll-animate/ScrollAnimate";
import useProductsStore from "../../../store/productsStore";

interface ICardProductProps {
  item: IProduct;
}
const CardProduct: FC<ICardProductProps> = ({ item }) => {
  const [activeModal, setActiveModal] = useState<boolean>(false);

  const { getAllProducts } = useProductsStore();
  const { isAdmin } = useAuthStore();

  const deleteProduct = async (id: number) => {
    try {
      if (window.confirm("Вы действительно хотите удалить продукт???")) {
        await ProductService.deleteProduct(id);
        toast.success("Продукт удален");
        getAllProducts();
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
    <div data-testid="card-product" className="flex flex-col">
      <ScrollAnimate type="fade">
        <div className="">
          <div className="flex justify-center bg-white relative">
            {isAdmin && (
              <div className=" absolute top-2 left-2 z-30 cursor-pointer">
                <MdClear
                  data-testid="btn-clear"
                  onClick={() => deleteProduct(item.id)}
                  size={20}
                  color={"gray"}
                />
              </div>
            )}
            {isAdmin && (
              <Link
                data-testid="link-btn-card-product"
                to={`admin/update-product/${item.id}`}
                className=" absolute top-2 right-2 z-30 cursor-pointer"
              >
                <HiPencil size={20} color={"gray"} />
              </Link>
            )}

            <img
              onClick={() => setActiveModal(true)}
              className=" transition ease-in duration-200 hover:translate-y-[6px] max-w-[220px] h-[220px] cursor-pointer"
              src={` ${
                process.env.API_URL
                  ? process.env.API_URL
                  : "http://localhost:5000"
              }${item.image}`}
            />
          </div>
          <div className="text-[20px] font-normal my-2">{item.name}</div>
          <div className="text-textCartProduct mb-4 text-xs sm:text-base">
            {item.description}
          </div>
        </div>
      </ScrollAnimate>
      <div className="flex items-center justify-between mt-auto ">
        <div className="text-base font-semibold">от {item.price} ₽</div>
        <Button
          onClick={() => setActiveModal(true)}
          className="bg-[#fff0e6] text-[#d15700] transition ease-in font-medium hover:scale-105"
        >
          Добавить
        </Button>
      </div>

      <Modal
        activeModal={activeModal}
        item={item}
        setActiveModal={setActiveModal}
      />
    </div>
  );
};

export default CardProduct;
