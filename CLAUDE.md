# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on localhost:3000
npm run build     # Production build
npm run lint      # ESLint
```

No test framework is set up yet.

## Architecture

CalCal is a **Next.js 16 App Router** web app — a calendar-aware nutrition copilot that helps users eat well around their actual schedule. It combines Google Calendar, location-aware restaurant recommendations, and AI-powered fridge scanning.

### Key concepts

- **Meal Windows**: The core unit. The app reads a user's calendar, finds gaps between events, and creates 2–3 meal windows per day with grades (A+/A/B/C).
- **Two Paths per window**: Each meal window offers "Eat Out" (ranked nearby restaurants → menu dishes) or "Eat at Home" (photo/text input → Claude AI recommendation).
- **Grading system**: A+/A = green, B = yellow, C = orange-red. Used on restaurants, dishes, home meals, and daily summaries.

### Page routes

| Route | Purpose |
|---|---|
| `/` | Landing page with mock dashboard preview |
| `/auth/signin` | Google sign-in (simulated for demo) |
| `/onboarding` | 4-step wizard: goal → restrictions → style → permissions |
| `/dashboard` | Command center: stats, meal windows, daily grade |
| `/dashboard/meal/[id]` | Meal window detail with Eat Out / Eat at Home choice |
| `/dashboard/eat-out` | Ranked restaurant list → dish recommendations |
| `/dashboard/eat-at-home` | Photo upload or text input → Claude AI recommendation |
| `/dashboard/history` | Weekly heatmap + day-by-day grade breakdown |
| `/api/ai/home-recommendation` | POST endpoint → calls Claude Haiku → returns grade + meal recommendation |

### Data flow

1. User profile stored in `localStorage` (set during onboarding)
2. Meal windows come from `src/lib/mock-data.ts` (placeholder for real Google Calendar API)
3. Restaurant data comes from `src/lib/mock-data.ts` (placeholder for Google Places API)
4. Home recommendations call `/api/ai/home-recommendation` → Anthropic SDK → Claude Haiku

### Key files

- `src/types/index.ts` — all shared types (`UserProfile`, `MealWindow`, `Restaurant`, `MenuItem`, `HomeRecommendation`, `Grade`)
- `src/lib/mock-data.ts` — mock meal windows, restaurants, and menu items (replace with real API calls)
- `src/app/api/ai/home-recommendation/route.ts` — the one live AI endpoint
- `src/components/ui/GradeBadge.tsx` — grade display component used everywhere
- `src/app/globals.css` — CSS variables for grade colors (`grade-a`, `grade-b`, `grade-c` classes)

### Environment variables

Copy `.env.local` and fill in real keys:

```
ANTHROPIC_API_KEY=         # Required for /api/ai/home-recommendation
GOOGLE_CLIENT_ID=          # For Google OAuth (NextAuth)
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
GOOGLE_MAPS_API_KEY=       # For real restaurant data
```

### What's mocked vs real

| Feature | Status |
|---|---|
| AI home recommendation | **Real** — calls Claude Haiku |
| Google Sign-In | Simulated (skips to onboarding) |
| Calendar integration | Mocked — `mockMealWindows` in `mock-data.ts` |
| Restaurant discovery | Mocked — `mockRestaurants` in `mock-data.ts` |
| User profile | `localStorage` only |
