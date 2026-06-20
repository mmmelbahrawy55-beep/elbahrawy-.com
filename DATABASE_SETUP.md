# إعداد قاعدة البيانات
=================

## المتطلبات الأساسية
- **PostgreSQL**: تثبيت PostgreSQL على جهازك أو استخدم خدمة مثل:
  - [PostgreSQL Download](https://www.postgresql.org/download/)
  - أو استخدم Railway/AWS RDS/Vercel Postgres للإنتاج

---

## الخطوات السريعة

1. **نسخ ملف المتغيرات**:
```bash
cp .env.example .env
```

2. **تحديث معلومات قاعدة البيانات**:
في ملف `.env`، عدل قيمة `DATABASE_URL` ليكون:
```env
DATABASE_URL="postgresql://اسم_المستخدم:كلمة_المرور@localhost:5432/elbahrawy_db"
```
*إزاد حذف "elbahrawy_db" اسم قاعدة البيانات الخاصة بك

3. **تثبيت الاعتماديات**:
```bash
npm install
```

4. **توليد وتطبيق قاعدة البيانات:
```bash
cd packages/database
npm run db:generate
```

5. **تطبيق الهيكل قاعدة البيانات**:
```bash
# إذا كنت تريد تحديث قاعدة البيانات:
npm run db:push
```

5. **تعبئة البيانات الافتراضية (النصيحة):
```bash
npm run db:seed
```
---

## معلومات الحسابات الافتراضية (بعد تشغيل seed)
| Email: admin@elbahrawy.com
Password: admin123

Email: manager@elbahrawy.com
Password: admin123

---

## لاستخدام قاعدة بيانات SQLite (للتطوير فقط)
إذا كنت تريد استخدام SQLite بدللمطابق للاا:
تعديل ملف schema.prisma إلى:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```
