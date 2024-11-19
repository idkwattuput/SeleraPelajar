import { prisma } from "../database/db";

async function findAll() {
  return prisma.cafes.findMany({
    orderBy: { is_open: "desc" },
  });
}

async function find(id: string) {
  return prisma.cafes.findUnique({
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

export default {
  findAll,
  find,
};
