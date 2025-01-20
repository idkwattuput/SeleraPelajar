import type { Request, Response, NextFunction } from "express";
import cafeRepository from "../repositories/cafe-repository";
import itemRepository from "../repositories/item-repository";

async function createItem(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const { name, description, price, categoryId } = req.body;
    const itemImage = req.file?.filename || null;
    const isCafeExist = await cafeRepository.findBySellerId(userId);
    if (!isCafeExist) {
      return res.status(404).json({ message: "Cafe not found" });
    }
    const newItem = await itemRepository.save(
      isCafeExist.id,
      name,
      description,
      price,
      categoryId,
      itemImage,
    );
    return res.status(201).json({ data: newItem });
  } catch (error) {
    next(error);
  }
}

async function updateItem(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const { name, description, price, categoryId, image } = req.body;
    const updatedItem = await itemRepository.update(
      id,
      name,
      description,
      price,
      categoryId,
      image,
    );
    return res.json({ data: updatedItem });
  } catch (error) {
    next(error);
  }
}

async function updateAvailableItem(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id;
    const { isAvailable } = req.body;
    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({ message: "All fields are required" });
    }
    const updatedItem = await itemRepository.updateAvailable(id, isAvailable);
    return res.json({ data: updatedItem });
  } catch (error) {
    next(error);
  }
}

export default {
  createItem,
  updateItem,
  updateAvailableItem,
};
