
// ==========================================
// ALBAHRAWY WEBSITE DATA
// ==========================================

const siteData = {
    companyName: "البحراوي للدعاية والإعلان والحفر بالليزر",
    ownerName: "محمد البحراوي",
    phone: "01120053007",
    email: "info@albahrawy.com",
    
    credentials: {
        owner: {
            email: "admin@albahrawy.com",
            password: "admin123"
        }
    },
    
    categories: [
        { id: 'all', name: 'الكل', icon: 'fa-th' },
        { id: 'signs', name: 'لوحات إعلانية', icon: 'fa-sign' },
        { id: 'printing', name: 'طباعة', icon: 'fa-print' },
        { id: 'branding', name: 'هوية تجارية', icon: 'fa-palette' },
        { id: 'laser', name: 'حفر ليزر', icon: 'fa-laser' }
    ],
    
    products: [
        { 
            id: 1, 
            name: 'لوحة إعلانية خارجية مضيئة', 
            price: 3500, 
            category: 'signs', 
            image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=800&auto=format&fit=crop', 
            description: 'لوحة إعلانية فليكس مضيئة بإضاءة LED عالية الجودة، مقاومة للعوامل الجوية.' 
        },
        { 
            id: 2, 
            name: 'كروت شخصية فاخرة', 
            price: 250, 
            category: 'printing', 
            image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop', 
            description: '1000 كرت شخصي، طباعة وجهين، سلوفان حراري، ورق 350 جرام.' 
        },
        { 
            id: 3, 
            name: 'تصميم هوية تجارية', 
            price: 5000, 
            category: 'branding', 
            image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop', 
            description: 'شعار احترافي، أوراق رسمية، أظرف، وفولدرات لشركتك.' 
        },
        { 
            id: 4, 
            name: 'درع كريستال محفور', 
            price: 450, 
            category: 'laser', 
            image: 'https://images.unsplash.com/photo-1531207991955-3e8c8c2c2f7c?q=80&w=800&auto=format&fit=crop', 
            description: 'درع كريستال فاخر مع حفر ليزر دقيق للصور والنصوص.' 
        },
        { 
            id: 5, 
            name: 'رول اب ستاند', 
            price: 850, 
            category: 'signs', 
            image: 'https://images.unsplash.com/photo-1542744095-2ad4870b62ef?q=80&w=800&auto=format&fit=crop', 
            description: 'ستاند رول اب مقاس 85*200 سم، طباعة بنر عالية الدقة مع شنطة حمل.' 
        },
        { 
            id: 6, 
            name: 'طباعة تيشرتات', 
            price: 180, 
            category: 'printing', 
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop', 
            description: 'طباعة حرارية ديجيتال على تيشرتات قطنية بجودة ألوان ممتازة.' 
        }
    ],
    
    faqs: [
        {
            id: 1,
            question: "ما هي مدة تنفيذ الطلب؟",
            answer: "تختلف المدة حسب نوع المشروع، ولكن غالباً ما يتم تنفيذ المطبوعات البسيطة خلال 24-48 ساعة، بينما المشاريع الكبيرة مثل اللوحات الإعلانية تستغرق من 3 إلى 7 أيام عمل."
        },
        {
            id: 2,
            question: "هل توفرون خدمة التركيب؟",
            answer: "نعم، لدينا فريق متخصص لتركيب جميع أنواع اللوحات الإعلانية والواجهات في أي مكان داخل محافظة الشرقية وخارجها."
        },
        {
            id: 3,
            question: "هل يمكنني التعديل على التصميم بعد البدء؟",
            answer: "نعم، نوفر للعميل مرحلة مراجعة التصميم المبدئي حيث يمكنه طلب أي تعديلات قبل البدء في مرحلة التنفيذ النهائية."
        },
        {
            id: 4,
            question: "ما هي طرق الدفع المتاحة؟",
            answer: "نقبل الدفع نقداً، أو عن طريق التحويل البنكي، أو فودافون كاش، كما نوفر أنظمة دفع ميسرة للتعاقدات السنوية."
        }
    ],
    
    portfolio: [
        { 
            id: 1, 
            title: 'هوية بصرية لشركة XYZ', 
            category: 'تصميم جرافيكي', 
            image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop', 
            description: 'تصميم هوية بصرية كاملة للشركة' 
        },
        { 
            id: 2, 
            title: 'حملة تبليغية جديدة', 
            category: 'تسويق رقمي', 
            image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=800&auto=format&fit=crop', 
            description: 'حملة تسويقية متكاملة على منصات التواصل' 
        },
        { 
            id: 3, 
            title: 'فيديو دعائي', 
            category: 'إنتاج فيديو', 
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop', 
            description: 'فيديو دعائي احترافي للمنتج' 
        },
        { 
            id: 4, 
            title: 'لوحات إعلانية لمول', 
            category: 'تصميم جرافيكي', 
            image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=800&auto=format&fit=crop', 
            description: 'تصميم وتنفيذ لوحات إعلانية للمول' 
        },
        { 
            id: 5, 
            title: 'حملة سوشيال ميديا', 
            category: 'تسويق رقمي', 
            image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop', 
            description: 'إدارة حملات سوشيال ميديا' 
        },
        { 
            id: 6, 
            title: 'مطبوعات شركة', 
            category: 'طباعة', 
            image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop', 
            description: 'مطبوعات احترافية للشركة' 
        }
    ],
    
    clients: [
        { 
            id: 1, 
            name: 'مجموعة الفطيم', 
            logo: 'https://images.unsplash.com/photo-1614680376593-902f74cf389e?q=80&w=400&auto=format&fit=crop' 
        },
        { 
            id: 2, 
            name: 'أوراسكوم للإنشاءات', 
            logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop' 
        },
        { 
            id: 3, 
            name: 'موبينيل', 
            logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop' 
        },
        { 
            id: 4, 
            name: 'اتصالات', 
            logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop' 
        }
    ],
    
    testimonials: [
        { 
            name: 'مصطفى عبدالله', 
            company: 'شركة أوراسكوم', 
            text: 'خدماتهم جودة عالية وتوصي بوقت معقول', 
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' 
        },
        { 
            name: 'سارة محمد', 
            company: 'مجموعة الفطيم', 
            text: 'تعاون ممتاز ومساعدة في كل مرحلة', 
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' 
        }
    ],
    
    services: [
        { title: 'تصميم جرافيكي', description: 'تصميم احترافي لجميع احتياجاتك', icon: 'fa-palette' },
        { title: 'طباعة', description: 'طباعة عالية الجودة لجميع المطبوعات', icon: 'fa-print' },
        { title: 'حفر ليزر', description: 'حفر دقيق على جميع المواد', icon: 'fa-laser' },
        { title: 'تسويق رقمي', description: 'حلول تسويقية متكاملة', icon: 'fa-bullhorn' }
    ],
    
    blog: []
};

// ==========================================
// ALBAHRAWY OS - ENTERPRISE DATA ENGINE (for dashboard.html)
// ==========================================

(function() {
    'use strict';

    const CONFIG = {
        STORAGE_KEY: 'albahrawy_os_enterprise',
        BACKUP_KEY: 'albahrawy_os_backups',
        MAX_BACKUPS: 50,
        AUTO_SAVE_INTERVAL: 10000
    };

    const Utils = {
        generateId: () => `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`,
        formatCurrency: (amount) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount || 0),
        formatNumber: (num) => new Intl.NumberFormat('ar-EG').format(num || 0),
        deepClone: (obj) => JSON.parse(JSON.stringify(obj)),
        now: () => new Date().toISOString()
    };

    function getDefaultData() {
        const now = Utils.now();
        return {
            version: '3.0',
            lastUpdated: now,
            
            // 01 - Blueprint
            blueprint: {
                vision: 'تحويل البحراوي للدعاية إلى مؤسسة ذكية رائدة عالمياً.',
                mission: 'تقديم حلول إبداعية متكاملة مدعومة بالذكاء الاصطناعي.',
                goals: ['أتمتة 90% من العمليات', 'زيادة الإيرادات بنسبة 200%', 'تحقيق رضا عملاء 100%'],
                revenueModel: 'SaaS + Project Based + Production',
            },

            // 02 - CEO Dashboard (Aggregated)
            ceoStats: {
                realtimeRevenue: 1250000,
                netProfit: 450000,
                expenses: 800000,
                activeDeals: 45,
                teamPerformance: 94,
                aiInsights: [
                    'توقعات بزيادة الطلب على المطبوعات بنسبة 15% الشهر القادم.',
                    'حملة "الصيف" تحقق أعلى عائد استثمار حالياً.',
                    'تحسين تدفق السيولة بنسبة 10% عبر الأتمتة.'
                ]
            },

            // 03 - Smart CRM
            crm: {
                leads: [
                    { id: 'l1', name: 'مجموعة الفطيم', score: 95, status: 'hot', value: 500000 },
                    { id: 'l2', name: 'أوراسكوم للإنشاءات', score: 88, status: 'warm', value: 1200000 }
                ],
                pipeline: [
                    { stage: 'Discovery', deals: [
                        { id: 'd1', name: 'Identity Revamp - Futtaim', value: 250000, owner: 'أحمد علي' }
                    ] },
                    { stage: 'Proposal', deals: [
                        { id: 'd2', name: 'Billboard Campaign - Cairo Festival', value: 450000, owner: 'سارة حسن' }
                    ] },
                    { stage: 'Negotiation', deals: [
                        { id: 'd3', name: 'Digital Transformation - Orascom', value: 850000, owner: 'محمود خالد' }
                    ] },
                    { stage: 'Closed', deals: [
                        { id: 'd4', name: 'Annual Print Contract - Etisalat', value: 1200000, owner: 'أحمد علي' }
                    ] }
                ],
                customerScoreHistory: []
            },

            // 04 - Growth & Marketing
            marketing: {
                campaigns: [
                    { id: 'c1', name: 'Omnichannel Launch', budget: 100000, spent: 45000, roi: 3.5 },
                ],
                contentCalendar: [],
                automationRules: [
                    { if: 'new_lead', then: 'send_whatsapp_intro', action: 'notify_sales' }
                ],
                adsAnalytics: { meta: {}, google: {}, tiktok: {} }
            },

            // 05 - Projects OS
            projects: [
                { id: 'p1', name: 'Identity Design - Nile Dev', progress: 65, status: 'on_track', deadline: '2026-07-20' }
            ],

            // 06 - Creative Studio
            studio: {
                requests: [
                    { id: 'r1', name: 'Social Media Post - Summer Offer', status: 'pending' },
                    { id: 'r2', name: 'Logo Design - Nile Dev', status: 'in_progress' }
                ],
                assets: [],
                brandLibrary: {}
            },

            // 07 - Production & Printing
            production: {
                queue: [
                    { id: 'j1', job: 'Billboard Print - Cairo Festival', machine: 'HP Scitex', progress: 45, status: 'Printing' },
                    { id: 'j2', job: 'Business Cards - Orascom', machine: 'Heidelberg', progress: 100, status: 'Completed' }
                ],
                materials: { acrylic: 500, flex: 1200, ink: 45 },
                qualityControl: []
            },

            // 08 - Finance ERP
            finance: {
                invoices: [],
                cashflow: [],
                taxes: { vat: 14, income: 22.5 },
                treasury: 1500000
            },

            // 09 - HR Intelligence
            hr: {
                employees: [
                    { id: 'e1', name: 'أحمد علي', role: 'Creative Director', performance: 98 }
                ],
                attendance: [],
                kpis: []
            },

            // 10 - AI Layer
            aiAssistant: {
                logs: [],
                recommendations: []
            },

            settings: {
                theme: 'luxury-dark',
                notifications: true,
                autoPilot: true
            }
        };
    }

    const Storage = {
        save: (data) => localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data)),
        load: () => JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || getDefaultData()
    };

    window.AlbahrawyOS = {
        data: Storage.load(),
        save: function() {
            this.data.lastUpdated = Utils.now();
            Storage.save(this.data);
        },
        Utils: Utils
    };

})();

