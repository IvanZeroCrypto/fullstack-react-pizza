import { create } from "zustand";
import ProductService from "../http/services/ProductService";
import {
  ICategoryWithProducts,
  IProductResponse,
} from "../response/ProductResponse";
import { AxiosResponse } from "axios";

interface IProductStore {
  isLoading: boolean;
  productsList: ICategoryWithProducts[];
  categoriesList: string[];
  getAllProducts: () => Promise<void>;
}

const useProductsStore = create<IProductStore>((set) => ({
  isLoading: false,
  productsList: [],
  categoriesList: [],
  getAllProducts: async () => {
    set({ isLoading: true });
    try {
      const response: AxiosResponse<IProductResponse> =
        await ProductService.getAllProducts();
      set({
        productsList: response.data,
        isLoading: false,
        categoriesList: response.data.map((item) => item.name),
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
export default useProductsStore;
