# Movie Watchlist

A small full-stack app for managing a personal movie watchlist — browse, add, search, delete, and generate descriptions with AI.

**Live app:** svexam.vercel.app
**Repo:** https://github.com/Aqoola111/svexam

---

## What it does (user flow)

1. Land on **All Movies** (`/all-movies`) — see every movie as a card with title, genre, synopsis, and a delete button.
2. **Add Movie** (`/add-movie`) — fill in title, pick a genre, write a description (or hit *Generate with AI*), submit. On success you get redirected back to the list.
3. **Search Movies** (`/search-movies`) — type a title, results update live as you type. No search button, same as the exam spec.
4. **Delete** — click delete on any card, toast confirms it, list refreshes.

Extra stuff I added on top of the bare minimum: sort newest/oldest, a random movie picker with a little roulette animation, and a sidebar for navigation.

---

## Stack (and why)

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 16** (App Router) | One repo, deploys straight to Vercel, server + client in the same project |
| Database | **PostgreSQL** (Neon) + **Prisma 7** | Hosted Postgres is free/easy on Vercel; Prisma gives typed queries and migrations |
| API layer | **Server Actions** + **next-safe-action** | Less boilerplate than Express routes; Zod validation runs before the handler |
| Forms | **react-hook-form** + **Zod** | Client validation with the same schemas the server uses |
| UI | **Tailwind 4** + **shadcn/ui** | Required by the exam; fast to build something that doesn't look like a homework template |
| AI | **Google Gemini** (`@google/generative-ai`) | Structured JSON output for descriptions; retry logic when the API rate-limits you |
| Toasts | **Sonner** | Nicer than `alert()` for errors and success messages |

I went with a modern Next.js full-stack setup instead of a separate Express server because the exam also asks for Vercel deploy — running one Next app is simpler than maintaining two repos.

---

## Differences from the exam spec

The PDF asks for **Express + MongoDB** with REST endpoints (`GET /movies`, `POST /movies`, etc.) and **Vercel AI Gateway** for `POST /movies/generate`.

Here's what I did differently and why:

| Exam spec | This project | Reason |
|-----------|--------------|--------|
| Express backend | Server Actions in `actions/movies.ts` | Same job — CRUD hits the DB — but fits the Next.js model and deploys as one unit |
| MongoDB | PostgreSQL + Prisma | Relational DB + Prisma schema enforces `VARCHAR(20)` / `VARCHAR(200)` at the DB level |
| `fetch` / `axios` to REST routes | `useAction` / `executeAsync` from next-safe-action | Still real server round-trips to a real database; just no manual HTTP client code |
| `POST /movies/generate` via AI Gateway | `generateDescription` server action → Gemini API | Direct Gemini call with `GEMINI_API_KEY`; returns the same `{ description }` shape |
| `alert()` on validation errors | Inline field errors + Sonner toasts | Better UX, still shows what's wrong |
| Genre as free-text input | Combobox with a fixed genre list | Stops typos, looks cleaner on cards |
| — | Random pick, sort, sidebar, mobile-first add form | Polish on top of required pages |

**What stayed the same:** routes `/all-movies`, `/add-movie`, `/search-movies`; live search without a button; title max 20 chars, description max 200; delete per card; AI generates description without auto-saving.

---

## How it works under the hood

```
Browser (client components)
    ↓  useAction / executeAsync
Server Actions (actions/movies.ts)  ← "use server"
    ↓  Zod validates input
Prisma → PostgreSQL (Neon)
```

- **Add / delete / list / search** — each action validates with Zod (`lib/validations/movie.ts`), talks to Prisma, then `revalidatePath` so cached pages stay fresh.
- **Search** — debounced 300ms on the client; server does a case-insensitive `contains` on title. Empty query returns `[]`.
- **AI description** — `lib/gemini.ts` calls Gemini with a JSON schema, trims to 200 chars, retries on 429/503. The key stays server-side only.
- **All Movies** — `useMovieList` fetches on mount and after delete; `useRandomMoviePick` runs a stepped timer for the roulette effect (timers cleared on unmount / cancel).
- **Mobile add form** — plain layout on small screens; at `md+` it gets border, shadow, and card padding. No heavy Card wrapper on phone.

Env vars you need:

```env
DATABASE_URL=postgresql://...
GEMINI_API_KEY=...
# optional
GEMINI_MODEL=gemini-2.5-flash-lite
```

---

## AI usage (exam requirement)

I used **Cursor / AI** while building this — mostly for scaffolding shadcn components, refactoring the all-movies page into smaller files, and tightening up race-condition fixes in search and the random picker. I reviewed and adjusted everything; the architecture choices above are mine.

---

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/all-movies`.

```bash
npm run build   # production build + typecheck
npx tsc --noEmit
```
