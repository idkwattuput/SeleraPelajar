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
      OrderItems: {
        include: {
          item: true
        }
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });
}

async function findAllCurrentOrderSeller(cafeId: string) {
  return prisma.orders.findMany({
    where: {
      cafe_id: cafeId,
      status: { notIn: ["COMPLETED", "CANCELLED"] },
    },
    include: {
      customer: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
      OrderItems: true,
    },
    orderBy: {
      status: "asc",
    },
  });
}

async function findAllHistoryOrder(customerId: string) {
  return prisma.orders.findMany({
    where: {
      customer_id: customerId,
      status: { in: ["COMPLETED", "CANCELLED"] },
    },
    include: {
      cafe: true,
      OrderItems: {
        include: {
          item: true
        }
      },
    },
    orderBy: {
      created_at: "desc",
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

async function countByDate(cafeId: string, minDate: Date, maxDate: Date) {
  return await prisma.orders.count({
    where: {
      cafe_id: cafeId,
      created_at: { gte: minDate, lte: maxDate },
      status: "COMPLETED",
    },
  });
}

async function revenueSum(cafeId: string, today: Date) {
  const result = await prisma.orders.aggregate({
    _sum: {
      total_price: true,
    },
    where: {
      cafe_id: cafeId,
      created_at: {
        gte: today,
      },
      status: "COMPLETED",
    },
  });
  return result._sum.total_price || 0;
}

async function findPopularItem(cafeId: string) {
  const result = await prisma.orderItems.groupBy({
    by: ["item_id"],
    where: { order: { cafe_id: cafeId } },
    _sum: { quantity: true },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 1,
  });

  if (result.length > 0) {
    return prisma.items.findUnique({
      where: { id: result[0].item_id },
    });
  }
  return null;
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
        customer: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
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
      customer: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
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
  findAllCurrentOrderSeller,
  findAllHistoryOrder,
  find,
  countByDate,
  revenueSum,
  findPopularItem,
  save,
  update,
};
