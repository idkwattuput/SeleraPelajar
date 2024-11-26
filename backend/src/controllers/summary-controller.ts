import type { Request, Response, NextFunction } from "express";
import orderRepository from "../repositories/order-repository";
import cafeRepository from "../repositories/cafe-repository";

async function getSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const isCafeExist = await cafeRepository.findBySellerId(userId);
    if (!isCafeExist) {
      return res.status(404).json({ message: "Cafe not found" });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = today.getDay();
    // Calculate the most recent Monday
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // Adjust to Monday (day 1)
    // Calculate the upcoming Sunday
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6); // Add 6 days to get to Sunday
    const [orderToday, revenueToday, orderWeek, popularItem] =
      await Promise.all([
        await orderRepository.countByDate(isCafeExist.id, today, new Date()),
        await orderRepository.revenueSum(isCafeExist.id, today),
        await orderRepository.countByDate(isCafeExist.id, monday, sunday),
        await orderRepository.findPopularItem(isCafeExist.id),
      ]);

    return res.json({
      data: {
        order_today: orderToday || 0,
        revenue_today: revenueToday || "0.00",
        order_week: orderWeek || 0,
        popular_item: popularItem || "none",
      },
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getSummary,
};
