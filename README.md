<div align="center">

# ⚡ BetaVolt

### Smart Infrastructure & Energy Solutions Platform

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

A production-ready, bilingual corporate web platform built for MEP and smart infrastructure companies — featuring a headless CMS, role-based access control, and a CRM-lite inquiry management system.

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)

---

## ✨ Features

### 🌐 Bilingual Front-End (EN / AR)
Full English ↔ Arabic toggle with automatic LTR/RTL layout switching using Tailwind CSS logical properties (`ps-`, `pe-`, `ms-`, `me-`). Locale is persisted across sessions via cookies and handled seamlessly through `next-intl`.

### 🗂️ Custom Headless CMS
A bespoke admin panel allows authorized users to edit **all** website content dynamically — hero text, service descriptions, stats, footer links, quote modal options, and more — with changes reflected on the live site instantly. No third-party CMS dependency.

### 🔐 Role-Based Access Control (RBAC)
A secure 3-tier permission system enforced at both the **UI** and **API route** levels via Next.js Middleware:

| Role | Dashboard | Content Mgmt | Inquiries | User Accounts |
|---|---|---|---|---|
| `super_admin` | ✅ | ✅ | ✅ | ✅ |
| `content_manager` | ✅ | ✅ | ❌ | ❌ |
| `sales` | ✅ | ❌ | ✅ | ❌ |

Roles are stored in Supabase `user_metadata` and resolved server-side on every request — no client-side trust.

### 📥 Smart Inquiries System
A CRM-lite inbox that receives quote requests submitted through the public-facing contact form. Admins can view inquiry details, read attached PDF files directly within the dashboard, and update inquiry status (`new`, `read`, `replied`).

### 👤 Centralized User Provisioning
Secure admin account creation, role assignment, and password resets — all performed server-side using the Supabase Service Role Key via Next.js Server Actions. No admin can create users with privileges exceeding their own.

### 🎬 Dynamic Hero Media Manager
Admins can replace the hero section's visual with a custom video or a multi-image slideshow — directly from the admin panel. The slideshow auto-advances with smooth cross-fade transitions.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) |
| **Backend / Auth** | [Supabase](https://supabase.com/) (Auth, PostgreSQL, Storage) |
| **i18n** | [next-intl](https://next-intl-docs.vercel.app/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Fonts** | Google Fonts (Orbitron, Cairo) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js **18.17+**
- A [Supabase](https://supabase.com/) project

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/betavolt.git
cd betavolt

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your values — see Environment Variables below

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the public site.
The admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin).

### Creating the First Admin Account

The admin panel has no public sign-up. Create the first user manually:

1. Go to your **Supabase Dashboard → Authentication → Users → Add User**
2. Set email, password, and enable **Auto Confirm User**
3. In the **User Metadata** field, add: `{ "role": "super_admin" }`
4. Log in at `/admin/login`

### Database Setup

Run the following in your Supabase SQL Editor to create the required tables:

```sql
-- Content store (key-value CMS)
CREATE TABLE site_content (
  key        TEXT PRIMARY KEY,
  content    JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inquiries / quote requests
CREATE TABLE inquiries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  subject      TEXT NOT NULL,
  message      TEXT,
  status       TEXT DEFAULT 'new',
  attachment   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# ── Supabase ─────────────────────────────────────────────────
# Your project's public URL
NEXT_PUBLIC_SUPABASE_URL=

# Public anon key (safe to expose in the browser)
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Service role key — NEVER expose this publicly
# Used only in Server Actions and API Route Handlers
SUPABASE_SERVICE_ROLE_KEY=
```

> **Security Note:** The `SUPABASE_SERVICE_ROLE_KEY` bypasses all Row Level Security policies. It is used exclusively in server-side code and is never sent to the client.

---

<div align="center">
  <sub>Built with ⚡ by the BetaVolt Team</sub>
</div>

---
---

<div align="center" dir="rtl">

# ⚡ بيتا فولت

### منصة البنية التحتية الذكية وحلول الطاقة

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

منصة ويب مؤسسية ثنائية اللغة جاهزة للإنتاج، مبنية لشركات المقاولات الكهروميكانيكية والبنية التحتية الذكية — تضم نظام إدارة محتوى مخصصاً، وتحكماً في الصلاحيات على أساس الأدوار، ونظام إدارة استفسارات متكاملاً.

</div>

---

<div dir="rtl">

## 📋 فهرس المحتويات

- [المميزات](#-المميزات)
- [التقنيات المستخدمة](#-التقنيات-المستخدمة)
- [البدء السريع](#-البدء-السريع)
- [متغيرات البيئة](#-متغيرات-البيئة)

---

## ✨ المميزات

### 🌐 واجهة ثنائية اللغة (EN / AR)
تبديل كامل بين الإنجليزية والعربية مع تغيير تلقائي لاتجاه التخطيط من اليسار لليمين (LTR) وبالعكس (RTL)، باستخدام الخصائص المنطقية في Tailwind CSS. يتم حفظ تفضيل اللغة عبر ملفات الكوكيز ومعالجته بسلاسة من خلال `next-intl`.

### 🗂️ نظام إدارة محتوى مخصص (Headless CMS)
لوحة تحكم إدارية مخصصة تتيح للمستخدمين المصرح لهم تعديل **جميع** محتويات الموقع ديناميكياً — نصوص قسم الهيرو، وأوصاف الخدمات، والإحصائيات، وروابط التذييل، وخيارات نموذج طلب العرض وغيرها — مع انعكاس التغييرات فورياً على الموقع المباشر.

### 🔐 التحكم في الوصول على أساس الأدوار (RBAC)
نظام صلاحيات ثلاثي الطبقات مُطبَّق على مستوى **واجهة المستخدم** و**مسارات API** عبر Next.js Middleware:

| الدور | لوحة التحكم | إدارة المحتوى | الاستفسارات | حسابات المدير |
|---|---|---|---|---|
| `super_admin` | ✅ | ✅ | ✅ | ✅ |
| `content_manager` | ✅ | ✅ | ❌ | ❌ |
| `sales` | ✅ | ❌ | ✅ | ❌ |

تُخزَّن الأدوار في `user_metadata` الخاص بـ Supabase وتُحلَّل من جانب الخادم مع كل طلب — دون أي اعتماد على جانب العميل.

### 📥 نظام استفسارات ذكي
صندوق بريد وارد يستقبل طلبات عروض الأسعار المُرسَلة عبر نموذج التواصل في الموقع. يتيح للمديرين عرض تفاصيل الاستفسار وقراءة مرفقات PDF مباشرةً داخل لوحة التحكم، وتحديث حالة الاستفسار (`جديد`، `مقروء`، `تم الرد`).

### 👤 إدارة حسابات المديرين
إنشاء حسابات المديرين، وتعيين الأدوار، وإعادة تعيين كلمات المرور — جميعها تتم من جانب الخادم باستخدام مفتاح الخدمة Service Role Key عبر Server Actions في Next.js. لا يستطيع أي مدير إنشاء مستخدمين بصلاحيات تتخطى صلاحياته.

### 🎬 مدير وسائط الهيرو الديناميكي
يتيح للمديرين استبدال المحتوى المرئي في قسم الهيرو بفيديو مخصص أو عرض شرائح متعدد الصور — مباشرةً من لوحة التحكم. يتقدم عرض الشرائح تلقائياً بتأثيرات انتقال سلسة.

---

## 🛠️ التقنيات المستخدمة

| الطبقة | التقنية |
|---|---|
| **الإطار** | [Next.js 14](https://nextjs.org/) (App Router) |
| **لغة البرمجة** | TypeScript 5 |
| **التنسيق** | [Tailwind CSS 3](https://tailwindcss.com/) |
| **الخلفية / المصادقة** | [Supabase](https://supabase.com/) (Auth، PostgreSQL، Storage) |
| **التدويل** | [next-intl](https://next-intl-docs.vercel.app/) |
| **الأيقونات** | [Lucide React](https://lucide.dev/) |
| **الخطوط** | Google Fonts (Orbitron، Cairo) |

---

## 🚀 البدء السريع

### المتطلبات الأساسية

- Node.js **18.17** أو أحدث
- مشروع [Supabase](https://supabase.com/) نشط

### خطوات التثبيت

```bash
# 1. استنساخ المستودع
git clone https://github.com/your-username/betavolt.git
cd betavolt

# 2. تثبيت الاعتماديات
npm install

# 3. إعداد متغيرات البيئة
cp .env.example .env.local
# أضف قيمك — راجع قسم متغيرات البيئة أدناه

# 4. تشغيل خادم التطوير
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) لعرض الموقع العام.
لوحة التحكم متاحة على [http://localhost:3000/admin](http://localhost:3000/admin).

### إنشاء أول حساب مدير

لا توجد صفحة تسجيل عامة في لوحة التحكم. أنشئ المستخدم الأول يدوياً:

1. افتح **Supabase Dashboard ← Authentication ← Users ← Add User**
2. أدخل البريد الإلكتروني وكلمة المرور، وفعّل **Auto Confirm User**
3. في حقل **User Metadata**، أضف: `{ "role": "super_admin" }`
4. سجّل الدخول عبر `/admin/login`

### إعداد قاعدة البيانات

نفّذ الاستعلامات التالية في Supabase SQL Editor لإنشاء الجداول المطلوبة:

```sql
-- مخزن المحتوى (نظام مفتاح-قيمة للـ CMS)
CREATE TABLE site_content (
  key        TEXT PRIMARY KEY,
  content    JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- الاستفسارات / طلبات عروض الأسعار
CREATE TABLE inquiries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  subject      TEXT NOT NULL,
  message      TEXT,
  status       TEXT DEFAULT 'new',
  attachment   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔑 متغيرات البيئة

أنشئ ملف `.env.local` في المجلد الجذري للمشروع بالمتغيرات التالية:

```env
# ── Supabase ─────────────────────────────────────────────────
# رابط مشروعك العام
NEXT_PUBLIC_SUPABASE_URL=

# مفتاح anon العام (آمن للاستخدام في المتصفح)
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# مفتاح الخدمة — لا تكشف عنه أبداً للعموم
# يُستخدم حصرياً في Server Actions ومعالجات API من جانب الخادم
SUPABASE_SERVICE_ROLE_KEY=
```

> **تنبيه أمني:** مفتاح `SUPABASE_SERVICE_ROLE_KEY` يتجاوز جميع سياسات أمان الصفوف (RLS). يُستخدم حصرياً في الكود الذي يعمل على الخادم ولا يُرسَل إلى المتصفح بأي شكل.

---

<div align="center">
  <sub>صُنع بـ ⚡ من فريق بيتا فولت</sub>
</div>

</div>
