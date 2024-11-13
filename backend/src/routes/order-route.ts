import express, { Router } from "express";
import type { OrderController } from "../controllers/order-controller";

export class OrderRoute {
  orderController: OrderController;
  router: Router;

  constructor(orderController: OrderController) {
    this.orderController = orderController;
    this.router = express.Router();
    this.setRoute();
  }

  private setRoute() {
    this.router
      .route("/")
      .post(this.orderController.createOrder.bind(this.orderController));
  }
}
