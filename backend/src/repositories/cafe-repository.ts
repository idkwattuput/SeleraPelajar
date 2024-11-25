import { prisma } from "../database/db";

async function findAll() {
  return prisma.cafes.findMany({
    orderBy: { is_open: "desc" },
  });
}

async function find(id: string) {
  return await prisma.cafes.findUnique({
    where: { id: id },
    include: {
      Items: {
        include: {
          category: true,
        },
        orderBy: [{ is_available: "desc" }, { category: { name: "asc" } }],
      },
    },
  });
}

async function findBySellerId(sellerId: string) {
  return await prisma.cafes.findUnique({
    where: { seller_id: sellerId },
  });
}

async function isValid(name: string, block: string, lot: string) {
  const existingCafe = await prisma.cafes.findFirst({
    where: {
      OR: [{ name: name }, { block: block, lot: lot }],
    },
    select: {
      name: true,
      block: true,
      lot: true,
    },
  });

  if (!existingCafe) {
    return { isValid: true };
  }

  return {
    isValid: false,
    reason: {
      nameExists: existingCafe.name === name,
      blockLotExists: existingCafe.block === block && existingCafe.lot === lot,
    },
  };
}

async function save(
  sellerId: string,
  name: string,
  block: string,
  lot: string,
  description: string,
  cafeImage: string | null,
) {
  return await prisma.cafes.create({
    data: {
      seller_id: sellerId,
      name: name,
      description: description,
      image: cafeImage,
      block: block,
      lot: lot,
    },
  });
}

export default {
  findAll,
  find,
  findBySellerId,
  isValid,
  save,
};
