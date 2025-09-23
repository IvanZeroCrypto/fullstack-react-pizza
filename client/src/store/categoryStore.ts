import { create } from "zustand";
import CategoryService from "../http/services/CategryService";
import { Category } from "../types/Category";
import { AxiosResponse } from "axios";

interface ICategoryStore {
  loading: boolean;
  categories: Category[];
  getAllCategories: () => Promise<void>;
}

const useCategoryStore = create<ICategoryStore>((set) => ({
  categories: [],
  loading: false,
  getAllCategories: async () => {
    try {
      set({ loading: true });
      const response: AxiosResponse<Category[]> =
        await CategoryService.getAllCategories();
      set({ categories: response.data, loading: false });
    } catch (error) {
      set({ categories: [], loading: false });
      console.log(error);
    }
  },
}));

export default useCategoryStore;
