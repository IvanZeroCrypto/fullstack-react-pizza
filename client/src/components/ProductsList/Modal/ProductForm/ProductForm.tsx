import React, { useState } from "react";
import Button from "../../../shared/button/Button";
import { IProduct } from "../../../../response/ProductResponse";
import CartService from "../../../../http/services/CartService";
import toast from "react-hot-toast";
import useCartStores from "../../../../store/cartStores";
interface IProductFormProps {
  item: IProduct;
  setActiveModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductForm = ({ item, setActiveModal }: IProductFormProps) => {
  const [isLoading, setIsloading] = useState(false);
  const { fetchBasket } = useCartStores();

  const addProductCart = async () => {
    try {
      const product = {
        productId: item.id,
      };
      setIsloading(true);
      const addProduct = await CartService.addCart(product);

      if (addProduct.status === 200) {
        setIsloading(false);

        fetchBasket();
        toast.success(` ${item.name} добавлен в корзину`);
        setActiveModal(false);
      }
    } catch (error) {
      setIsloading(false);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Неизвестная ошибка");
      }
    }
  };
  return (
    <div className="max-w-[400px] w-full flex flex-col z-50 -ml-[10px] sm:ml-10  absolute bottom-2">
      <h1 className="text-[24px] font-medium">{item.name}</h1>
      <p className=" text-textCartProduct">{item.portion}</p>
      <div className="text-sm mb-3 ">{item.description}</div>
      <Button
        loading={isLoading}
        onClick={addProductCart}
        className="w-full mt-4 text-base font-medium"
      >
        В корзину за {parseFloat(item.price)} ₽
      </Button>
    </div>
  );
};

export default ProductForm;
