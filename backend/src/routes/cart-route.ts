import express from "express";
import cartController from "../controllers/cart-controller";

const router = express.Router();

router
  .route("/")
  .get(cartController.getCarts)
  .post(cartController.addToCart)
  .put(cartController.decreaseQuantity);
router.route("/cafes/:cafeId").get(cartController.getCart);

export default router;
