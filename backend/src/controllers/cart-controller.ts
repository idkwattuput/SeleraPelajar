import type { Request, Response, NextFunction } from "express";
import type { CartRepository } from "../repositories/cart-repository";

export class CartController {
  cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      console.log(userId);
      const cafeId = req.params.cafeId;
      console.log(cafeId);
      const cartItems = await this.cartRepository.findAllCartItems(
        cafeId,
        userId,
      );
      return res.json({ data: cartItems });
    } catch (error) {
      next(error);
    }
  }

  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { cafeId, isNote, itemId, price, quantity, note } = req.body;
      if (!cafeId || !itemId || !price || !quantity) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const newCart = await this.cartRepository.save(
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

  async decreaseQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { cafeId, isNote, item, quantity } = req.body;
      if (!cafeId || !item || !quantity) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const updatedCart = await this.cartRepository.decreaseQuantity(
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
}
