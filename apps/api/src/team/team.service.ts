import { Injectable } from "@nestjs/common";
import { prisma } from "@/database";

@Injectable()
export class TeamService {
  async findAllEmployees() {
    return prisma.employee.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } });
  }

  async createEmployee(data: any) {
    return prisma.employee.create({ data });
  }

  async getTeamStats() {
    const employees = await prisma.employee.findMany({ where: { deletedAt: null } });
    return {
      total: employees.length,
      active: employees.filter((e) => e.isActive).length,
      byDepartment: employees.reduce((acc, e) => {
        const dept = e.department || "??? ????";
        if (!acc[dept]) acc[dept] = 0;
        acc[dept] += 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
