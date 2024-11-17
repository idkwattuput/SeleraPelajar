import type { Request, Response, NextFunction } from "express";
import type { OrderRepository } from "../repositories/order-repository";
import { io } from "..";

export class OrderController {
  orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async getCurrentOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const currentOrders =
        await this.orderRepository.findAllCurrentOrder(userId);
      return res.json({ data: currentOrders });
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const currentOrders = await this.orderRepository.find(id);
      return res.json({ data: currentOrders });
    } catch (error) {
      next(error);
    }
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

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const updatedOrder = await this.orderRepository.update(id, status);
      io.emit("updateOrder", updatedOrder);
      return res.json({ data: updatedOrder });
    } catch (error) {
      next(error);
    }
  }
}
