import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from "@nestjs/common";
import { MarketingService } from "./marketing.service";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";

@Controller("marketing")
@UseGuards(JwtAuthGuard)
export class MarketingController {
  constructor(private service: MarketingService) {}

  // ===== DASHBOARD =====
  @Get("dashboard")
  async dashboard() {
    const data = await this.service.getDashboardStats();
    return { success: true, data };
  }

  @Get("budget")
  async budget() {
    const data = await this.service.getBudgetOverview();
    return { success: true, data };
  }

  // ===== CAMPAIGNS =====
  @Get("campaigns")
  async campaigns(@Query("page") page = "1", @Query("limit") limit = "20") {
    const data = await this.service.findAllCampaigns(parseInt(page), parseInt(limit));
    return { success: true, data };
  }

  @Get("campaigns/:id")
  async campaign(@Param("id") id: string) {
    const data = await this.service.findCampaignById(id);
    return { success: true, data };
  }

  @Post("campaigns")
  async createCampaign(@Req() req: any, @Body() body: any) {
    const data = await this.service.createCampaign({ ...body, createdById: req.user.userId });
    return { success: true, data };
  }

  @Patch("campaigns/:id")
  async updateCampaign(@Param("id") id: string, @Body() body: any) {
    const data = await this.service.updateCampaign(id, body);
    return { success: true, data };
  }

  @Delete("campaigns/:id")
  async deleteCampaign(@Param("id") id: string) {
    const data = await this.service.deleteCampaign(id);
    return { success: true, data };
  }

  // ===== ADS =====
  @Get("ads")
  async ads(@Query("campaignId") campaignId?: string) {
    const data = await this.service.findAllAds(campaignId);
    return { success: true, data };
  }

  @Post("ads")
  async createAd(@Body() body: any) {
    const data = await this.service.createAd(body);
    return { success: true, data };
  }

  @Patch("ads/:id")
  async updateAd(@Param("id") id: string, @Body() body: any) {
    const data = await this.service.updateAd(id, body);
    return { success: true, data };
  }

  @Delete("ads/:id")
  async deleteAd(@Param("id") id: string) {
    const data = await this.service.deleteAd(id);
    return { success: true, data };
  }

  // ===== AUTOMATIONS =====
  @Get("automations")
  async automations() {
    const data = await this.service.findAllAutomations();
    return { success: true, data };
  }

  @Post("automations")
  async createAutomation(@Req() req: any, @Body() body: any) {
    const data = await this.service.createAutomation({ ...body, createdById: req.user.userId });
    return { success: true, data };
  }

  @Patch("automations/:id")
  async updateAutomation(@Param("id") id: string, @Body() body: any) {
    const data = await this.service.updateAutomation(id, body);
    return { success: true, data };
  }

  @Delete("automations/:id")
  async deleteAutomation(@Param("id") id: string) {
    const data = await this.service.deleteAutomation(id);
    return { success: true, data };
  }

  // ===== LEADS =====
  @Get("leads")
  async leads() {
    const data = await this.service.findAllLeads();
    return { success: true, data };
  }

  @Post("leads")
  async createLead(@Req() req: any, @Body() body: any) {
    const data = await this.service.createLead({ ...body, assignedTo: req.user.userId });
    return { success: true, data };
  }

  @Patch("leads/:id")
  async updateLead(@Param("id") id: string, @Body() body: any) {
    const data = await this.service.updateLead(id, body);
    return { success: true, data };
  }

  @Delete("leads/:id")
  async deleteLead(@Param("id") id: string) {
    const data = await this.service.deleteLead(id);
    return { success: true, data };
  }

  // ===== SOCIAL MEDIA CONNECTIONS =====
  @Get("connections")
  async connections(@Req() req: any) {
    const data = await this.service.getSocialMediaConnections(req.user.userId);
    return { success: true, data };
  }

  @Post("connections")
  async createConnection(@Req() req: any, @Body() body: any) {
    const data = await this.service.createSocialMediaConnection({
      ...body,
      userId: req.user.userId,
    });
    return { success: true, data };
  }

  @Delete("connections/:id")
  async deleteConnection(@Req() req: any, @Param("id") id: string) {
    const data = await this.service.deleteSocialMediaConnection(req.user.userId, id);
    return { success: true, data };
  }
}
