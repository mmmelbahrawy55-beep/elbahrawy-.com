import { Controller, Post, Get, Body, UseGuards, Req } from "@nestjs/common";
import { AiService, AIResponse } from "./ai.service";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";

@Controller("ai")
export class AiController {
  constructor(private aiService: AiService) {}

  @Post("command")
  @UseGuards(JwtAuthGuard)
  async processCommand(@Req() req: any, @Body() body: { message: string }): Promise<AIResponse> {
    return this.aiService.processCommand(req.user.userId, body.message);
  }

  @Post("chat")
  @UseGuards(JwtAuthGuard)
  async chat(@Req() req: any, @Body() body: { message: string }): Promise<any> {
    return this.aiService.sendChatMessage(req.user.userId, body.message);
  }

  @Get("insights")
  @UseGuards(JwtAuthGuard)
  async insights(@Req() req: any): Promise<AIResponse> {
    return this.aiService.generateAiInsights(req.user.userId);
  }
}
