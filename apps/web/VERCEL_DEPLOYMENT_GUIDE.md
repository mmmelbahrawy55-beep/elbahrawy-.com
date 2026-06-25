# دليل النشر على Vercel (النسخة المحدثة)
الخطوات هذه هي الأكثر فعالية وستضمن لك عمل الموقع بدون أخطاء!

---

## 🔧 الخطوة 1: إعداد قاعدة البيانات PostgreSQL (مطلوبة!)
Vercel لا يدعم SQLite في الإنتاج، لذلك نحتاج لقاعدة بيانات PostgreSQL.
**الخيار الأفضل: Vercel Postgres (مجاني للاستخدام الأساسي):**
1.  اذهب إلى حسابك على Vercel.
2.  اختر مشروعك أو اضف مشروع جديد.
3.  اضغط على **Storage** → **Create Database** → اختر **Postgres**.
4.  اتبع الخطوات لإنشاء القاعدة. Vercel سيضيف المتغيرات `DATABASE_URL` و `DIRECT_URL` تلقائيًا إلى إعدادات المشروع!

**الخيار الثاني: Neon (الجودة العالية ومجاني):**
1.  سجل دخول على [neon.tech](https://neon.tech)
2.  أنشئ مشروع جديد واسميّه `elbahrawy_db`
3.  نسخ رابط الاتصال (Connection String) وانسخه في `DATABASE_URL`
4.  نسخ رابط الاتصال المباشر (Direct Connection) وانسخه في `DIRECT_URL`

---

## 🚀 الخطوة 2: رفع المشروع على GitHub/GitLab/Bitbucket
تأكد من أنك رفعت جميع الملفات على Git (باستثناء ملفات `node_modules` و `.env`):
```bash
git add .
git commit -m "جاهز للنشر على Vercel"
git push origin main
```

---

## ☁️ الخطوة 3: استيراد المشروع على Vercel
1.  اذهب إلى [vercel.com/new](https://vercel.com/new)
2.  استورد مستودعك (Repository) اللي رفعت للتو.
3.  **إعدادات مهمة:**
    *   **Root Directory**: اختر `apps/web`
    *   **Framework Preset**: Vercel سيتعرف تلقائيًا على Next.js.
4.  اضغط على **Deploy**!

---

## 🛠️ الخطوة 4: إضافة المتغيرات البيئية (لو لم تُضف تلقائيًا)
اذهب إلى **Settings** → **Environment Variables** وضف المتغيرات اللي في ملف `.env.example`:
1.  `DATABASE_URL` = رابط قاعدة بيانات PostgreSQL اللي جبتها من Vercel أو Neon
2.  `DIRECT_URL` = نفس الرابط أو الرابط المباشر

**لمسح جميع الكاش وربuild بعد إضافة المتغيرات:**
اذهب إلى **Deployments** → اختر آخر عملية نشر → اضغط على الـ 3 نقاط → **Redeploy**.

---

## 📊 الخطوة 5: تهيئة قاعدة البيانات بعد النشر
هذا خطوة حاسمة عشان البيانات اللي نضيفها تتحفظ!
تستخدم Vercel CLI أو تتحكم من محلي:

**الطريقة السهلة (من جهازك):**
1.  استخدم Vercel CLI:
    ```bash
    npm install -g vercel
    vercel link  # ربط مشروعك المحلي بالمشروع على Vercel
    vercel env pull .env.local  # تحمل المتغيرات من Vercel إلى ملف .env.local
    ```
2.  اذهب إلى مجلد قاعدة البيانات:
    ```bash
    cd "g:\New folder\packages\database"
    npx prisma db push  # ينشئ كل الجداول في قاعدة البيانات على الإنترنت
    npx prisma db seed  # (اختياري) يضيف البيانات الافتراضية
    ```
---

## 🧪 اختبار الموقع بعد النشر
1.  افتح رابط الموقع اللي Vercel أعطاك.
2.  سجل الدخول في `/dashboard` باستخدام:
    *   البريد: `admin@albahrawy.com`
    *   كلمة المرور: `admin123`
3.  أضف قسم جديد في **الأقسام**.
4.  اذهب إلى الصفحة الرئيسية وتأكد من ظهور القسم اللي أضفته! 🎉

---

## ❌ ماذا لو حصل خطأ؟
1.  **خطأ في قاعدة البيانات:** تحقق من أن `DATABASE_URL` صحيح وإنك شغلت `npx prisma db push`.
2.  **لا يظهر الأقسام:** اضغط Ctrl+Shift+R لتحديث الصفحة بدون الكاش، وتأكد من أنك في `/dashboard` وقمت بحفظ البيانات.
3.  **خطأ في الـ Build:** تحقق من إعدادات **Root Directory** أنها `apps/web`.

---

## 💡 بديل سهل: استخدام Vercel Postgres
هذه هي الطريقة الأضمن لأن Vercel يديرها لك. فقط اتبع الخطوة الأولى وتأكد من أنك تشغلت `npx prisma db push`!

For more help, check the [Vercel Documentation](https://vercel.com/docs) or the [Prisma Documentation](https://www.prisma.io/docs).
