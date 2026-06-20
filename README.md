# 🏢 ALBAHRAWY OS

Enterprise Digital Operating System for ALBAHRAWY Advertising & Marketing Agency

![ALBAHRAWY OS](https://img.shields.io/badge/version-1.0.0-gold)
![Tech Stack](https://img.shields.io/badge/tech-Enterprise-blue)

---

## 📐 Architecture Overview

### Monorepo Structure

```
.
├── apps/
│   ├── web/          # Next.js Frontend (SaaS UI)
│   └── api/          # NestJS Backend (REST + WebSockets)
├── packages/
│   ├── database/     # Prisma ORM & DB Schema
│   ├── shared/       # Shared Utilities & Env Validation
│   ├── types/        # Shared TypeScript Types
│   ├── config/       # Centralized Configuration
│   └── ui/           # Shared UI Components (ShadCN-based)
├── legacy/           # Original Prototype (Archived)
├── docker-compose.yml# Local Infrastructure
├── turbo.json        # Turborepo Configuration
└── package.json      # Root Package.json
```

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Data Visualization

### Backend

- **NestJS** - Enterprise Node.js Framework
- **TypeScript**
- **Prisma ORM** - Database ORM
- **Passport.js + JWT** - Authentication
- **Socket.io** - Real-time Features

### Infrastructure

- **PostgreSQL 16** - Relational Database
- **Redis 7** - Caching & Real-time
- **Docker** - Local Infrastructure
- **Turborepo** - Monorepo Management

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker Desktop (for Postgres & Redis)
- npm 10+

### 1. Environment Setup

First, copy the example env files:

```bash
# Root
cp .env.example .env

# Frontend
cp apps/web/.env.example apps/web/.env

# Backend
cp apps/api/.env.example apps/api/.env
```

Update the `.env` files with your configuration.

### 2. Start Local Infrastructure

Run PostgreSQL and Redis:

```bash
docker-compose up -d
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Database

```bash
# Generate Prisma Client
cd packages/database
npm run db:generate

# Push Schema to DB
npm run db:push

# Seed Initial Data (Roles)
npm run db:seed
```

### 5. Run the App

```bash
# From the project root
npm run dev
```

This will start:

- Frontend → http://localhost:3000
- Backend → http://localhost:3001
- Prisma Studio → http://localhost:5556 (if you run `npm run dev` in `packages/database`)

---

## 📱 Features

### ✅ Completed

- [x] Monorepo Architecture (Turborepo)
- [x] Next.js Frontend with Luxury Black & Gold Design
- [x] NestJS Backend Skeleton
- [x] Prisma Database Schema (All Modules)
- [x] JWT Authentication
- [x] Role-Based Access Control (RBAC)
- [x] CEO Command Center Dashboard
- [x] AI Assistant Panel (Mock for now)
- [x] CRM Pipeline (UI)
- [x] Projects Management (UI)
- [x] Marketing Campaigns (UI)
- [x] Database Seed Script

### 🔄 In Progress

- [ ] Real API Integration for All Modules
- [ ] Full AI Integration (LLM)
- [ ] Real-time Notifications (Socket.io)
- [ ] File Upload System
- [ ] Production & Printing Module
- [ ] Finance & ERP Module
- [ ] HR & Team Intelligence
- [ ] Creative Studio
- [ ] Unit & E2E Tests
- [ ] Dockerization for Production
- [ ] CI/CD Pipeline

---

## 🏗️ Database ERD (Key Models)

1. **Users & Auth** - Users, Roles, Permissions, Audit Logs
2. **CRM** - Clients, Leads, Deals, Activities, Meetings, Contracts
3. **Projects** - Projects, Tasks, Time Logs, Dependencies
4. **Marketing** - Campaigns, Ads, Automations
5. **Finance** - Invoices, Payments, Expenses
6. **HR** - Employees, Attendance, Payroll, Goals
7. **Production** - Production Orders, Machines, Materials
8. **Content** - Files, Folders
9. **AI** - Chat Logs, Reports, Insights
10. **Realtime** - Notifications

---

## 📝 Scripts

### Root (Turborepo)

- `npm run dev` - Start all apps in dev mode
- `npm run build` - Build all packages & apps
- `npm run lint` - Run linters across everything
- `npm run format` - Format code with Prettier
- `npm run clean` - Clean node_modules & dist

### Frontend (apps/web)

- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production
- `npm start` - Start production server

### Backend (apps/api)

- `npm run dev` - Start NestJS dev server
- `npm run build` - Build for production
- `npm start` - Start production server

### Database (packages/database)

- `npm run dev` - Start Prisma Studio
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to DB
- `npm run db:migrate` - Create and apply migration
- `npm run db:seed` - Seed initial data

---

## 🎨 Design System

### Brand Colors

- **Primary Gold**: `#FFD700`
- **Deep Black**: `#050505`
- **Card Background**: `#0F0F0F`
- **Muted Text**: `#A0A0A0`

### Typography

- **Inter & Cairo** - Arabic & English Support
- **Lucide** - Modern Icon Library

### Components

- Luxury Cards with Hover Effects
- Gradient Borders
- Glassmorphism Elements
- Premium Shadows & Glows

---

## 📚 Documentation

For detailed architecture, API documentation, and more, see the `ARCHITECTURE.md` file.

---

## 👥 Team

- **CEO Dashboard** - High-level metrics and AI insights
- **Sales Team** - CRM & Deal management
- **Marketing Team** - Campaigns & Analytics
- **Designers** - Creative Studio & Assets
- **Production** - Printing & Manufacturing
- **Finance** - Invoices & Treasury
- **HR** - Employees & Performance

---

## 📄 License

Proprietary - All rights reserved © 2026 ALBAHRAWY Group
