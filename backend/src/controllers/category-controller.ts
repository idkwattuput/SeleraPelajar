import type { Request, Response, NextFunction } from "express";
import cafeRepository from "../repositories/cafe-repository";
import categoryRepository from "../repositories/category-repository";

async function getCategoriesByCafeId(
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
    const categories = await categoryRepository.findByCafeId(isCafeExist.id);
    return res.json({ data: categories });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isCafeExist = await cafeRepository.findBySellerId(userId);
    if (!isCafeExist) {
      return res.status(404).json({ message: "Cafe not found" });
    }
    const newCategory = await categoryRepository.save(isCafeExist.id, name);
    return res.status(201).json({ data: newCategory });
  } catch (error) {
    next(error);
  }
}

export default {
  getCategoriesByCafeId,
  createCategory,
};
