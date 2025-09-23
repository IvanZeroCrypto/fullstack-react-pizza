import { prisma } from "../prisma/prisma-client.js";

class CategoryController {
  async createCategory(req, res) {
    const { name } = req.body;

    const nameCategory = name.charAt(0).toUpperCase() + name.slice(1);

    const existing = await prisma.category.findFirst({
      where: {
        name: nameCategory,
      },
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Данная категория уже существует" });
    }

    await prisma.category.create({
      data: {
        name: nameCategory,
      },
    });

    res.status(200).json("Категория создана");
  }
  async deleteCategory(req, res) {
    try {
      const params = req.params;
      const id = parseInt(params.id);

      const allProductId = await prisma.product.findMany({
        where: {
          categoryId: id,
        },
      });
      if (allProductId.length === 0) {
        await prisma.category.delete({
          where: {
            id,
          },
        });
        res.json(" Категория удалена");
      } else {
        await prisma.product.deleteMany({
          where: {
            categoryId: id,
          },
        });
        await prisma.category.delete({
          where: {
            id,
          },
        });
        res.json({ message: "Категория и все ее продукты удалены" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async allCategories(req, res) {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { products: true },
          },
        },
      });
      res.json(categories);
    } catch (error) {
      console.log(error);
    }
  }

  async allCategoriesWithProducts(req, res) {
    const categoriesWithProducts = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        products: {
          include: {
            ingredients: true,
          },
        },
      },
    });
    res.json(categoriesWithProducts);
  }
}
export default new CategoryController();
