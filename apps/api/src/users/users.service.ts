import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@/database";

@Injectable()
export class UsersService {
  async findAll() {
    return prisma.user.findMany({ where: { deletedAt: null } });
  }

  async findOne(id: string) {
    const user = await prisma.user.findUnique({ where: { id, deletedAt: null } });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}
