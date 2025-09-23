import { Router } from "express";
import userController from "../controllers/userController.js";
import categoryController from "../controllers/categoryController.js";
import productController from "../controllers/productController.js";
import ingredientController from "../controllers/ingredientController.js";
import cartController from "../controllers/cartController.js";
import auth from "../middleware/auth.js";
import authRole from "../middleware/roleMIddleware.js";
import cartInit from "../middleware/cartInit.js";
import upload from "../middleware/fileUploads.js";
export const router = new Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/activate/:link", userController.activate);
router.get("/users", auth, userController.getAllUsers);
router.get("/refresh", userController.refresh);
router.post("/logout", userController.logout);
router.delete("/users/:id", userController.deleteUsers);
router.get("/check-auth", auth, userController.checkAuth);

router.post("/categories", authRole, categoryController.createCategory);
router.get("/categories", categoryController.allCategories);
router.delete("/categories/:id", authRole, categoryController.deleteCategory);
router.get(
  "/allCategoriesWithProducts",
  categoryController.allCategoriesWithProducts
);

router.post(
  "/product",
  upload.single("image"),
  authRole,
  productController.createProduct
);
router.post(
  "/product/:id",
  upload.single("image"),
  authRole,
  productController.updateProductById
);
router.get("/product/:id", authRole, productController.getProductById);
router.delete("/product/:id", authRole, productController.deleteProduct);

router.post("/ingredients", ingredientController.createIngredient);
router.get("/ingredients", ingredientController.getAllIngredients);

router.get("/cart", cartInit, cartController.getCart);
router.post("/cart", cartInit, cartController.addProductCart);
router.post(
  "/cart/item-quantity",
  cartInit,
  cartController.changeProductQuantity
);
router.delete("/cart/:id", cartController.deleteCartItem);
router.delete("/carted/:id", cartController.deleteCart);
