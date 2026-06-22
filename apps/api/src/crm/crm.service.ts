import { Injectable } from "@nestjs/common";
import { prisma } from "@/database";

@Injectable()
export class CrmService {
  // ===== CLIENTS =====
  async findAllClients() {
    return prisma.client.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } });
  }

  async findOneClient(id: string) {
    return prisma.client.findUnique({ where: { id } });
  }

  async createClient(data: any) {
    return prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        address: data.address,
        status: data.status || "Active",
        notes: data.notes,
      },
    });
  }

  async updateClient(id: string, data: any) {
    return prisma.client.update({ where: { id }, data });
  }

  async deleteClient(id: string) {
    return prisma.client.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ===== DEALS =====
  async findAllDeals() {
    return prisma.deal.findMany({
      where: { deletedAt: null },
      include: { client: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async createDeal(userId: string, data: any) {
    return prisma.deal.create({
      data: {
        name: data.name,
        clientId: data.clientId,
        value: Number(data.value) || 0,
        stage: data.stage || "Discovery",
        probability: Number(data.probability) || 50,
        assignedTo: userId,
      },
    });
  }

  // ===== STATS =====
  async getCrmStats() {
    const [clients, deals] = await Promise.all([
      prisma.client.findMany({ where: { deletedAt: null } }),
      prisma.deal.findMany({ where: { deletedAt: null } }),
    ]);
    return {
      totalClients: clients.length,
      totalDeals: deals.length,
      totalDealValue: deals.reduce((acc, d) => acc + Number(d.value), 0),
      wonDeals: deals.filter((d) => d.stage === "Won").length,
    };
  }
}
