import { prisma } from "../database/db";

async function findBySellerId(sellerId: string) {
  return await prisma.$transaction(async (p) => {
    const isCafeExist = await p.cafes.findUnique({
      where: { seller_id: sellerId },
    });
    if (!isCafeExist) {
      return [];
    }
    return await p.items.findMany({
      where: { cafe_id: isCafeExist.id },
      include: {
        category: true,
      },
    });
  });
}

async function save(
  cafeId: string,
  name: string,
  description: string,
  price: string,
  categoryId: string,
  image: string | null,
) {
  return await prisma.items.create({
    data: {
      name: name,
      description: description,
      price: price,
      category_id: categoryId,
      cafe_id: cafeId,
      image: image,
    },
    include: {
      category: true,
    },
  });
}

async function updateAvailable(id: string, isAvailable: boolean) {
  return await prisma.items.update({
    where: { id: id },
    data: {
      is_available: isAvailable,
    },
    include: {
      category: true,
    },
  });
}

export default {
  findBySellerId,
  save,
  updateAvailable,
};
