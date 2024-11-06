import type { PrismaClient } from "@prisma/client";

export class CafeRepository {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.cafes.findMany({
      orderBy: { is_open: "desc" },
    });
  }

  async find(id: string) {
    return this.prisma.cafes.findUnique({
      where: { id: id },
    });
  }
}
