// ==========================================
// ALBAHRAWY OS - ENTERPRISE DATA ENGINE v3.0
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
