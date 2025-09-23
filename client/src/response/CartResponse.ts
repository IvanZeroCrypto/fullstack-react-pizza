import { IIngredient } from "./ProductResponse";

interface ICustomization {
  ingredients?: string[];
  size?: number;
  type?: string;
  weight?: string;
  portion?: string;
}

export interface IItems {
  cartId: string;
  description?: string;
  id: string;
  image: string;
  name: string;
  // portion?: string;
  price?: number;
  productId: string;
  quantity: number;
  customization?: ICustomization;
}

export interface ICartResponse {
  totalPrice: number;
  items: IItems[];
}
