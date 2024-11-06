import type { Request, Response, NextFunction } from "express";
import type { CafeRepository } from "../repositories/cafe-repository";

export class CafeController {
  cafeRepository: CafeRepository;

  constructor(cafeRepository: CafeRepository) {
    this.cafeRepository = cafeRepository;
  }

  async getCafes(req: Request, res: Response, next: NextFunction) {
    try {
      const cafes = await this.cafeRepository.findAll();
      return res.json({ data: cafes });
    } catch (error) {
      next(error);
    }
  }

  async getCafe(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const cafe = await this.cafeRepository.find(id);
      if (!cafe) {
        return res.status(404).json({ message: "Cafe not found" });
      }
      return res.json({ data: cafe });
    } catch (error) {
      next(error);
    }
  }
}
