import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import userRepository from "../repositories/user-repository";

async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const user = await userRepository.find(userId);
    return res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const updatedUser = await userRepository.update(
      userId,
      firstName,
      lastName,
      email,
    );
    return res.json({ data: updatedUser });
  } catch (error) {
    next(error);
  }
}

async function updatePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isUserExist = await userRepository.findPasswordByUserId(userId);
    if (!isUserExist) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      isUserExist.password,
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const hashPassword = await bcrypt.hash(newPassword, 12);
    const updatedUser = await userRepository.updatePassword(
      userId,
      hashPassword,
    );
    return res.json({ data: updatedUser });
  } catch (error) {
    next(error);
  }
}

export default {
  getUser,
  updateUser,
  updatePassword,
};
