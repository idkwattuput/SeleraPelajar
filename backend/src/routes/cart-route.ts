import express, { Router } from "express";
import type { CartController } from "../controllers/cart-controller";

export class CartRoute {
  cartController: CartController;
  router: Router;

  constructor(cartController: CartController) {
    this.cartController = cartController;
    this.router = express.Router();
    this.setRoute();
  }

  private setRoute() {
    this.router
      .route("/cafes/:cafeId")
      .get(this.cartController.getCart.bind(this.cartController));
    this.router
      .route("/")
      .post(this.cartController.addToCart.bind(this.cartController))
      .put(this.cartController.decreaseQuantity.bind(this.cartController));
  }
}
