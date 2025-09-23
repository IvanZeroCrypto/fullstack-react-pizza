import { prisma } from "../prisma/prisma-client.js";
import { join } from "path";
import { unlink } from "fs/promises";

class ProductController {
  async createProduct(req, res) {
    try {
      const { name, description, price, portion } = req.body;

      const categoryId = parseInt(req.body.categoryId);
      const ingredientsId = JSON.parse(req.body.ingredientsId);
      const type = JSON.parse(req.body.type);

      const image = req.file ? "/uploads/" + req.file.filename : null;

      if (!categoryId || !name || !price || !req.file) {
        return res.status(400).json({ message: "Не все поля заполнены" });
      }

      const existingProduct = await prisma.product.findFirst({
        where: {
          name,
        },
      });
      if (existingProduct) {
        return res
          .status(400)
          .json({ message: "Данная вариация продукта уже существует" });
      }

      if (ingredientsId) {
        await prisma.product.create({
          data: {
            name,
            description,
            price,
            image,
            type,
            categoryId,
            ingredients: {
              connect: ingredientsId.map((id) => ({
                id,
              })),
            },
          },
        });
      } else {
        await prisma.product.create({
          data: {
            name,
            description,
            price,
            image,
            categoryId,
            portion,
          },
        });
      }
      res.json("Продукт создан");
    } catch (error) {
      res.status(500).json({ message: "Server error create" });
    }
  }
  async deleteProduct(req, res) {
    try {
      const params = req.params;
      const id = parseInt(params.id);

      const product = await prisma.product.findFirst({ where: { id } });

      if (!product) {
        return res.status(400).json({ message: "Продукт не найден" });
      }

      if (product.image) {
        const imagePath = join(process.cwd(), product.image);

        try {
          await unlink(imagePath);
        } catch (error) {
          console.log("Ошибка удаления изображения");
        }
      }

      await prisma.product.delete({
        where: {
          id,
        },
      });
      res.json({ message: "Продукт удален" });
    } catch (error) {
      console.log(error, "delete product");
    }
  }
  async getProductById(req, res) {
    try {
      const params = req.params;
      const id = parseInt(params.id);

      const product = await prisma.product.findFirst({
        where: {
          id,
        },
        include: {
          ingredients: true,
        },
      });
      res.json(product);
    } catch (error) {
      console.log(error, "delete product");
    }
  }
  async updateProductById(req, res) {
    try {
      const { name, description, price, portion } = req.body;
      const params = req.params;
      const id = parseInt(params.id);
      const ingredientsId = JSON.parse(req.body.ingredientsId);
      const type = JSON.parse(req.body.type);
      if (!name || !price || !req.file) {
        return res.status(400).json({ message: "Не все поля заполнены" });
      }

      const product = await prisma.product.findFirst({ where: { id } });

      if (!product) {
        return res.status(400).json({ message: "Продукт не найден" });
      }

      if (product.image) {
        const imagePath = join(process.cwd(), product.image);

        try {
          await unlink(imagePath);
        } catch (error) {
          console.log("Ошибка удаления изображения");
        }
      }

      const image = req.file ? "/uploads/" + req.file.filename : null;

      if (type || ingredientsId) {
        await prisma.product.update({
          where: {
            id,
          },
          data: {
            name,
            description,
            price,
            image,
            type,
            ingredients: {
              set: [],
              connect: ingredientsId.map((id) => ({
                id,
              })),
            },
          },
        });
      } else {
        await prisma.product.update({
          where: {
            id,
          },
          data: {
            name,
            description,
            price,
            image,
            portion,
          },
        });
      }

      res.json("Продукт обновлен");
    } catch (error) {
      res.status(500).json({ message: "Server error update product" });
    }
  }
}
export default new ProductController();
