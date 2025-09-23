import Button from "../../shared/button/Button";

interface IEmptyCartProps {
  closeCart: () => void;
}

const EmptyCart = ({ closeCart }: IEmptyCartProps) => {
  return (
    <div
      data-testid="empty-cart"
      className="w-[285px] mx-auto text-center pt-5"
    >
      <img className="mx-auto mb-2" src="./images/cart-img.svg" />
      <h2 className="text-[22px] font-semibold mb-[6px]">Корзина пустая</h2>
      <p className="mb-9 text-gray-400">
        Добавьте хотя бы один товар, чтобы совершить заказ
      </p>
      <Button onClick={closeCart} className="bg-primary text-white">
        {" "}
        🠔 Вернуться назад
      </Button>
    </div>
  );
};

export default EmptyCart;
