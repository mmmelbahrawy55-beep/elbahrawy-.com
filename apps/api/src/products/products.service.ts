import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@/database";

@Injectable()
export class ProductsService {
  async findAll() {
    return prisma.product.findMany({ where: { deletedAt: null } });
  }

  async findOne(id: string) {
    const product = await prisma.product.findUnique({ where: { id, deletedAt: null } });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async create(data: any) {
    return prisma.product.create({ data });
  }

  async update(id: string, data: any) {
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
