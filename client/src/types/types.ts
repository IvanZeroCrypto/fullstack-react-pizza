export interface IProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  portion?: string;
  type?: string[];
  price: string;
}

export interface IPizza {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  type: string[];
  ingredients: IIngredient[];
}
export interface IIngredient {
  id: string;
  name: string;
  image: string;
  price: string | number;
}

export interface IProducts {
  breakfast: IProduct[];
  cocktails: IProduct[];
  coffee: IProduct[];
  desserts: IProduct[];
  drinks: IProduct[];
  snacks: IProduct[];
  pizzas: IPizza[];
}
export interface IDataProducts {
  products: IProducts;
}

export interface ICategories {
  id: number;
  category: string;
}
