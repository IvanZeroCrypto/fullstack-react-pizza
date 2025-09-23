import { create } from "zustand";
import CartService from "../http/services/CartService";
import { AxiosResponse } from "axios";
import { ICartResponse, IItems } from "../response/CartResponse";

interface ICartStores {
  basketGoods: IItems[];
  totalPrice: number;
  loading: boolean;
  fetchBasket: () => Promise<void>;
  clearBasket: () => void;
}

const useCartStores = create<ICartStores>((set) => ({
  basketGoods: [],
  totalPrice: 0,
  loading: false,
  clearBasket: () => set({ basketGoods: [], totalPrice: 0 }),
  fetchBasket: async () => {
    try {
      set({ loading: true });
      const { data }: AxiosResponse<ICartResponse> =
        await CartService.getCart();
      set({
        basketGoods: data?.items,
        loading: false,
        totalPrice: data?.totalPrice,
      });
    } catch (error) {
      set({ loading: false });
    }
  },
}));

export default useCartStores;
