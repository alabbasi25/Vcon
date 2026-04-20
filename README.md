# كوكب كوكاب (Kokab Planet) - Full-Stack Edition

تطبيق متكامل لإدارة الحياة الزوجية بأسلوب "التلعيب" (Gamification)، يهدف لتعزيز التواصل، التنظيم المالي، والنمو الروحي والمشترك.

## هيكلية المشروع (Project Structure)

تم تقسيم المشروع ليكون قابلاً للتوسع ومنظماً بشكل احترافي:

```text
.
├── server.ts                # خادم Express (Backend) - يدير الـ API والحالة المشتركة
├── package.json             # ملف الإعدادات والاعتمادات
├── src/
│   ├── main.tsx             # نقطة الدخول للـ Frontend
│   ├── App.tsx              # المكون الأساسي وإدارة المستخدمين
│   ├── types.ts             # تعريفات TypeScript لكافة أنواع البيانات
│   ├── context/
│   │   └── KokabContext.tsx # إدارة الحالة العالمية (State Management)
│   ├── components/
│   │   ├── layout/          # مكونات الهيكل العام (Dashboard, Sidebar)
│   │   ├── ui/              # مكونات واجهة المستخدم القابلة لإعادة الاستخدام (Inputs, Buttons)
│   │   ├── features/        # الميزات الأساسية (Arena, Ledger, Worship, etc.)
│   │   └── views/           # الصفحات والواجهات الرئيسية (Profile, FinanceView)
│   └── lib/                 # المكتبات والأدوات المساعدة
└── dist/                    # ملفات الإنتاج الجاهزة (بعد الـ Build)
```

## الميزات التقنية (Technical Features)

- **Backend (Express):** يوفر نقاط اتصال API لإدارة حالة التطبيق بشكل مركزي.
- **Frontend (React + Vite):** واجهة سريعة وتفاعلية مع دعم كامل للغة العربية (RTL).
- **State Management (Context API):** إدارة حالة معقدة تشمل أكثر من 18 نظاماً فرعياً.
- **Animations (Framer Motion):** تجربة مستخدم حيوية مع حركات انتقالية سلسة.
- **Styling (Tailwind CSS):** تصميم عصري يعتمد على المتغيرات اللونية (Theming).

## طريقة التشغيل (How to Run)

### في بيئة التطوير (Development)

1. تأكد من تثبيت كافة الاعتمادات:
   ```bash
   npm install
   ```
2. قم بتشغيل خادم التطوير (الذي يشغل الـ Backend والـ Frontend معاً):
   ```bash
   npm run dev
   ```
3. سيفتح التطبيق على المنفذ `3000`.

### للإنتاج (Production)

1. قم ببناء ملفات الـ Frontend:
   ```bash
   npm run build
   ```
2. قم بتشغيل الخادم في وضع الإنتاج:
   ```bash
   NODE_ENV=production npm start
   ```

## ملاحظات للمطورين

- التطبيق يدعم **وضع التجربة (Testing Mode)** الذي يمكن تفعيله من صفحة الملف الشخصي لملء البيانات آلياً.
- يمكن التبديل بين المستخدمين (فهد وبشرى) لمحاكاة التفاعل الحقيقي.
- جميع الأيقونات مستخدمة من مكتبة `lucide-react`.
