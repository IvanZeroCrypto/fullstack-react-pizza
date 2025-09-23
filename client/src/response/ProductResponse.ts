export type IIngredient = {
  id: number;
  image: string;
  name: string;
  price: string;
};

export interface IProduct {
  id: number;
  categoryId: number;
  description: string;
  image: string;
  name: string;
  portion: string;
  price: string;
  type: string[];
  ingredients: IIngredient[];
}

export interface ICategoryWithProducts {
  id: number;
  name: string;
  products: IProduct[];
}

export type IProductResponse = ICategoryWithProducts[];

/*export interface IGetByIdProd {
  categoryId:number;
  description:string;
  id:number;
  image:string;
  name:string;
  

}

*/
