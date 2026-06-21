import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ====================
  // 1. CREATE ADMIN USER
  // ====================
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin Elbahrawy',
      email: 'admin@elbahrawy.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    },
  });
  console.log(`✅ Created Admin User: ${adminUser.email} (password: admin123)`);

  // ====================
  // 2. CREATE MANAGER USER
  // ====================
  const managerUser = await prisma.user.create({
    data: {
      name: 'Manager User',
      email: 'manager@elbahrawy.com',
      password: hashedPassword,
      role: 'manager',
      isActive: true,
    },
  });
  console.log(`✅ Created Manager User: ${managerUser.email} (password: admin123)`);

  // ====================
  // 3. CREATE DUMMY CAMPAIGNS
  // ====================
  const campaign1 = await prisma.campaign.create({
    data: {
      name: 'حملة الصيف 2026',
      type: 'SOCIAL_MEDIA',
      status: 'ACTIVE',
      description: 'حملة ترويجية لمنتجات الصيف على منصات التواصل الاجتماعي',
      budget: 50000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdById: adminUser.id,
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      name: 'حملة عيد الأضحى',
      type: 'EMAIL_MARKETING',
      status: 'DRAFT',
      description: 'حملة بريدية لتنبيه العملاء بالعروض خلال عيد الأضحى',
      budget: 20000,
      createdById: managerUser.id,
    },
  });
  console.log(`✅ Created ${2} Campaigns`);

  // ====================
  // 4. CREATE DUMMY ADS
  // ====================
  const ad1 = await prisma.ad.create({
    data: {
      campaignId: campaign1.id,
      platform: 'FACEBOOK',
      title: 'تخفيضات الصيف 50%',
      description: 'تخفيضات تصل إلى 50% على جميع المنتجات',
      status: 'ACTIVE',
      budget: 15000,
      spent: 8500,
      reach: 25000,
      clicks: 1200,
      conversions: 150,
      ctr: 4.8,
    },
  });

  const ad2 = await prisma.ad.create({
    data: {
      campaignId: campaign1.id,
      platform: 'INSTAGRAM',
      title: 'تصميمات جديدة',
      description: 'تصميمات جديدة موسمية جاهزة للطلب',
      status: 'PAUSED',
      budget: 10000,
      spent: 3000,
      reach: 18000,
      clicks: 800,
      conversions: 95,
      ctr: 4.4,
    },
  });
  console.log(`✅ Created ${2} Ads`);

  // ====================
  // 5. CREATE DUMMY CLIENT
  // ====================
  const client = await prisma.client.create({
    data: {
      name: 'محمد أحمد',
      email: 'mohamed@example.com',
      phone: '0123456789',
      company: 'شركة أحمد للتجارة',
      totalOrders: 5,
      totalSpent: 25000,
      status: 'VIP',
    },
  });
  console.log(`✅ Created Client: ${client.name}`);

  // ====================
  // 6. CREATE DUMMY LEADS
  // ====================
  await prisma.lead.createMany({
    data: [
      {
        name: 'سارة على',
        email: 'sara@example.com',
        phone: '0121111111',
        source: 'Facebook',
        status: 'NEW',
        score: 75,
        value: 3000,
        assignedTo: managerUser.id,
      },
      {
        name: 'علي سعيد',
        email: 'ali@example.com',
        phone: '0122222222',
        source: 'Google Ads',
        status: 'CONTACTED',
        score: 85,
        value: 5000,
        assignedTo: adminUser.id,
      },
      {
        name: 'مريم محمود',
        email: 'maryam@example.com',
        phone: '0123333333',
        source: 'Website',
        status: 'QUALIFIED',
        score: 90,
        value: 7500,
        assignedTo: managerUser.id,
      },
    ],
  });
  console.log(`✅ Created 3 Leads`);

  // ====================
  // 7. CREATE DUMMY DEALS
  // ====================
  const deal1 = await prisma.deal.create({
    data: {
      name: 'صفقة تصميم هوية بصرية',
      clientId: client.id,
      value: 15000,
      stage: 'PROPOSAL',
      probability: 60,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      assignedTo: adminUser.id,
    },
  });
  console.log(`✅ Created Deal: ${deal1.name}`);

  // ====================
  // 8. CREATE DUMMY PRODUCTS
  // ====================
  await prisma.product.createMany({
    data: [
      {
        name: 'تصميم هوية بصرية كاملة',
        sku: 'PROD-001',
        description: 'شعار + بطاقات عمل + قوالب اجتماعية',
        category: 'تصميم',
        price: 5000,
        cost: 1500,
        stock: 100,
      },
      {
        name: 'تصميم إعلان سوشيال ميديا',
        sku: 'PROD-002',
        category: 'تصميم',
        price: 1500,
        cost: 400,
        stock: 100,
      },
      {
        name: 'إدارة حملة شهرية',
        sku: 'PROD-003',
        category: 'خدمات',
        price: 8000,
        cost: 2500,
        stock: 10,
      },
    ],
  });
  console.log(`✅ Created Products`);

  // ====================
  // 9. CREATE DUMMY INVOICE
  // ====================
  await prisma.invoice.create({
    data: {
      number: 'INV-2026-001',
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      amount: 15000,
      tax: 1500,
      total: 16500,
      status: 'PAID',
      issueDate: new Date(),
      paidDate: new Date(),
    },
  });
  console.log(`✅ Created Invoice`);

  // ====================
  // 10. INITIALIZE SITE CONFIG
  // ====================
  const defaultSiteData = {
    "companyName": "البحراوي للدعاية والإعلان",
    "ownerName": "محمد البحراوي",
    "phone": "01120053007",
    "email": "info@albahrawy.com",
    "location": "الزقازيق - القومية - أمام مستشفى المعلمين",
    "credentials": {
      "owner": {
        "email": "admin@albahrawy.com",
        "password": "admin123"
      }
    },
    "categories": [
      { "id": "all", "name": "الكل", "icon": "fa-th" },
      { "id": "signs", "name": "لوحات إعلانية", "icon": "fa-sign" },
      { "id": "printing", "name": "طباعة", "icon": "fa-print" },
      { "id": "branding", "name": "هوية تجارية", "icon": "fa-palette" },
      { "id": "laser", "name": "حفر ليزر", "icon": "fa-laser" }
    ],
    "products": [
      { "id": 1, "name": "لوحة إعلانية خارجية مضيئة", "price": 3500, "category": "signs", "image": "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=800&auto=format&fit=crop", "description": "لوحة إعلانية فليكس مضيئة بإضاءة LED عالية الجودة، مقاومة للعوامل الجوية.", "pricingType": "meter" },
      { "id": 2, "name": "كروت شخصية فاخرة", "price": 250, "category": "printing", "image": "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop", "description": "1000 كرت شخصي، طباعة وجهين، سلوفان حراري، ورق 350 جرام.", "pricingType": "piece" },
      { "id": 3, "name": "تصميم هوية تجارية", "price": 5000, "category": "branding", "image": "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop", "description": "شعار احترافي، أوراق رسمية، أظرف، وفولدرات لشركتك.", "pricingType": "piece" },
      { "id": 4, "name": "درع كريستال محفور", "price": 450, "category": "laser", "image": "https://images.unsplash.com/photo-1531207991955-3e8c8c2c2f7c?q=80&w=800&auto=format&fit=crop", "description": "درع كريستال فاخر مع حفر ليزر دقيق للصور والنصوص.", "pricingType": "piece" },
      { "id": 5, "name": "رول اب ستاند", "price": 850, "category": "signs", "image": "https://images.unsplash.com/photo-1542744095-2ad4870b62ef?q=80&w=800&auto=format&fit=crop", "description": "ستاند رول اب مقاس 85×200 سم، طباعة بنر عالية الدقة مع شنطة حمل.", "pricingType": "piece" },
      { "id": 6, "name": "طباعة تيشرتات", "price": 180, "category": "printing", "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop", "description": "طباعة حرارية ديجيتال على تيشرتات قطنية بجودة ألوان ممتازة.", "pricingType": "piece" }
    ],
    "faqs": [
      { "id": 1, "question": "ما هي مدة تنفيذ الطلب؟", "answer": "تختلف المدة حسب نوع المشروع، ولكن غالباً ما يتم تنفيذ المطبوعات البسيطة خلال 24-48 ساعة، بينما المشاريع الكبيرة مثل اللوحات الإعلانية تستغرق من 3 إلى 7 أيام عمل." },
      { "id": 2, "question": "هل توفرون خدمة التركيب؟", "answer": "نعم، لدينا فريق متخصص لتركيب جميع أنواع اللوحات الإعلانية والواجهات في أي مكان داخل محافظة الشرقية وخارجها." },
      { "id": 3, "question": "هل يمكنني التعديل على التصميم بعد البدء؟", "answer": "نعم، نوفر للعميل مرحلة مراجعة التصميم المبدئي حيث يمكنه طلب أي تعديلات قبل البدء في مرحلة التنفيذ النهائية." },
      { "id": 4, "question": "ما هي طرق الدفع المتاحة؟", "answer": "نقبل الدفع نقداً، أو عن طريق التحويل البنكي، أو فودافون كاش، كما نوفر أنظمة دفع ميسرة للتعاقدات السنوية." }
    ],
    "portfolio": [
      { "id": 1, "title": "هوية بصرية لشركة XYZ", "category": "تصميم جرافيكي", "image": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop", "description": "تصميم هوية بصرية كاملة للشركة" },
      { "id": 2, "title": "حملة تبليغية جديدة", "category": "تسويق رقمي", "image": "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=800&auto=format&fit=crop", "description": "حملة تسويقية متكاملة على منصات التواصل" },
      { "id": 3, "title": "فيديو دعائي", "category": "إنتاج فيديو", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop", "description": "فيديو دعائي احترافي للمنتج" },
      { "id": 4, "title": "لوحات إعلانية لمول", "category": "تصميم جرافيكي", "image": "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=800&auto=format&fit=crop", "description": "تصميم وتنفيذ لوحات إعلانية للمول" },
      { "id": 5, "title": "حملة سوشيال ميديا", "category": "تسويق رقمي", "image": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop", "description": "إدارة حملات سوشيال ميديا" },
      { "id": 6, "title": "مطبوعات شركة", "category": "طباعة", "image": "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop", "description": "مطبوعات احترافية للشركة" }
    ],
    "clients": [
      { "id": 1, "name": "مجموعة الفطيم", "logo": "https://images.unsplash.com/photo-1614680376593-902f74cf389e?q=80&w=400&auto=format&fit=crop" },
      { "id": 2, "name": "أوراسكوم للإنشاءات", "logo": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop" },
      { "id": 3, "name": "موبينيل", "logo": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop" },
      { "id": 4, "name": "إتصالات", "logo": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop" }
    ],
    "testimonials": [
      { "name": "مصطفى عبدالله", "company": "شركة أوراسكوم", "text": "خدماتهم جودة عالية وتوصي بوقت معقول", "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" },
      { "name": "سارة محمد", "company": "مجموعة الفطيم", "text": "تعاون ممتاز ومساعدة في كل مرحلة", "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" }
    ],
    "services": [
      { "title": "تصميم جرافيكي", "description": "تصميم احترافي لجميع احتياجاتك", "icon": "fa-palette" },
      { "title": "طباعة", "description": "طباعة عالية الجودة لجميع المطبوعات", "icon": "fa-print" },
      { "title": "حفر ليزر", "description": "حفر دقيق على جميع المواد", "icon": "fa-laser" },
      { "title": "تسويق رقمي", "description": "حلول تسويقية متكاملة", "icon": "fa-bullhorn" }
    ],
    "blog": []
  };

  await prisma.siteConfig.upsert({
    where: { id: 'current' },
    update: { data: JSON.stringify(defaultSiteData) },
    create: { id: 'current', data: JSON.stringify(defaultSiteData) },
  });
  console.log('✅ Initialized Site Config');

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
