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

export default {
  getCafes,
  getCafe,
};
