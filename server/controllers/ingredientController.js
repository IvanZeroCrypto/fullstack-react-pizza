import { prisma } from "../prisma/prisma-client.js";

class IngredientController {
  async createIngredient(req, res) {
    const { ingredients } = req.body;

    const arrayIngredients = ingredients.map((ingredient) => ({
      name: ingredient.name,
      price: ingredient.price,
      image: ingredient.image,
    }));
    await prisma.ingredient.createMany({
      data: arrayIngredients,
      skipDuplicates: true,
    });
    res.json("Ингредиенты добавлены");
  }
  async getAllIngredients(req, res) {
    try {
      const ingredients = await prisma.ingredient.findMany();
      res.json(ingredients);
    } catch (error) {
      console.log(error, "getAllIngredients");
    }
  }
}
export default new IngredientController();
