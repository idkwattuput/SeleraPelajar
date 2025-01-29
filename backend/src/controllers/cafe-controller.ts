import type { Request, Response, NextFunction } from "express";
import cafeRepository from "../repositories/cafe-repository";
import itemRepository from "../repositories/item-repository";

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

async function getCafeBySellerId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as any).user.id;
    const cafe = await cafeRepository.findBySellerId(userId);
    if (!cafe) {
      return res.status(404).json({ message: "Cafe not found" });
    }
    return res.json({ data: cafe });
  } catch (error) {
    next(error);
  }
}

async function getItemsByCafeId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as any).user.id;
    const items = await itemRepository.findBySellerId(userId);
    return res.json({ data: items });
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

async function updateCafe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const { name, block, lot, description } = req.body;
    if (!name || !block || !lot) {
      return res.status(400).json({ message: "All field are required" });
    }
    const isCafeExist = await cafeRepository.findBySellerId(userId);
    if (!isCafeExist) {
      return res.status(404).json({ message: "Cafe not found" });
    }
    const updatedCafe = await cafeRepository.update(
      isCafeExist.id,
      name,
      description,
      block,
      lot,
    );
    return res.json({ data: updatedCafe });
  } catch (error) {
    next(error);
  }
}

async function updateCafeImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as any).user.id;
    const cafeImage = req.file?.filename || null;
    if (!cafeImage) {
      return res.status(400).json({ message: "All field are required" });
    }
    const isCafeExist = await cafeRepository.findBySellerId(userId);
    if (!isCafeExist) {
      return res.status(404).json({ message: "Cafe not found" });
    }
    const updatedCafe = await cafeRepository.updateImage(
      isCafeExist.id,
      cafeImage,
    );
    return res.json({ data: updatedCafe });
  } catch (error) {
    next(error);
  }
}

async function updateCafeOpen(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const { isOpen } = req.body;
    if (typeof isOpen !== "boolean") {
      return res.status(400).json({ message: "All field are required" });
    }
    const isCafeExist = await cafeRepository.find(id);
    if (!isCafeExist) {
      return res.status(404).json({ message: "Cafe not found" });
    }
    const updatedCafe = await cafeRepository.updateOpen(id, isOpen);
    return res.json({ data: updatedCafe });
  } catch (error) {
    next(error);
  }
}

export default {
  getCafes,
  getCafe,
  getCafeBySellerId,
  getItemsByCafeId,
  createCafe,
  updateCafe,
  updateCafeImage,
  updateCafeOpen,
};
