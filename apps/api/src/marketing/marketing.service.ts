import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { prisma } from "@/database";

@Injectable()
export class MarketingService {
  // ============ CAMPAIGNS ============
  async findAllCampaigns(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where: { deletedAt: null },
        include: { ads: { where: { deletedAt: null } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.campaign.count({ where: { deletedAt: null } }),
    ]);

    return {
      data: campaigns.map((c) => {
        const totalReach = c.ads.reduce((acc, a) => acc + a.reach, 0);
        const totalClicks = c.ads.reduce((acc, a) => acc + a.clicks, 0);
        const totalConversions = c.ads.reduce((acc, a) => acc + a.conversions, 0);
        return {
          ...c,
          budget: Number(c.budget),
          spent: Number(c.spent),
          revenue: Number(c.revenue),
          roi: Number(c.spent) > 0 ? Number((Number(c.revenue) / Number(c.spent)).toFixed(2)) : 0,
          adCount: c.ads.length,
          ctr: totalReach > 0 ? Number(((totalClicks / totalReach) * 100).toFixed(2)) : 0,
          conversionRate: totalClicks > 0 ? Number(((totalConversions / totalClicks) * 100).toFixed(2)) : 0,
        };
      }),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findCampaignById(id: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { id, deletedAt: null },
      include: {
        ads: { where: { deletedAt: null }, orderBy: { createdAt: "desc" } },
      },
    });
    if (!campaign) throw new NotFoundException("Campaign not found");

    const totalReach = campaign.ads.reduce((acc, a) => acc + a.reach, 0);
    const totalClicks = campaign.ads.reduce((acc, a) => acc + a.clicks, 0);

    return {
      ...campaign,
      budget: Number(campaign.budget),
      spent: Number(campaign.spent),
      revenue: Number(campaign.revenue),
      roi: Number(campaign.spent) > 0 ? Number((Number(campaign.revenue) / Number(campaign.spent)).toFixed(2)) : 0,
      ctr: totalReach > 0 ? Number(((totalClicks / totalReach) * 100).toFixed(2)) : 0,
    };
  }

  async createCampaign(data: { name: string; type: string; description?: string; budget: number; createdById: string }) {
    if (!data.name || !data.type || !data.budget) {
      throw new BadRequestException("Name, type, and budget are required");
    }

    return prisma.campaign.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        budget: Number(data.budget),
        status: "Draft",
        createdById: data.createdById,
      },
    });
  }

  async updateCampaign(id: string, data: any) {
    return prisma.campaign.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.status && { status: data.status }),
        ...(data.description && { description: data.description }),
        ...(data.budget && { budget: Number(data.budget) }),
        ...(data.spent !== undefined && { spent: Number(data.spent) }),
        ...(data.revenue !== undefined && { revenue: Number(data.revenue) }),
      },
    });
  }

  async deleteCampaign(id: string) {
    return prisma.campaign.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ============ ADS ============
  async findAllAds(campaignId?: string) {
    return prisma.ad.findMany({
      where: { deletedAt: null, ...(campaignId && { campaignId }) },
      include: { campaign: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async createAd(data: { campaignId: string; platform: string; title: string; budget: number; description?: string }) {
    return prisma.ad.create({
      data: {
        campaignId: data.campaignId,
        platform: data.platform,
        title: data.title,
        description: data.description,
        budget: Number(data.budget),
        spent: 0,
        status: "Draft",
      },
    });
  }

  async updateAd(id: string, data: any) {
    return prisma.ad.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.status && { status: data.status }),
        ...(data.budget && { budget: Number(data.budget) }),
        ...(data.spent !== undefined && { spent: Number(data.spent) }),
        ...(data.reach !== undefined && { reach: Number(data.reach) }),
        ...(data.clicks !== undefined && { clicks: Number(data.clicks) }),
        ...(data.conversions !== undefined && { conversions: Number(data.conversions) }),
      },
    });
  }

  async deleteAd(id: string) {
    return prisma.ad.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ============ AUTOMATIONS ============
  async findAllAutomations() {
    return prisma.automation.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } });
  }

  async createAutomation(data: { name: string; trigger: string; action: string; config?: any; createdById: string }) {
    return prisma.automation.create({
      data: {
        name: data.name,
        trigger: data.trigger,
        action: data.action,
        config: data.config ? JSON.stringify(data.config) : null,
        isActive: true,
        createdById: data.createdById,
      },
    });
  }

  async updateAutomation(id: string, data: any) {
    return prisma.automation.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.trigger && { trigger: data.trigger }),
        ...(data.action && { action: data.action }),
      },
    });
  }

  async deleteAutomation(id: string) {
    return prisma.automation.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ============ LEADS ============
  async findAllLeads() {
    return prisma.lead.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } });
  }

  async createLead(data: any) {
    return prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        source: data.source || "Website",
        status: data.status || "New",
        score: Number(data.score) || 50,
        assignedTo: data.assignedTo,
        value: Number(data.value) || 0,
      },
    });
  }

  async updateLead(id: string, data: any) {
    return prisma.lead.update({ where: { id }, data });
  }

  async deleteLead(id: string) {
    return prisma.lead.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ============ DASHBOARD / ANALYTICS ============
  async getDashboardStats() {
    const [campaigns, ads, leads, automations, clients, products] = await Promise.all([
      prisma.campaign.findMany({ where: { deletedAt: null }, include: { ads: true } }),
      prisma.ad.findMany({ where: { deletedAt: null } }),
      prisma.lead.findMany({ where: { deletedAt: null } }),
      prisma.automation.findMany({ where: { deletedAt: null } }),
      prisma.client.findMany({ where: { deletedAt: null } }),
      prisma.product.findMany({ where: { deletedAt: null } }),
    ]);

    const totalRevenue = campaigns.reduce((acc, c) => acc + Number(c.revenue), 0);
    const totalSpent = campaigns.reduce((acc, c) => acc + Number(c.spent), 0);
    const totalReach = ads.reduce((acc, a) => acc + a.reach, 0);
    const totalClicks = ads.reduce((acc, a) => acc + a.clicks, 0);
    const totalConversions = ads.reduce((acc, a) => acc + a.conversions, 0);
    const activeAds = ads.filter((a) => a.status === "Active").length;
    const activeCampaigns = campaigns.filter((c) => c.status === "Active").length;
    const activeAutomations = automations.filter((a) => a.isActive).length;

    return {
      totalCampaigns: campaigns.length,
      activeCampaigns,
      totalAds: ads.length,
      activeAds,
      totalLeads: leads.length,
      totalClients: clients.length,
      totalProducts: products.length,
      activeAutomations,
      totalRevenue,
      totalSpent,
      netProfit: totalRevenue - totalSpent,
      roi: totalSpent > 0 ? Number((totalRevenue / totalSpent).toFixed(2)) : 0,
      totalReach,
      totalClicks,
      totalConversions,
      ctr: totalReach > 0 ? Number(((totalClicks / totalReach) * 100).toFixed(2)) : 0,
      conversionRate: totalClicks > 0 ? Number(((totalConversions / totalClicks) * 100).toFixed(2)) : 0,
    };
  }

  async getBudgetOverview() {
    const campaigns = await prisma.campaign.findMany({ where: { deletedAt: null } });
    const totalBudget = campaigns.reduce((acc, c) => acc + Number(c.budget), 0);
    const totalSpent = campaigns.reduce((acc, c) => acc + Number(c.spent), 0);

    return {
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      utilization: totalBudget > 0 ? Number(((totalSpent / totalBudget) * 100).toFixed(1)) : 0,
      campaigns: campaigns.map((c) => ({
        id: c.id,
        name: c.name,
        budget: Number(c.budget),
        spent: Number(c.spent),
        status: c.status,
      })),
    };
  }

  // ============ SOCIAL MEDIA CONNECTIONS ============
  async getSocialMediaConnections(userId: string) {
    return prisma.socialMediaConnection.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }

  async createSocialMediaConnection(data: {
    userId: string;
    platform: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
    pageId?: string;
    pageName?: string;
    phoneNumber?: string;
  }) {
    const existing = await prisma.socialMediaConnection.findFirst({
      where: { userId: data.userId, platform: data.platform, deletedAt: null },
    });
    if (existing) {
      return prisma.socialMediaConnection.update({
        where: { id: existing.id },
        data: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
          pageId: data.pageId,
          pageName: data.pageName,
          phoneNumber: data.phoneNumber,
          isActive: true,
        },
      });
    }
    return prisma.socialMediaConnection.create({
      data: {
        userId: data.userId,
        platform: data.platform,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        pageId: data.pageId,
        pageName: data.pageName,
        phoneNumber: data.phoneNumber,
        isActive: true,
      },
    });
  }

  async deleteSocialMediaConnection(userId: string, id: string) {
    return prisma.socialMediaConnection.update({
      where: { id, userId },
      data: { deletedAt: new Date() },
    });
  }
}
