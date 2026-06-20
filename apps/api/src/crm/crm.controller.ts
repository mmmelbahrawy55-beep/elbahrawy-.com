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
