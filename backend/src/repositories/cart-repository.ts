import type { Items, PrismaClient } from "@prisma/client";

export class CartRepository {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(customerId: string) {
    return this.prisma.carts.findMany({
      where: { customer_id: customerId },
    });
  }

  async findAllCartItems(cafeId: string, customerId: string) {
    return this.prisma.carts.findUnique({
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

  async save(
    cafeId: string,
    customerId: string,
    itemId: string,
    price: number,
    quantity: number,
    isNote: boolean,
    note: string | null,
  ) {
    return this.prisma.carts.upsert({
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

  async decreaseQuantity(
    cafeId: string,
    customerId: string,
    item: Items,
    isNote: boolean,
    quantity: number,
  ) {
    return this.prisma.carts.update({
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
}
