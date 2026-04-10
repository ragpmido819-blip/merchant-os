# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the Merchant Operating System (MOS) SaaS dashboard.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### MOS Dashboard (`artifacts/mos-dashboard`)

A full SaaS dashboard called "Merchant Operating System (MOS)".

**Tech**: React + Vite, Tailwind CSS, wouter, Recharts, Framer Motion

**Features**:
- Arabic-first UI (RTL) with AR/EN language toggle
- Dark mode toggle
- Cairo Arabic font
- 9 pages: Dashboard, Orders, Products, Customers, Inbox, Analytics, Shipping, Returns, Team
- Mock data only (no backend)
- i18n via JSON translation files

**Key files**:
- `src/i18n/ar.json` / `src/i18n/en.json` — translations
- `src/i18n/LanguageContext.tsx` — language context + RTL control
- `src/i18n/useTranslation.ts` — translation hook
- `src/data/mockData.ts` — all mock data
- `src/components/Layout.tsx` — sidebar + navbar layout
- `src/components/ThemeProvider.tsx` — dark mode provider
- `src/components/StatusBadge.tsx` — status badge component
- `src/pages/` — all 9 dashboard pages

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
