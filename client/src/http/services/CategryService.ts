import { AxiosResponse } from "axios";
import { api } from "..";
import { Category } from "../../types/Category";

export default class CategoryService {
  static async getAllCategories(): Promise<AxiosResponse<Category[]>> {
    return api.get("/categories");
  }
  static async createCategory(name: string): Promise<AxiosResponse<void>> {
    return api.post("/categories", { name });
  }
  static async deleteCategory(id: number) {
    return api.delete(`/categories/${id}`);
  }
}
