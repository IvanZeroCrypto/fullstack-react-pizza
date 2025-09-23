import { AxiosResponse } from "axios";
import { api } from "..";
import { ICartResponse } from "../../response/CartResponse";
import { IProductForCart } from "../../types/ProductForCart";

export default class CartService {
  static async getCart(): Promise<AxiosResponse<ICartResponse>> {
    return api.get("/cart");
  }
  static async addCart(product: IProductForCart) {
    return api.post("/cart", { ...product });
  }
  static async changeProductQuantity(params: {
    productId: string;
    method: string;
  }): Promise<AxiosResponse<void>> {
    return api.post("/cart/item-quantity", params);
  }
  static async deleteProductCart(id: string): Promise<AxiosResponse<void>> {
    return api.delete(`/cart/${id}`);
  }
  static async deleteCart(): Promise<AxiosResponse<void>> {
    return api.delete("/cart");
  }
}
