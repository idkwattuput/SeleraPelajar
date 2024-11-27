import type { Request, Response, NextFunction } from "express";
import orderRepository from "../repositories/order-repository";
import { io } from "..";
import cafeRepository from "../repositories/cafe-repository";

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

async function getCurrentOrdersSeller(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as any).user.id;
    const isCafeExist = await cafeRepository.findBySellerId(userId);
    if (!isCafeExist) {
      return res.status(404).json({ message: "Cafe not found" });
    }
    const currentOrders = await orderRepository.findAllCurrentOrderSeller(
      isCafeExist.id,
    );
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
    io.emit("newOrder", newOrder);
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
  getCurrentOrdersSeller,
  getHistoryOrders,
  getOrder,
  createOrder,
  updateOrder,
};
