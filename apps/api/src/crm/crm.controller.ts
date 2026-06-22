import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from "@nestjs/common";
import { CrmService } from "./crm.service";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";

@Controller("crm")
@UseGuards(JwtAuthGuard)
export class CrmController {
  constructor(private service: CrmService) {}

  @Get("clients")
  async clients() {
    return { success: true, data: await this.service.findAllClients() };
  }

  @Get("clients/:id")
  async client(@Param("id") id: string) {
    return { success: true, data: await this.service.findOneClient(id) };
  }

  @Post("clients")
  async createClient(@Body() body: any) {
    return { success: true, data: await this.service.createClient(body) };
  }

  @Patch("clients/:id")
  async updateClient(@Param("id") id: string, @Body() body: any) {
    return { success: true, data: await this.service.updateClient(id, body) };
  }

  @Delete("clients/:id")
  async deleteClient(@Param("id") id: string) {
    return { success: true, data: await this.service.deleteClient(id) };
  }

  // ===== SUPPLIERS =====
  @Get("suppliers")
  async suppliers() {
    return { success: true, data: await this.service.findAllSuppliers() };
  }

  @Get("suppliers/:id")
  async supplier(@Param("id") id: string) {
    return { success: true, data: await this.service.findOneSupplier(id) };
  }

  @Post("suppliers")
  async createSupplier(@Body() body: any) {
    return { success: true, data: await this.service.createSupplier(body) };
  }

  @Patch("suppliers/:id")
  async updateSupplier(@Param("id") id: string, @Body() body: any) {
    return { success: true, data: await this.service.updateSupplier(id, body) };
  }

  @Delete("suppliers/:id")
  async deleteSupplier(@Param("id") id: string) {
    return { success: true, data: await this.service.deleteSupplier(id) };
  }

  @Get("deals")
  async deals() {
    return { success: true, data: await this.service.findAllDeals() };
  }

  @Post("deals")
  async createDeal(@Req() req: any, @Body() body: any) {
    return { success: true, data: await this.service.createDeal(req.user.userId, body) };
  }

  @Get("stats")
  async stats() {
    return { success: true, data: await this.service.getCrmStats() };
  }
}
