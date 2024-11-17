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
      .get(this.orderController.getCurrentOrders.bind(this.orderController))
      .post(this.orderController.createOrder.bind(this.orderController));
    this.router
      .route("/:id")
      .get(this.orderController.getOrder.bind(this.orderController))
      .put(this.orderController.updateOrder.bind(this.orderController));
  }
}
