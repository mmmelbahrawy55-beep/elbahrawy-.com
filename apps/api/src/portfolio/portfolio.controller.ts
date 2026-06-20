import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { PortfolioService } from "./portfolio.service";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";

@Controller("portfolio")
export class PortfolioController {
  constructor(private service: PortfolioService) {}

  @Get()
  async findAll() {
    return { success: true, data: await this.service.findAll() };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return { success: true, data: await this.service.findOne(id) };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: any) {
    return { success: true, data: await this.service.create(body) };
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @Body() body: any) {
    return { success: true, data: await this.service.update(id, body) };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string) {
    return { success: true, data: await this.service.delete(id) };
  }
}
