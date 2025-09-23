import { create } from "zustand";
import IngredientService from "../http/services/IngredientService";
import { AxiosResponse } from "axios";
import { IIngredient } from "../response/ProductResponse";

interface IIngredientStore {
  ingredients: IIngredient[];
  loading: boolean;
  getAllIngredients: () => Promise<void>;
}

const useIngredientsStore = create<IIngredientStore>((set) => ({
  ingredients: [],
  loading: false,
  getAllIngredients: async () => {
    try {
      set({ loading: true });
      const response: AxiosResponse<IIngredient[]> =
        await IngredientService.getAllIngredients();
      set({ ingredients: response.data, loading: false });
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useIngredientsStore;
