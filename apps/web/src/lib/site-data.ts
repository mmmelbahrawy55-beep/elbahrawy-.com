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
  nameEn?: string;
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
    { id: "all", name: "الكل", nameEn: "All", icon: "fa-th" },
    { id: "signs", name: "لوحات إعلانية", nameEn: "Signs", icon: "fa-sign" },
    { id: "printing", name: "طباعة", nameEn: "Printing", icon: "fa-print" },
    { id: "branding", name: "هوية تجارية", nameEn: "Branding", icon: "fa-palette" },
    { id: "laser", name: "حفر ليزر", nameEn: "Laser Engraving", icon: "fa-laser" }
  ],
  products: [
    {
      id: 1,
      name: "لوحة إعلانية خارجية مضيئة",
      price: 3500,
      category: "signs",
      image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=800&auto=format&fit=crop",
      description: "لوحة إعلانية فليكس مضيئة بإضاءة LED عالية الجودة، مقاومة للعوامل الجوية.",
      pricingType: "meter"
    },
    {
      id: 2,
      name: "كروت شخصية فاخرة",
      price: 250,
      category: "printing",
      image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop",
      description: "1000 كرت شخصي، طباعة وجهين، سلوفان حراري، ورق 350 جرام.",
      pricingType: "piece"
    },
    {
      id: 3,
      name: "تصميم هوية تجارية",
      price: 5000,
      category: "branding",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
      description: "شعار احترافي، أوراق رسمية، أظرف، وفولدرات لشركتك.",
      pricingType: "piece"
    },
    {
      id: 4,
      name: "درع كريستال محفور",
      price: 450,
      category: "laser",
      image: "https://images.unsplash.com/photo-1531207991955-3e8c8c2c2f7c?q=80&w=800&auto=format&fit=crop",
      description: "درع كريستال فاخر مع حفر ليزر دقيق للصور والنصوص.",
      pricingType: "piece"
    },
    {
      id: 5,
      name: "رول اب ستاند",
      price: 850,
      category: "signs",
      image: "https://images.unsplash.com/photo-1542744095-2ad4870b62ef?q=80&w=800&auto=format&fit=crop",
      description: "ستاند رول اب مقاس 85×200 سم، طباعة بنر عالية الدقة مع شنطة حمل.",
      pricingType: "piece"
    },
    {
      id: 6,
      name: "طباعة تيشرتات",
      price: 180,
      category: "printing",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
      description: "طباعة حرارية ديجيتال على تيشرتات قطنية بجودة ألوان ممتازة.",
      pricingType: "piece"
    }
  ],
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
