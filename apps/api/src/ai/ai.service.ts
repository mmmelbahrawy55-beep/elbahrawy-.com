import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { prisma } from "@/database";
import * as https from "https";

interface AIResponse {
  success: boolean;
  message: string;
  action?: string;
  data?: any;
  result?: any;
}

export type { AIResponse };

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

@Injectable()
export class AiService {
  constructor(private config: ConfigService) {}

  // ==================== MAIN AI COMMAND PROCESSOR ====================
  // Try LLM first for any question, fall back to action patterns
  async processCommand(userId: string, message: string): Promise<AIResponse> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException("User not found");

    // Try LLM first (smart conversational AI)
    try {
      const llmReply = await this.callLLM(message, user.name);
      if (llmReply) {
        // If LLM reply contains an action tag, also try to execute it
        const actionMatch = llmReply.match(/\[ACTION:(\w+)\](.+?)\[\/ACTION\]/s);
        if (actionMatch) {
          const actionName = actionMatch[1];
          const actionPayload = actionMatch[2].trim();
          const result = await this.executeAction(userId, actionName, actionPayload);
          return {
            success: true,
            message: llmReply.replace(/\[ACTION:\w+\].+?\[\/ACTION\]/s, "").trim(),
            action: result.action,
            data: result.data,
            result: result.result,
          };
        }
        return { success: true, message: llmReply, action: "chat" };
      }
    } catch (e) {
      console.error("LLM failed, falling back to actions:", (e as Error).message);
    }

    // Fallback: action-based commands
    return this.actionFallback(userId, message);
  }

  // ==================== LLM CALL ====================
  private async callLLM(message: string, userName?: string): Promise<string | null> {
    const apiKey = this.config.get("LLM_API_KEY") || process.env.LLM_API_KEY;
    const apiBase = this.config.get("LLM_API_BASE") || process.env.LLM_API_BASE || "https://api.openai.com/v1";
    const model = this.config.get("LLM_MODEL") || process.env.LLM_MODEL || "gpt-4o-mini";

    if (!apiKey) return null;

    const systemPrompt = `أنت المساعد الذكي لمنصة ALBAHRAWY OS — نظام إدارة التسويق والمشاريع الاحترافي.
- اسمك "ALBAHRAWY AI"
- تتكلم بالعربي المصري بشكل ودود ومهني
- تقدر تساعد في: إنشاء حملات تسويقية، إدارة إعلانات Facebook/Google/Instagram، إدارة منتجات، عملاء، leads، مشاريع، تقارير، تحليلات ذكية
- لما المستخدم يطلب منك تنفذ إجراء، أرجع النصيحة أولاً وبعدين ضع ACTION tag بالشكل: [ACTION:create_campaign]{"name":"اسم","budget":10000}[/ACTION]
- لو سؤال عام أو استفسار، رد بالمعلومات مباشرة بدون ACTION tag
- استخدم إيموجي بشكل معتدل
- خليك مختصر ومفيد (3-5 أسطر في الغالب)

الإجراءات المتاحة:
- create_campaign: {"name":"...", "budget":10000, "type":"Digital"}
- create_ad: {"platform":"Facebook", "title":"...", "budget":5000}
- create_product: {"name":"...", "price":100, "stock":50}
- create_client: {"name":"...", "email":"..."}
- create_lead: {"name":"...", "email":"..."}
- create_project: {"name":"...", "budget":50000}
- navigate: {"page":"/marketing/campaigns"}

اسم المستخدم: ${userName || "المستخدم"}`;

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ];

    return new Promise((resolve, reject) => {
      const url = new URL(`${apiBase}/chat/completions`);
      const body = JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 800 });

      const req = https.request(
        {
          hostname: url.hostname,
          path: url.pathname,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "Content-Length": Buffer.byteLength(body),
          },
          timeout: 30000,
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              if (res.statusCode !== 200) {
                reject(new Error(`LLM ${res.statusCode}: ${data.slice(0, 200)}`));
                return;
              }
              const parsed = JSON.parse(data);
              resolve(parsed.choices?.[0]?.message?.content || null);
            } catch (e) {
              reject(e);
            }
          });
        }
      );
      req.on("error", reject);
      req.on("timeout", () => req.destroy(new Error("LLM timeout")));
      req.write(body);
      req.end();
    });
  }

  // ==================== ACTION EXECUTOR ====================
  private async executeAction(userId: string, action: string, payload: string): Promise<AIResponse> {
    let params: any = {};
    try {
      params = JSON.parse(payload);
    } catch {
      params = { raw: payload };
    }

    switch (action) {
      case "create_campaign":
        return this.createCampaign(userId, params);
      case "create_ad":
        return this.createAd(userId, params);
      case "create_product":
        return this.createProduct(params);
      case "create_client":
        return this.createClient(params);
      case "create_lead":
        return this.createLead(userId, params);
      case "create_project":
        return this.createProject(userId, params);
      case "navigate":
        return {
          success: true,
          message: `✅ هفتحلك الصفحة المطلوبة`,
          action: "navigate",
          data: { page: params.page || "/" },
        };
      default:
        return { success: false, message: `إجراء غير معروف: ${action}` };
    }
  }

  // ==================== ACTION FALLBACK (pattern matching) ====================
  private async actionFallback(userId: string, message: string): Promise<AIResponse> {
    const msg = message.toLowerCase().trim();

    // ===== CAMPAIGNS =====
    if (this.has(msg, ["إنشاء حملة", "اعمل حملة", "create campaign", "حملة جديدة"])) {
      return this.createCampaign(userId, this.extractParams(message));
    }
    if (this.has(msg, ["اعرض الحملات", "كل الحملات", "show campaigns", "list campaigns", "حملاتي"])) {
      return this.listCampaigns();
    }

    // ===== ADS =====
    if (this.has(msg, ["إنشاء إعلان", "اعمل إعلان", "create ad", "إعلان جديد"])) {
      return this.createAd(userId, { platform: "Facebook", title: message, budget: 5000 });
    }
    if (this.has(msg, ["اعرض الإعلانات", "كل الإعلانات", "show ads", "list ads"])) {
      return this.listAds();
    }

    // ===== CLIENTS =====
    if (this.has(msg, ["إضافة عميل", "عميل جديد", "add client", "new client", "create client"])) {
      return this.createClient(this.extractParams(message));
    }
    if (this.has(msg, ["اعرض العملاء", "كل العملاء", "show clients", "list clients"])) {
      return this.listClients();
    }

    // ===== LEADS =====
    if (this.has(msg, ["إضافة lead", "ليد جديد", "add lead", "new lead", "عميل محتمل"])) {
      return this.createLead(userId, this.extractParams(message));
    }
    if (this.has(msg, ["العملاء المحتملون", "leads", "الليدز", "show leads"])) {
      return this.listLeads();
    }

    // ===== DEALS =====
    if (this.has(msg, ["إضافة صفقة", "صفقة جديدة", "add deal", "new deal", "create deal"])) {
      return this.createDeal(userId, this.extractParams(message));
    }

    // ===== PROJECTS =====
    if (this.has(msg, ["إنشاء مشروع", "مشروع جديد", "create project", "new project", "add project"])) {
      return this.createProject(userId, this.extractParams(message));
    }
    if (this.has(msg, ["اعرض المشاريع", "كل المشاريع", "show projects", "list projects"])) {
      return this.listProjects();
    }

    // ===== PRODUCTS =====
    if (this.has(msg, ["إضافة منتج", "منتج جديد", "add product", "new product", "create product"])) {
      return this.createProduct(this.extractParams(message));
    }
    if (this.has(msg, ["اعرض المنتجات", "كل المنتجات", "show products", "list products"])) {
      return this.listProducts();
    }
    if (this.has(msg, ["تعديل منتج", "update product", "edit product", "غير سعر"])) {
      return { success: false, message: "استخدم اسم المنتج في الرسالة" };
    }
    if (this.has(msg, ["حذف منتج", "delete product", "امسح منتج"])) {
      return this.deleteProduct(this.extractParams(message));
    }

    // ===== ANALYTICS =====
    if (this.has(msg, ["إيرادات", "revenue", "الأرباح", "profits", "المبيعات"])) {
      return this.revenueReport();
    }
    if (this.has(msg, ["ميزانية", "budget", "المصروفات"])) {
      return this.budgetReport();
    }
    if (this.has(msg, ["تقرير", "report", "analytics", "تحليلات", "أداء"])) {
      return this.analyticsReport();
    }
    if (this.has(msg, ["اقترح", "نصيحة", "suggest", "recommend", "insight", "تحليل ذكي"])) {
      return this.insights();
    }

    // ===== AUTOMATION =====
    if (this.has(msg, ["إنشاء أتمتة", "اعمل أتمتة", "create automation"])) {
      return this.createAutomation(userId, this.extractParams(message));
    }
    if (this.has(msg, ["اعرض الأتمتة", "show automations", "كل الأتمتة"])) {
      return this.listAutomations();
    }

    // ===== NAVIGATION =====
    if (this.has(msg, ["افتح", "open", "اذهب", "go to", "روح"])) {
      return this.navigate(message);
    }

    // ===== GREETINGS =====
    if (this.has(msg, ["مرحبا", "اهلا", "أهلا", "هاي", "hi", "hello", "ازيك", "إزيك"])) {
      return {
        success: true,
        message: "أهلاً بيك! 👋 أنا المساعد الذكي لـ ALBAHRAWY OS. أقدر أساعدك في:\n\n📊 التسويق • 👥 العملاء • 📦 المنتجات • 📁 المشاريع\n💰 التقارير • 🤖 الأتمتة\n\nقولي إيه عاوز وأساعدك فوراً!",
        action: "greeting",
      };
    }

    // Default help
    return {
      success: true,
      message: "🤖 **أنا أقدر أساعدك في:**\n\n📊 **التسويق:** إنشاء حملات، إعلانات، أتمتة\n👥 **العملاء:** إضافة عملاء، leads، صفقات\n📦 **المنتجات:** إضافة/تعديل/حذف منتجات\n📁 **المشاريع:** إنشاء وإدارة مشاريع\n💰 **التقارير:** إيرادات، ميزانية، أداء\n🧠 **تحليلات ذكية:** اقتراحات لتحسين الأداء\n\n**أمثلة:**\n• 'اعمل حملة باسم رمضان 2026 ميزانية 50000'\n• 'أضف منتج اسمه بنر فويل سعره 250'\n• 'اعرض الإيرادات'\n• 'افتح صفحة الحملات'\n• 'إيه أحسن وقت أنشر إعلانات فيسبوك؟'",
      action: "help",
    };
  }

  private has(text: string, keywords: string[]): boolean {
    return keywords.some((k) => text.includes(k.toLowerCase()));
  }

  // ===== CAMPAIGNS =====
  private async createCampaign(userId: string, params: any): Promise<AIResponse> {
    const campaign = await prisma.campaign.create({
      data: {
        name: params.name || `حملة جديدة - ${new Date().toLocaleDateString("ar-EG")}`,
        type: params.type || "Digital",
        description: params.description || "تم إنشاؤها بواسطة AI",
        budget: Number(params.budget) || 10000,
        status: "Draft",
        createdById: userId,
      },
    });
    return {
      success: true,
      message: `✅ تم إنشاء الحملة!\n\n**الاسم:** ${campaign.name}\n**النوع:** ${campaign.type}\n**الميزانية:** ${campaign.budget} ج.م`,
      action: "create_campaign",
      result: campaign,
    };
  }

  private async listCampaigns(): Promise<AIResponse> {
    const campaigns = await prisma.campaign.findMany({
      where: { deletedAt: null },
      include: { ads: { where: { deletedAt: null } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    const summary = campaigns.length
      ? campaigns.map((c) => `• **${c.name}** (${c.type}) - ميزانية: ${c.budget} - إعلانات: ${c.ads.length}`).join("\n")
      : "لا توجد حملات حالياً";
    return { success: true, message: `📊 **إجمالي الحملات:** ${campaigns.length}\n\n${summary}`, action: "list_campaigns", result: campaigns };
  }

  // ===== ADS =====
  private async createAd(userId: string, params: any): Promise<AIResponse> {
    let campaign = await prisma.campaign.findFirst({
      where: { deletedAt: null, status: { in: ["Active", "Draft"] } },
      orderBy: { createdAt: "desc" },
    });
    if (!campaign) {
      campaign = await prisma.campaign.create({
        data: {
          name: "حملة AI الافتراضية",
          type: "Digital",
          budget: Number(params.budget) || 5000,
          status: "Active",
          createdById: userId,
        },
      });
    }
    const ad = await prisma.ad.create({
      data: {
        campaignId: campaign.id,
        platform: params.platform || "Facebook",
        title: params.title || `إعلان - ${new Date().toLocaleDateString("ar-EG")}`,
        budget: Number(params.budget) || 5000,
        spent: 0,
        status: "Draft",
      },
    });
    return {
      success: true,
      message: `✅ تم إنشاء الإعلان!\n\n**العنوان:** ${ad.title}\n**المنصة:** ${ad.platform}\n**الميزانية:** ${ad.budget} ج.م`,
      action: "create_ad",
      result: ad,
    };
  }

  private async listAds(): Promise<AIResponse> {
    const ads = await prisma.ad.findMany({
      where: { deletedAt: null },
      include: { campaign: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    const summary = ads.length
      ? ads.map((a) => `• **${a.title}** (${a.platform}) - ${a.campaign.name}`).join("\n")
      : "لا توجد إعلانات";
    return { success: true, message: `📢 **إجمالي الإعلانات:** ${ads.length}\n\n${summary}`, action: "list_ads", result: ads };
  }

  // ===== CLIENTS =====
  private async createClient(params: any): Promise<AIResponse> {
    if (!params.name || !params.email) {
      return { success: false, message: "محتاج اسم العميل والإيميل" };
    }
    const client = await prisma.client.create({
      data: {
        name: params.name,
        email: params.email,
        phone: params.phone,
        company: params.company,
      },
    });
    return {
      success: true,
      message: `✅ تم إضافة العميل!\n\n**الاسم:** ${client.name}\n**الإيميل:** ${client.email}${client.company ? `\n**الشركة:** ${client.company}` : ""}`,
      action: "create_client",
      result: client,
    };
  }

  private async listClients(): Promise<AIResponse> {
    const clients = await prisma.client.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 10 });
    const summary = clients.length
      ? clients.map((c) => `• **${c.name}** (${c.email}) - ${c.company || "بدون شركة"}`).join("\n")
      : "لا يوجد عملاء";
    return { success: true, message: `👥 **إجمالي العملاء:** ${clients.length}\n\n${summary}`, action: "list_clients", result: clients };
  }

  // ===== LEADS =====
  private async createLead(userId: string, params: any): Promise<AIResponse> {
    if (!params.name || !params.email) {
      return { success: false, message: "محتاج اسم والإيميل" };
    }
    const lead = await prisma.lead.create({
      data: {
        name: params.name,
        email: params.email,
        phone: params.phone,
        source: params.source || "AI Assistant",
        status: "New",
        score: 50,
        assignedTo: userId,
      },
    });
    return {
      success: true,
      message: `✅ تم إضافة Lead!\n\n**الاسم:** ${lead.name}\n**الإيميل:** ${lead.email}\n**الحالة:** ${lead.status}`,
      action: "create_lead",
      result: lead,
    };
  }

  private async listLeads(): Promise<AIResponse> {
    const leads = await prisma.lead.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 20 });
    const byStatus = leads.reduce((acc: any, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, {});
    const stats = Object.entries(byStatus).map(([s, c]: any) => `• ${s}: ${c}`).join("\n") || "—";
    return { success: true, message: `🎯 **إجمالي Leads:** ${leads.length}\n\n**التوزيع:**\n${stats}`, action: "list_leads", result: leads };
  }

  // ===== DEALS =====
  private async createDeal(userId: string, params: any): Promise<AIResponse> {
    let client = await prisma.client.findFirst({ where: { deletedAt: null } });
    if (!client) return { success: false, message: "محتاج عميل موجود الأول" };
    const deal = await prisma.deal.create({
      data: {
        name: params.name || `صفقة - ${new Date().toLocaleDateString("ar-EG")}`,
        clientId: client.id,
        value: Number(params.value) || 50000,
        stage: "Discovery",
        probability: 50,
        assignedTo: userId,
      },
    });
    return {
      success: true,
      message: `✅ تم إنشاء الصفقة!\n\n**الاسم:** ${deal.name}\n**القيمة:** ${deal.value} ج.م`,
      action: "create_deal",
      result: deal,
    };
  }

  // ===== PROJECTS =====
  private async createProject(userId: string, params: any): Promise<AIResponse> {
    const project = await prisma.project.create({
      data: {
        name: params.name || `مشروع - ${new Date().toLocaleDateString("ar-EG")}`,
        description: params.description || "تم إنشاؤه بواسطة AI",
        status: "Planning",
        budget: Number(params.budget) || 100000,
        progress: 0,
        createdById: userId,
        startDate: new Date(),
      },
    });
    return {
      success: true,
      message: `✅ تم إنشاء المشروع!\n\n**الاسم:** ${project.name}\n**الميزانية:** ${project.budget} ج.م`,
      action: "create_project",
      result: project,
    };
  }

  private async listProjects(): Promise<AIResponse> {
    const projects = await prisma.project.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 10 });
    const summary = projects.length
      ? projects.map((p) => `• **${p.name}** - ${p.status} - ${p.progress}%`).join("\n")
      : "لا توجد مشاريع";
    return { success: true, message: `📁 **إجمالي المشاريع:** ${projects.length}\n\n${summary}`, action: "list_projects", result: projects };
  }

  // ===== PRODUCTS =====
  private async createProduct(params: any): Promise<AIResponse> {
    if (!params.name) return { success: false, message: "محتاج اسم المنتج" };
    const product = await prisma.product.create({
      data: {
        name: params.name,
        sku: params.sku || `SKU-${Date.now().toString().slice(-8)}`,
        description: params.description,
        category: params.category || "عام",
        price: Number(params.price) || 0,
        cost: 0,
        stock: Number(params.stock) || 0,
      },
    });
    return {
      success: true,
      message: `✅ تم إضافة المنتج!\n\n**الاسم:** ${product.name}\n**السعر:** ${product.price} ج.م\n**المخزون:** ${product.stock}`,
      action: "create_product",
      result: product,
    };
  }

  private async listProducts(): Promise<AIResponse> {
    const products = await prisma.product.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 10 });
    const summary = products.length
      ? products.map((p) => `• **${p.name}** (${p.sku}) - ${p.price} ج.م`).join("\n")
      : "لا توجد منتجات";
    return { success: true, message: `📦 **إجمالي المنتجات:** ${products.length}\n\n${summary}`, action: "list_products", result: products };
  }

  private async deleteProduct(params: any): Promise<AIResponse> {
    const product = await prisma.product.findFirst({ where: { name: { contains: params.name }, deletedAt: null } });
    if (!product) return { success: false, message: "المنتج مش موجود" };
    await prisma.product.update({ where: { id: product.id }, data: { deletedAt: new Date() } });
    return { success: true, message: `✅ تم حذف المنتج: ${product.name}`, action: "delete_product" };
  }

  // ===== AUTOMATIONS =====
  private async createAutomation(userId: string, params: any): Promise<AIResponse> {
    const automation = await prisma.automation.create({
      data: {
        name: params.name || `أتمتة - ${new Date().toLocaleDateString("ar-EG")}`,
        trigger: params.trigger || "new_lead",
        action: params.action || "send_email",
        config: JSON.stringify({ template: "default" }),
        createdById: userId,
      },
    });
    return {
      success: true,
      message: `✅ تم إنشاء الأتمتة!\n\n**الاسم:** ${automation.name}\n**Trigger:** ${automation.trigger}\n**Action:** ${automation.action}`,
      action: "create_automation",
      result: automation,
    };
  }

  private async listAutomations(): Promise<AIResponse> {
    const automations = await prisma.automation.findMany({ where: { deletedAt: null } });
    const summary = automations.length
      ? automations.map((a) => `• **${a.name}** - ${a.trigger} → ${a.action}`).join("\n")
      : "لا توجد أتمتة";
    return { success: true, message: `🤖 **إجمالي الأتمتة:** ${automations.length}\n\n${summary}`, action: "list_automations", result: automations };
  }

  // ===== REPORTS =====
  private async revenueReport(): Promise<AIResponse> {
    const campaigns = await prisma.campaign.findMany({ where: { deletedAt: null } });
    const totalRevenue = campaigns.reduce((acc, c) => acc + Number(c.revenue), 0);
    const totalSpent = campaigns.reduce((acc, c) => acc + Number(c.spent), 0);
    const roi = totalSpent > 0 ? (totalRevenue / totalSpent).toFixed(2) : "0";
    return {
      success: true,
      message: `💰 **التقرير المالي**\n\n📈 الإيرادات: ${totalRevenue} ج.م\n💸 المصروفات: ${totalSpent} ج.م\n💎 صافي الربح: ${totalRevenue - totalSpent} ج.م\n📊 ROI: ${roi}x`,
      action: "revenue_report",
      result: { totalRevenue, totalSpent, netProfit: totalRevenue - totalSpent, roi },
    };
  }

  private async budgetReport(): Promise<AIResponse> {
    const campaigns = await prisma.campaign.findMany({ where: { deletedAt: null } });
    const total = campaigns.reduce(
      (acc, c) => ({ budget: acc.budget + Number(c.budget), spent: acc.spent + Number(c.spent) }),
      { budget: 0, spent: 0 }
    );
    return {
      success: true,
      message: `💼 **تقرير الميزانية**\n\n💰 الإجمالي: ${total.budget} ج.م\n💸 المنصرف: ${total.spent} ج.م\n💵 المتبقي: ${total.budget - total.spent} ج.م`,
      action: "budget_report",
      result: total,
    };
  }

  private async analyticsReport(): Promise<AIResponse> {
    const ads = await prisma.ad.findMany({ where: { deletedAt: null } });
    const totalReach = ads.reduce((acc, a) => acc + a.reach, 0);
    const totalClicks = ads.reduce((acc, a) => acc + a.clicks, 0);
    const ctr = totalReach > 0 ? ((totalClicks / totalReach) * 100).toFixed(2) : "0";
    return {
      success: true,
      message: `📊 **التحليلات**\n\n👁️ الوصول: ${totalReach.toLocaleString()}\n🖱️ النقرات: ${totalClicks.toLocaleString()}\n📈 CTR: ${ctr}%`,
      action: "analytics_report",
      result: { totalReach, totalClicks, ctr },
    };
  }

  private async insights(): Promise<AIResponse> {
    const insights = [
      "💡 حملات Facebook بتحقق أعلى ROI — زوّد ميزانيتها",
      "💡 معدل التحويل في الإعلانات المثبتة أعلى 23% — ركز عليها",
      "💡 العملاء من LinkedIn قيمة عمرية أعلى بـ 40%",
      "💡 أفضل وقت للنشر: 7-9 مساءً — جدول حملاتك فيه",
    ];
    return { success: true, message: `🧠 **تحليلات ذكية:**\n\n${insights.join("\n")}`, action: "insights" };
  }

  private navigate(message: string): AIResponse {
    const m = message.toLowerCase();
    let page = "/";
    let name = "الرئيسية";
    const map: Record<string, [string, string]> = {
      "تسويق|marketing": ["/marketing", "التسويق"],
      "حملات|campaigns": ["/marketing/campaigns", "الحملات"],
      "إعلانات|ads": ["/marketing/ads", "الإعلانات"],
      "ميزانية|budget": ["/marketing/budget", "الميزانية"],
      "أتمتة|automation": ["/marketing/automations", "الأتمتة"],
      "عملاء|clients|crm": ["/crm", "العملاء"],
      "مشاريع|projects": ["/projects", "المشاريع"],
      "منتجات|products": ["/products", "المنتجات"],
      "إعدادات|settings": ["/settings", "الإعدادات"],
      "فريق|team": ["/team", "الفريق"],
    };
    for (const [k, v] of Object.entries(map)) {
      if (k.split("|").some((kw) => m.includes(kw))) {
        [page, name] = v;
        break;
      }
    }
    return { success: true, message: `✅ هفتحلك صفحة **${name}**`, action: "navigate", data: { page, name } };
  }

  // ===== HELPERS =====
  private extractParams(message: string): any {
    const nameMatch = message.match(/اسمها?\s+([^\s@]+(?:\s+[^\s@]+){0,5})/);
    const budgetMatch = message.match(/(?:ميزانية|بـ|=|ب)\s*(\d+(?:\.\d+)?)/);
    const emailMatch = message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    const phoneMatch = message.match(/(\+?\d{10,15})/);
    const priceMatch = message.match(/(?:سعر|سعره|price|بـ|=|ب)\s*(\d+(?:\.\d+)?)/);
    return {
      name: nameMatch?.[1]?.trim(),
      budget: budgetMatch ? parseFloat(budgetMatch[1]) : undefined,
      price: priceMatch ? parseFloat(priceMatch[1]) : undefined,
      email: emailMatch?.[1],
      phone: phoneMatch?.[1],
      type: "Digital",
    };
  }

  // ===== LEGACY =====
  async generateAiInsights(userId: string) {
    return this.insights();
  }

  async sendChatMessage(userId: string, message: string) {
    const result = await this.processCommand(userId, message);
    return { userMessage: message, aiReply: result.message, action: result.action, data: result.data, result: result.result };
  }
}
