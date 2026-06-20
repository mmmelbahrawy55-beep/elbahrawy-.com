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
