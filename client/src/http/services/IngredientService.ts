import { AxiosResponse } from "axios";
import { api } from "..";
import { IIngredient } from "../../response/ProductResponse";

export default class IngredientService {
  static async getAllIngredients(): Promise<AxiosResponse<IIngredient[]>> {
    return api.get("/ingredients");
  }
}
