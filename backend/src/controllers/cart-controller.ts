import type { Request, Response, NextFunction } from "express";
import cartRepository from "../repositories/cart-repository";

async function getCarts(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const carts = await cartRepository.findAll(userId);
    return res.json({ data: carts });
  } catch (error) {
    next(error);
  }
}

async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const cafeId = req.params.cafeId;
    const cartItems = await cartRepository.findAllCartItems(cafeId, userId);
    return res.json({ data: cartItems });
  } catch (error) {
    next(error);
  }
}

async function addToCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const { cafeId, isNote, itemId, price, quantity, note } = req.body;
    if (!cafeId || !itemId || !price || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newCart = await cartRepository.save(
      cafeId,
      userId,
      itemId,
      price,
      quantity,
      isNote,
      note,
    );
    return res.status(201).json({ data: newCart });
  } catch (error) {
    next(error);
  }
}

async function decreaseQuantity(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as any).user.id;
    const { cafeId, isNote, item, quantity } = req.body;
    if (!cafeId || !item || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const updatedCart = await cartRepository.decreaseQuantity(
      cafeId,
      userId,
      item,
      isNote,
      quantity,
    );
    return res.json({ data: updatedCart });
  } catch (error) {
    next(error);
  }
}

export default {
  getCarts,
  getCart,
  addToCart,
  decreaseQuantity,
};
