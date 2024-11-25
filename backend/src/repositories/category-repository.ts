import { prisma } from "../database/db";

async function findByCafeId(cafeId: string) {
  return await prisma.category.findMany({
    where: { cafe_id: cafeId },
  });
}

async function save(cafeId: string, name: string) {
  return await prisma.category.create({
    data: {
      name: name,
      cafe_id: cafeId,
    },
  });
}

export default {
  findByCafeId,
  save,
};
