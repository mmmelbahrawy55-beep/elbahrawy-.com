# دليل نشر الموقع على Firebase Hosting (الكامل)

## الخطوات السريعة لإنشاء الموقع أونلاين:

1. تأكد من تثبيت Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. تسجيل الدخول إلى Firebase (إذا لم تكن مسجل):
   ```bash
   firebase login
   ```

3. بناء المشروع (من مجلد الجذر):
   ```bash
   cd g:\New folder
   npm run build
   ```

4. نشر الموقع على Firebase Hosting:
   ```bash
   cd apps/web
   firebase deploy --only hosting
   ```

## التأكد من أن جميع البيانات محفوظة في Firebase Firestore:

✅ البيانات الآن تتحدث فورياً بين جميع الأجهزة!
✅ استخدمنا Firestore Snapshots عشان أي تحديث يظهر على الفور.

## أين تجد الموقع بعد النشر؟
ستحصل على رابط شبيه بـ `https://elba7rawy-91214.web.app`
