import { prisma } from "../database/db";
import type { Items } from "@prisma/client";

async function findAll(customerId: string) {
  return prisma.carts.findMany({
    where: { customer_id: customerId },
    include: {
      cafe: true,
      CartItems: true,
    },
  });
}

async function findAllCartItems(cafeId: string, customerId: string) {
  return prisma.carts.findUnique({
    where: {
      cafe_id_customer_id: {
        cafe_id: cafeId,
        customer_id: customerId,
      },
      status: "ACTIVE",
    },
    include: {
      CartItems: {
        include: {
          item: true,
        },
        orderBy: { created_at: "asc" },
      },
    },
  });
}

async function save(
  cafeId: string,
  customerId: string,
  itemId: string,
  price: number,
  quantity: number,
  isNote: boolean,
  note: string | null,
) {
  return prisma.carts.upsert({
    where: {
      cafe_id_customer_id: {
        cafe_id: cafeId,
        customer_id: customerId,
      },
      status: "ACTIVE",
    },
    create: {
      total_price: quantity * price,
      status: "ACTIVE",
      customer_id: customerId,
      cafe_id: cafeId,
      CartItems: {
        create: {
          quantity: quantity,
          is_note: isNote,
          note: note,
          item_id: itemId,
        },
      },
    },
    update: {
      total_price: { increment: quantity * price },
      CartItems: {
        upsert: {
          where: {
            cafe_id_customer_id_item_id_is_note: {
              cafe_id: cafeId,
              customer_id: customerId,
              item_id: itemId,
              is_note: isNote,
            },
          },
          create: {
            quantity: quantity,
            is_note: isNote,
            note: note,
            item_id: itemId,
          },
          update: {
            quantity: { increment: quantity },
            is_note: isNote,
            note: note,
          },
        },
      },
    },
    include: {
      CartItems: {
        include: {
          item: true,
        },
        orderBy: { created_at: "asc" },
      },
    },
  });
}

async function decreaseQuantity(
  cafeId: string,
  customerId: string,
  item: Items,
  isNote: boolean,
  quantity: number,
) {
  return prisma.carts.update({
    where: {
      cafe_id_customer_id: {
        cafe_id: cafeId,
        customer_id: customerId,
      },
      status: "ACTIVE",
    },
    data: {
      total_price: { decrement: Number(item.price) * quantity },
      CartItems: {
        update: {
          where: {
            cafe_id_customer_id_item_id_is_note: {
              cafe_id: cafeId,
              customer_id: customerId,
              item_id: item.id,
              is_note: isNote,
            },
          },
          data: {
            quantity: { decrement: quantity },
          },
        },
        deleteMany: {
          cafe_id: cafeId,
          customer_id: customerId,
          item_id: item.id,
          is_note: isNote,
          quantity: 0,
        },
      },
    },
    include: {
      CartItems: {
        include: {
          item: true,
        },
        orderBy: { created_at: "asc" },
      },
    },
  });
}

export default {
  findAll,
  findAllCartItems,
  save,
  decreaseQuantity,
};
