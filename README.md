# AI Explorers

An online course that teaches kids 7-12 how AI and large language models actually work,
beginner to advanced - with a real AI tutor to practice on along the way.

## What this is

Not a trivia game with an AI theme bolted on - a structured **course**:

- **3 levels → 6 units → 17 lessons**, unlocked one at a time in a fixed learning path
  (Beginner "Meet AI" → Intermediate "Talk Like an AI Pro" → Advanced "Smart & Safe AI Use")
- Every lesson has **written content + an AI-generated illustration**, a short quiz
  (60% to pass and unlock the next lesson), and an **"Ask Botly" AI tutor chat** so kids
  practice the actual skill of talking to an AI, not just read about it
- Light motivation layer: XP, a daily learning streak, and badges - no competitive game
  modes or leaderboards
- Full **Hebrew + English** support with RTL layout; a learner's language choice is saved
  to their account and used for their lesson content, quizzes, and the AI tutor's replies
- Built toward WCAG 2.1 AA practices (skip link, keyboard focus, reduced-motion support,
  accessibility statement page) as a technical basis for Israeli Standard 5568

## Stack

- **Client**: React + TypeScript + Tailwind CSS + Vite, React Router, TanStack Query, Zustand, Framer Motion
- **Server**: Node.js + Express + TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **AI**: Anthropic (Claude), OpenAI, or Gemini, pluggable via `AI_PROVIDER`, powers only the
  AI Tutor chat (lesson content itself is hand-authored, not regenerated per request)

## Project structure

```
ai-explorers/
  shared/    # Types shared between client and server (@ai-explorers/shared)
  server/    # Express API + Prisma schema + curriculum content (prisma/curriculum*.ts)
  client/    # Vite + React frontend
  render.yaml       # Render deployment config for the API
```

## 1. Prerequisites

- Node.js 18.18+
- A PostgreSQL database - Docker Desktop (`docker compose up -d` from the repo root) or a
  free hosted Postgres (Neon, Supabase, Railway)

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

`server/.env` already exists with working local defaults. Point `DATABASE_URL` at your
Postgres instance (Docker default matches `docker-compose.yml` already).

AI keys are optional - without them, the AI Tutor still works using a small set of
friendly canned replies in both languages, so the course is never blocked.

```
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."
```

## 4. Set up the database

```bash
npm run db:migrate    # creates tables from server/prisma/schema.prisma
npm run db:seed       # seeds the full curriculum (3 levels/6 units/17 lessons/51 quiz
                       # questions in EN+HE), 8 achievements, and an admin account
```

The seed script prints the admin login (default `admin@aiexplorers.local` /
`ChangeMe123!` - override via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `server/.env`
before seeding). Sign in with that account to unlock `/admin`.

Lesson illustrations are pulled from `server/prisma/lessonImages.json` (already populated
with generated image URLs) during seeding - re-run `npm run db:seed` any time the
curriculum content or images change.

## 5. Run it

```bash
npm run dev
```

Runs the API on **http://localhost:4100** and the client on **http://localhost:5273**
(Vite proxies `/api` to the server).

## Useful scripts

| Command | What it does |
|---|---|
| `npm run dev` | Run client + server together |
| `npm run build` | Production build of shared + server + client |
| `npm run db:migrate` | Create/apply a Prisma migration (dev) |
| `npm run db:seed` | Re-run the seed script (curriculum content lives in `server/prisma/curriculum.ts` + `curriculum.he.ts`) |
| `npm run db:studio` | Open Prisma Studio to browse the database |

## Deployment

**Frontend → Vercel**: import the repo, set **Root Directory** to `client`.
`client/vercel.json` is already configured. Set `VITE_API_URL` to your deployed API's
URL + `/api`.

**Backend → Render**: `render.yaml` at the repo root defines the web service + a free
Postgres database - "New +" → "Blueprint" in the Render dashboard. Fill in
`CLIENT_ORIGIN` and your AI API keys. The build step runs `prisma migrate deploy`
automatically; run `npm run db:seed --workspace=server` once via the Render shell to
seed the curriculum.

## Editing the curriculum

Lesson content, quiz questions, and achievements are hand-authored (not AI-generated at
request time) so the course stays pedagogically consistent. Edit them either:

- **In code**: `server/prisma/curriculum.ts` (English) and `curriculum.he.ts` (Hebrew,
  mirrored by `level.key` → `unit.key` → `lesson.key`), then `npm run db:seed`
- **In the admin panel**: `/admin/curriculum` - browse the tree, edit a lesson's text/
  images/quiz questions directly, no redeploy needed
