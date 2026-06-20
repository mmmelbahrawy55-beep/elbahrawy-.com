import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@/database";

@Injectable()
export class PortfolioService {
  async findAll() {
    return prisma.portfolio.findMany({ where: { deletedAt: null } });
  }

  async findOne(id: string) {
    const item = await prisma.portfolio.findUnique({ where: { id, deletedAt: null } });
    if (!item) throw new NotFoundException("Portfolio item not found");
    return item;
  }

  async create(data: any) {
    return prisma.portfolio.create({ data });
  }

  async update(id: string, data: any) {
    return prisma.portfolio.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.portfolio.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
