import express from "express";
import orderController from "../controllers/order-controller";

const router = express.Router();

router
  .route("/")
  .get(orderController.getCurrentOrders)
  .post(orderController.createOrder);
router.route("/history").get(orderController.getHistoryOrders);
router
  .route("/:id")
  .get(orderController.getOrder)
  .put(orderController.updateOrder);

export default router;
