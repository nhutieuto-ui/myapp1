# myapp1 — Copilot Instructions

## Tech stack
- **Frontend & API:** Next.js (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Neon serverless Postgres accessed via Drizzle ORM
- **Auth:** Auth.js (NextAuth v5) with the Drizzle adapter
- **E2E tests:** Playwright
- **Deployment:** Vercel

## Rules
- Never query the database from client components; use server components, server actions, or route handlers.
- Define all tables in `src/lib/db/schema.ts`; generate migrations with `npm run db:generate`, apply with `npm run db:migrate`.
- Import the db client from `@/lib/db` — do not construct new Neon clients.
- Read the session with `auth()` from `@/auth` on the server; never trust a client-supplied user id.
- Validate all external input with zod at the route handler / server action boundary.
- Keep secrets in `.env.local`; document new variables in `.env.example`.
