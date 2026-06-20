import { Injectable } from "@nestjs/common";
import { prisma } from "@/database";

@Injectable()
export class ProjectsService {
  async findAll() {
    return prisma.project.findMany({ where: { deletedAt: null } });
  }
}
