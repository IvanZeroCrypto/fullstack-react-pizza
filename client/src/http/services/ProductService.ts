import { AxiosResponse } from "axios";
import { api } from "..";
import { IProduct, IProductResponse } from "../../response/ProductResponse";

export default class ProductService {
  static async getAllProducts(): Promise<AxiosResponse<IProductResponse>> {
    return api.get("/allCategoriesWithProducts");
  }
  static async createProduct(formData: FormData): Promise<AxiosResponse> {
    return api.post("/product", formData);
  }
  static async updateProduct(
    id: string,
    formData: FormData
  ): Promise<AxiosResponse> {
    return api.post(`/product/${id}`, formData);
  }
  static async getProductById(id: string): Promise<AxiosResponse<IProduct>> {
    return api.get(`/product/${id}`);
  }
  static async deleteProduct(id: number): Promise<AxiosResponse> {
    return api.delete(`/product/${id}`);
  }
}
