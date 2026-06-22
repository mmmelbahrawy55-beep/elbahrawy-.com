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
        projectDetails: data.projectDetails,
        totalAmount: Number(data.totalAmount) || 0,
        paidAmount: Number(data.paidAmount) || 0,
        remainingAmount: (Number(data.totalAmount) || 0) - (Number(data.paidAmount) || 0),
        status: data.status || "pending",
        orderDate: data.orderDate ? new Date(data.orderDate) : new Date(),
      },
    });
  }

  async updateClient(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.totalAmount !== undefined || data.paidAmount !== undefined) {
      const current = await prisma.client.findUnique({ where: { id } });
      const total = data.totalAmount !== undefined ? Number(data.totalAmount) : Number(current?.totalAmount || 0);
      const paid = data.paidAmount !== undefined ? Number(data.paidAmount) : Number(current?.paidAmount || 0);
      updateData.remainingAmount = total - paid;
      updateData.totalAmount = total;
      updateData.paidAmount = paid;
    }
    if (data.orderDate) updateData.orderDate = new Date(data.orderDate);
    return prisma.client.update({ where: { id }, data: updateData });
  }

  async deleteClient(id: string) {
    return prisma.client.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ===== SUPPLIERS =====
  async findAllSuppliers() {
    return prisma.supplier.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } });
  }

  async findOneSupplier(id: string) {
    return prisma.supplier.findUnique({ where: { id } });
  }

  async createSupplier(data: any) {
    return prisma.supplier.create({
      data: {
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        phone: data.phone,
        orderDetails: data.orderDetails,
        totalAmount: Number(data.totalAmount) || 0,
        paidAmount: Number(data.paidAmount) || 0,
        remainingAmount: (Number(data.totalAmount) || 0) - (Number(data.paidAmount) || 0),
        orderDate: data.orderDate ? new Date(data.orderDate) : new Date(),
      },
    });
  }

  async updateSupplier(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.totalAmount !== undefined || data.paidAmount !== undefined) {
      const current = await prisma.supplier.findUnique({ where: { id } });
      const total = data.totalAmount !== undefined ? Number(data.totalAmount) : Number(current?.totalAmount || 0);
      const paid = data.paidAmount !== undefined ? Number(data.paidAmount) : Number(current?.paidAmount || 0);
      updateData.remainingAmount = total - paid;
      updateData.totalAmount = total;
      updateData.paidAmount = paid;
    }
    if (data.orderDate) updateData.orderDate = new Date(data.orderDate);
    return prisma.supplier.update({ where: { id }, data: updateData });
  }

  async deleteSupplier(id: string) {
    return prisma.supplier.update({ where: { id }, data: { deletedAt: new Date() } });
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
