# ALBAHRAWY OS - Enterprise Architecture

## 01 — Folder Structure (Monorepo)
```
/
├── apps/
│   ├── web/                    # Next.js Frontend (SaaS UI)
│   └── api/                    # NestJS Backend (REST + GraphQL + WebSocket)
├── packages/
│   ├── ui/                     # Shared UI Components (ShadCN + Custom Luxury)
│   ├── types/                  # TypeScript Types & Interfaces
│   ├── config/                 # Config Files (Env, Tailwind, Etc.)
│   └── shared/                 # Shared Logic (Utils, Helpers, Hooks)
├── legacy/                     # Original Prototype (for reference)
├── docker/                     # Docker Compose, Nginx Config
└── package.json
```

---

## 02 — Database Design (ERD - Prisma)

### Core Tables:
- **Users**: System users & employees
- **Roles/Permissions**: RBAC
- **CRM**: Leads, Clients, Deals, Activities, Meetings, Contracts
- **Projects**: Projects, Tasks, TimeLogs, Dependencies
- **Marketing**: Campaigns, Ads, Budgets, Automation
- **Finance**: Invoices, Payments, Expenses, Treasury
- **HR**: Employees, Attendance, Payroll, Goals
- **Production**: Orders, Machines, Queue, Materials, Inventory
- **Content**: Assets, Files, Folders
- **AI**: ChatLogs, Reports, Insights
- **Realtime**: Notifications, AuditLogs

---

## 03 — Tech Stack
| Layer         | Technology                                  |
|---------------|--------------------------------------------|
| **Frontend**  | Next.js 15, TypeScript, Tailwind CSS, ShadCN |
| **Backend**   | NestJS, TypeScript, REST + WebSocket       |
| **Database**  | PostgreSQL 16 + Prisma ORM                 |
| **Cache**     | Redis 7                                    |
| **Storage**   | Cloud Storage (AWS S3/GCS)                 |
| **CI/CD**     | GitHub Actions, Docker                     |

---

## 04 — Migration Plan from Prototype
1. **Phase 1 (Current)**: Architecture Refactor & Database Schema
2. **Phase 2**: Authentication & Core APIs
3. **Phase 3**: CRM, Projects, Marketing Migration
4. **Phase 4**: AI, Realtime, Finance, HR, Production
5. **Phase 5**: Deployment & Observability
