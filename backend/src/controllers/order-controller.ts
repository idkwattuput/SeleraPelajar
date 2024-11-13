import type { Request, Response, NextFunction } from "express";
import type { OrderRepository } from "../repositories/order-repository";

export class OrderController {
  orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { cafeId } = req.body;
      const newOrder = await this.orderRepository.save(cafeId, userId);
      return res.status(201).json({ data: newOrder });
    } catch (error) {
      next(error);
    }
  }
}
