// ==============================================
// BROWSER-SAFE DEFAULT DATA
// ==============================================

export interface Order {
  id: number;
  name: string;
  phone: string;
  projectDetails: string;
  source: string;
  status: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  pricingType: string;
  width?: number;
  height?: number;
  unit?: string;
}

export interface SiteData {
  companyName: string;
  ownerName: string;
  phone: string;
  email: string;
  location: string;
  locationLink: string;
  credentials: {
    owner: {
      email: string;
      password: string;
    };
    customers: {
      email: string;
      password: string;
      name: string;
    }[];
  };
  categories: Category[];
  products: Product[];
  faqs: { id: number; question: string; answer: string }[];
  portfolio: { id: number; title: string; category: string; image: string; description: string }[];
  clients: { id: number; name: string; logo: string }[];
  testimonials: { name: string; company: string; text: string; image: string }[];
  services: { title: string; description: string; icon: string }[];
  blog: any[];
  orders: Order[];
  customers: { id: number; name: string; phone: string; projectDetails: string; orderDate: string; totalAmount: number; paidAmount: number; remainingAmount: number; status: string }[];
  suppliers: { id: number; companyName: string; contactPerson: string; phone: string; orderDetails: string; orderDate: string; totalAmount: number; paidAmount: number; remainingAmount: number }[];
}

export const defaultData: SiteData = {
  companyName: "البحراوي للدعاية والإعلان",
  ownerName: "محمد البحراوي",
  phone: "01120053007",
  email: "info@albahrawy.com",
  location: "الزقازيق - القومية - أمام مستشفى المعلمين",
  locationLink: "https://maps.app.goo.gl/nuVZfwCNjoJqiVnU8",
  credentials: {
    owner: {
      email: "admin@albahrawy.com",
      password: "admin123"
    },
    customers: []
  },
  categories: [
    { id: "all", name: "الكل", icon: "fa-th", image: "" }
  ],
  products: [],
  faqs: [],
  portfolio: [],
  clients: [],
  testimonials: [],
  services: [
    { title: "تصميم جرافيكي", description: "تصميم احترافي لجميع احتياجاتك", icon: "fa-palette" },
    { title: "طباعة", description: "طباعة عالية الجودة لجميع المطبوعات", icon: "fa-print" },
    { title: "حفر ليزر", description: "حفر دقيق على جميع المواد", icon: "fa-laser" },
    { title: "تسويق رقمي", description: "حلول تسويقية متكاملة", icon: "fa-bullhorn" }
  ],
  blog: [],
  orders: [],
  customers: [],
  suppliers: []
};

export const siteData = defaultData;
