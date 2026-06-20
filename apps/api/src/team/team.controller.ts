import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { TeamService } from "./team.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("team")
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(private service: TeamService) {}

  @Get("employees")
  async employees() {
    return { success: true, data: await this.service.findAllEmployees() };
  }

  @Post("employees")
  async create(@Body() body: any) {
    return { success: true, data: await this.service.createEmployee(body) };
  }

  @Get("stats")
  async stats() {
    return { success: true, data: await this.service.getTeamStats() };
  }
}
