import type { Request, Response, NextFunction } from "express";
import orderRepository from "../repositories/order-repository";
import { io } from "..";

async function getCurrentOrders(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as any).user.id;
    const currentOrders = await orderRepository.findAllCurrentOrder(userId);
    return res.json({ data: currentOrders });
  } catch (error) {
    next(error);
  }
}

async function getHistoryOrders(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as any).user.id;
    const historyOrders = await orderRepository.findAllHistoryOrder(userId);
    return res.json({ data: historyOrders });
  } catch (error) {
    next(error);
  }
}

async function getOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const currentOrders = await orderRepository.find(id);
    return res.json({ data: currentOrders });
  } catch (error) {
    next(error);
  }
}

async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const { cafeId } = req.body;
    const newOrder = await orderRepository.save(cafeId, userId);
    return res.status(201).json({ data: newOrder });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const updatedOrder = await orderRepository.update(id, status);
    io.emit("updateOrder", updatedOrder);
    return res.json({ data: updatedOrder });
  } catch (error) {
    next(error);
  }
}

export default {
  getCurrentOrders,
  getHistoryOrders,
  getOrder,
  createOrder,
  updateOrder,
};
