import { prisma } from "../prisma/prisma-client.js";

class CartController {
  async getCart(req, res) {
    try {
      const sessionId = req.sessionId;

      const existingCart = await prisma.cart.findFirst({
        where: { sessionId },
        include: {
          items: true,
        },
      });

      if (!existingCart) {
        return res
          .json(400)
          .json({ message: "Неверный sessionId или корзины не существует" });
      }

      const totalPriceBasket = existingCart.items
        .map((item) => item.price * item.quantity)
        .reduce((acc, val) => acc + val, 0);

      const cart = await prisma.cart.update({
        where: {
          id: existingCart.id,
        },
        include: {
          items: true,
        },
        data: {
          totalPrice: totalPriceBasket,
        },
      });
      cart.items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Server error getCart" });
    }
  }
  async addProductCart(req, res) {
    try {
      const sessionId = req.sessionId;
      const { productId, ingredients, type, pricePizza, size, weight } =
        req.body;

      const product = await prisma.product.findFirst({
        where: {
          id: productId,
        },
      });

      const cart = await prisma.cart.findFirst({
        where: {
          sessionId,
        },
        include: {
          items: true,
        },
      });

      if (!type && !ingredients && !size) {
        const existingProduct = cart.items.find(
          (product) => product.productId === productId
        );

        if (existingProduct) {
          await prisma.cartItem.update({
            where: {
              id: existingProduct.id,
            },
            data: {
              quantity: { increment: 1 },
            },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId,
              name: product.name,
              description: product.description,
              portion: product.portion,
              image: product.image,
              price: parseInt(product.price),
              quantity: 1,
            },
          });
        }
      } else {
        const sortIngredients = ingredients
          .map((item) => item.toLowerCase())
          .sort();

        const existingPizza = cart.items.find(
          (product) =>
            product.productId === productId &&
            product.customization?.size === size &&
            product.customization?.type === type
        );

        const ingredientsExistingPizza =
          existingPizza?.customization?.ingredients &&
          existingPizza?.customization?.ingredients
            .map((v) => v.toLowerCase())
            .sort();

        const arraysEqual =
          sortIngredients?.length === ingredientsExistingPizza?.length &&
          sortIngredients?.every(
            (val, i) => val === ingredientsExistingPizza[i]
          );

        if (existingPizza && arraysEqual) {
          await prisma.cartItem.update({
            where: {
              id: existingPizza.id,
            },
            data: {
              quantity: { increment: 1 },
            },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId,
              name: product.name,
              description: product.description,
              price: pricePizza,
              portion: product.portion,
              image: product.image,
              customization: {
                size: size,
                type: type,
                ingredients: ingredients,
                weight: weight,
              },
              quantity: 1,
            },
          });
        }
      }

      res.json("Продукт добавлен в корзину");
    } catch (error) {
      res.status(500).json({ message: "Server error getProduct" });
      console.log(error);
    }
  }

  async changeProductQuantity(req, res) {
    try {
      const { productId, method } = req.body;

      const productInCart = await prisma.cartItem.findFirst({
        where: { id: productId },
      });

      if (!productInCart) {
        return res
          .status(400)
          .json({ message: "Неверный id или продукта нет в корзине" });
      }

      if (method === "plus") {
        await prisma.cartItem.update({
          where: {
            id: productId,
          },
          data: {
            quantity: { increment: 1 },
          },
        });
      } else {
        await prisma.cartItem.update({
          where: {
            id: productId,
          },
          data: {
            quantity: { decrement: 1 },
          },
        });
      }

      res.json("ok");
    } catch (error) {
      res.status(500).json({ message: "Server error quantity" });
      console.log(error);
    }
  }

  async deleteCartItem(req, res) {
    try {
      const { id } = req.params;

      await prisma.cartItem.delete({ where: { id } });

      res.json("ok");
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCart(req, res) {
    try {
      await prisma.cart.delete({
        where: {
          id: req.params.id,
        },
      });

      res.json("ok");
    } catch (error) {
      console.log(error);
    }
  }
}
export default new CartController();
