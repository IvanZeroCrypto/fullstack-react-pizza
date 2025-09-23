import Container from "../../shared/Container";
import BlockCart from "../../cart-page-components/BlockCart";
import BlockTotalPrice from "../../cart-page-components/BlockTotalPrice";
import PersonalInfo from "../../cart-page-components/PersonalInfo";
import Address from "../../cart-page-components/Address";
import Payment from "../../payment-modal/Payment";
import { useState } from "react";
import {
  cartFormSchema,
  TypeCartFormSchema,
} from "../../cart-page-components/form-schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import useCartStores from "../../../store/cartStores";

const CartPage = () => {
  const [activePay, setActivePay] = useState(false);
  const { totalPrice } = useCartStores();
  const { isAuth } = useAuthStore();

  const delivery =
    totalPrice < 2000 ? 100 : totalPrice > 2000 && totalPrice < 3500 ? 60 : 0;

  const form = useForm<TypeCartFormSchema>({
    resolver: zodResolver(cartFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      address: "",
      comment: "",
    },
  });

  const onSubmit = (data: TypeCartFormSchema) => {
    setActivePay(true);
  };
  if (!isAuth) {
    return <Navigate to="/login?from=/cart" />;
  }

  return (
    <div className="bg-[#F4F1EE] min-h-screen">
      <Container>
        <h1 className=" my-9 text-3xl font-extrabold">Оформить заказ</h1>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className=" grid  grid-cols-[2fr] md:grid-cols-[2fr_1fr] md:gap-10 ">
              <div>
                <BlockCart />
                <PersonalInfo />
                <Address />
              </div>
              <div>
                <BlockTotalPrice
                  setActivePay={setActivePay}
                  delivery={delivery}
                  totalPrice={totalPrice}
                />
              </div>
            </div>
          </form>
        </FormProvider>
        <Payment
          activePay={activePay}
          setActivePay={setActivePay}
          delivery={delivery}
          totalPrice={totalPrice}
        />
      </Container>
    </div>
  );
};

export default CartPage;
