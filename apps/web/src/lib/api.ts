// API Client for ALBAHRAWY OS

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/api/${endpoint}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ==================== AUTH ====================
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>("auth/login", {
      method: "POST",
      body: { email, password },
    });
  }

  async register(data: { email: string; password: string; name: string }) {
    return this.request<{ token: string; user: any }>("auth/register", {
      method: "POST",
      body: data,
    });
  }

  // ==================== MARKETING ====================
  async getMarketingDashboard() {
    return this.request<any>("marketing/dashboard");
  }

  // Campaigns
  async getCampaigns(params?: { status?: string; type?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.type) query.set("type", params.type);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    return this.request<any>(`marketing/campaigns?${query.toString()}`);
  }

  async getCampaign(id: string) {
    return this.request<any>(`marketing/campaigns/${id}`);
  }

  async createCampaign(data: {
    name: string;
    type: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    budget: number;
  }) {
    return this.request<any>("marketing/campaigns", { method: "POST", body: data });
  }

  async updateCampaign(id: string, data: Partial<any>) {
    return this.request<any>(`marketing/campaigns/${id}`, { method: "PUT", body: data });
  }

  async deleteCampaign(id: string) {
    return this.request<any>(`marketing/campaigns/${id}`, { method: "DELETE" });
  }

  async getCampaignAnalytics(id: string, dateRange?: { start: string; end: string }) {
    const query = dateRange ? `?startDate=${dateRange.start}&endDate=${dateRange.end}` : "";
    return this.request<any>(`marketing/campaigns/${id}/analytics${query}`);
  }

  // Ads
  async getAds(params?: { campaignId?: string; platform?: string; status?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.campaignId) query.set("campaignId", params.campaignId);
    if (params?.platform) query.set("platform", params.platform);
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    return this.request<any>(`marketing/ads?${query.toString()}`);
  }

  async getAd(id: string) {
    return this.request<any>(`marketing/ads/${id}`);
  }

  async createAd(data: { campaignId: string; platform: string; title: string; budget: number; externalId?: string }) {
    return this.request<any>("marketing/ads", { method: "POST", body: data });
  }

  async updateAd(id: string, data: Partial<any>) {
    return this.request<any>(`marketing/ads/${id}`, { method: "PUT", body: data });
  }

  async deleteAd(id: string) {
    return this.request<any>(`marketing/ads/${id}`, { method: "DELETE" });
  }

  // Automations
  async getAutomations() {
    return this.request<any>("marketing/automations");
  }

  async createAutomation(data: { name: string; trigger: string; action: string; config: any }) {
    return this.request<any>("marketing/automations", { method: "POST", body: data });
  }

  async updateAutomation(id: string, data: Partial<any>) {
    return this.request<any>(`marketing/automations/${id}`, { method: "PUT", body: data });
  }

  async deleteAutomation(id: string) {
    return this.request<any>(`marketing/automations/${id}`, { method: "DELETE" });
  }

  // Budget
  async getBudget() {
    return this.request<any>("marketing/budget");
  }

  // Leads
  async getMarketingLeads() {
    return this.request<any>("marketing/leads");
  }

  // Social Media Connections
  async getConnections() {
    return this.request<any>("marketing/connections");
  }

  async createConnection(data: {
    platform: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
    pageId?: string;
    pageName?: string;
    phoneNumber?: string;
  }) {
    return this.request<any>("marketing/connections", { method: "POST", body: data });
  }

  async deleteConnection(id: string) {
    return this.request<any>(`marketing/connections/${id}`, { method: "DELETE" });
  }

  // ==================== CRM ====================
  async getLeads(params?: any) {
    const query = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v && query.set(k, String(v)));
    return this.request<any>(`crm/leads?${query.toString()}`);
  }

  async getClients(params?: any) {
    const query = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v && query.set(k, String(v)));
    return this.request<any>(`crm/clients?${query.toString()}`);
  }

  async getDeals(params?: any) {
    const query = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v && query.set(k, String(v)));
    return this.request<any>(`crm/deals?${query.toString()}`);
  }

  // ==================== PROJECTS ====================
  async getProjects(params?: any) {
    const query = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v && query.set(k, String(v)));
    return this.request<any>(`projects?${query.toString()}`);
  }

  // ==================== CRM ====================
  async getClients() {
    return this.request<{ success: boolean; data: any[] }>("crm/clients");
  }

  async createClient(data: any) {
    return this.request<{ success: boolean; data: any }>("crm/clients", { method: "POST", body: data });
  }

  async updateClient(id: string, data: any) {
    return this.request<{ success: boolean; data: any }>(`crm/clients/${id}`, { method: "PATCH", body: data });
  }

  async deleteClient(id: string) {
    return this.request<{ success: boolean; data: any }>(`crm/clients/${id}`, { method: "DELETE" });
  }

  // Suppliers
  async getSuppliers() {
    return this.request<{ success: boolean; data: any[] }>("crm/suppliers");
  }

  async createSupplier(data: any) {
    return this.request<{ success: boolean; data: any }>("crm/suppliers", { method: "POST", body: data });
  }

  async updateSupplier(id: string, data: any) {
    return this.request<{ success: boolean; data: any }>(`crm/suppliers/${id}`, { method: "PATCH", body: data });
  }

  async deleteSupplier(id: string) {
    return this.request<{ success: boolean; data: any }>(`crm/suppliers/${id}`, { method: "DELETE" });
  }

  // ==================== PRODUCTS ====================
  async getProducts() {
    return this.request<any>("products");
  }

  async getProduct(id: string) {
    return this.request<any>(`products/${id}`);
  }

  async createProduct(data: any) {
    return this.request<any>("products", { method: "POST", body: data });
  }

  async updateProduct(id: string, data: any) {
    return this.request<any>(`products/${id}`, { method: "PATCH", body: data });
  }

  async deleteProduct(id: string) {
    return this.request<any>(`products/${id}`, { method: "DELETE" });
  }

  // ==================== PORTFOLIO ====================
  async getPortfolio() {
    return this.request<any>("portfolio");
  }

  async createPortfolioItem(data: any) {
    return this.request<any>("portfolio", { method: "POST", body: data });
  }

  async updatePortfolioItem(id: string, data: any) {
    return this.request<any>(`portfolio/${id}`, { method: "PATCH", body: data });
  }

  async deletePortfolioItem(id: string) {
    return this.request<any>(`portfolio/${id}`, { method: "DELETE" });
  }
}

export const api = new ApiClient();
export default api;