import type { PrismaClient } from "@prisma/client";

export class OrderRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async save(cafeId: string, customerId: string) {
    return this.prisma.$transaction(async (p) => {
      const findCart = await p.carts.findUnique({
        where: {
          cafe_id_customer_id: {
            cafe_id: cafeId,
            customer_id: customerId,
          },
        },
        include: {
          CartItems: true,
        },
      });

      const newOrder = await p.orders.create({
        data: {
          total_price: findCart.total_price,
          status: "PENDING",
          customer_id: findCart.customer_id,
          cafe_id: findCart.cafe_id,
          OrderItems: {
            create: findCart.CartItems.map((cartItem) => ({
              quantity: cartItem.quantity,
              note: cartItem.note,
              item_id: cartItem.item_id,
            })),
          },
        },
        include: {
          OrderItems: {
            include: {
              item: true,
            },
          },
        },
      });

      await p.carts.update({
        where: {
          cafe_id_customer_id: {
            cafe_id: cafeId,
            customer_id: customerId,
          },
        },
        data: {
          status: "ORDERED",
        },
      });

      return newOrder;
    });
  }
}
