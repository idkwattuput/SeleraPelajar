import { prisma } from "../database/db";
import type { OrderStatus } from "@prisma/client";

async function findAllCurrentOrder(customerId: string) {
  return prisma.orders.findMany({
    where: {
      customer_id: customerId,
      status: { notIn: ["COMPLETED", "CANCELLED"] },
    },
    include: {
      cafe: true,
      OrderItems: true,
    },
    orderBy: {
      created_at: "asc",
    },
  });
}

async function find(id: string) {
  return prisma.orders.findUnique({
    where: { id: id },
    include: {
      cafe: true,
      OrderItems: {
        include: {
          item: true,
        },
      },
    },
  });
}

async function save(cafeId: string, customerId: string) {
  return prisma.$transaction(async (p) => {
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

    if (!findCart) {
      throw new Error("Cart not found");
    }

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

    await p.carts.delete({
      where: {
        cafe_id_customer_id: {
          cafe_id: cafeId,
          customer_id: customerId,
        },
      },
    });

    return newOrder;
  });
}

async function update(id: string, status: OrderStatus) {
  return prisma.orders.update({
    where: { id: id },
    data: {
      status: status,
    },
    include: {
      cafe: true,
      OrderItems: {
        include: {
          item: true,
        },
      },
    },
  });
}

export default {
  findAllCurrentOrder,
  find,
  save,
  update,
};
