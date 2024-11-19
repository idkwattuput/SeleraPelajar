import type { Request, Response, NextFunction } from "express";
import cafeRepository from "../repositories/cafe-repository";

async function getCafes(req: Request, res: Response, next: NextFunction) {
  try {
    const cafes = await cafeRepository.findAll();
    return res.json({ data: cafes });
  } catch (error) {
    next(error);
  }
}

async function getCafe(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const cafe = await cafeRepository.find(id);
    if (!cafe) {
      return res.status(404).json({ message: "Cafe not found" });
    }
    return res.json({ data: cafe });
  } catch (error) {
    next(error);
  }
}

async function createCafe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const { name, block, lot, description } = req.body;
    const cafeImage = req.file?.filename || null;
    if (!name || !block || !lot) {
      return res.status(400).json({ message: "All field are required" });
    }
    const isValid = await cafeRepository.isValid(name, block, lot);
    if (!isValid.isValid) {
      isValid.reason?.nameExists
        ? res.status(400).json({ message: "Cafe name already exist" })
        : res.status(400).json({ message: "Block and lot already exist" });
    }
    const newCafe = await cafeRepository.save(
      userId,
      name,
      block,
      lot,
      description,
      cafeImage,
    );
    return res.status(201).json({ data: newCafe });
  } catch (error) {
    next(error);
  }
}

export default {
  getCafes,
  getCafe,
  createCafe,
};
