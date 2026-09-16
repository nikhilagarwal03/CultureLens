<div align="center">

<img src="https://culturelensai.vercel.app/logo_2.png" alt="CultureLens" width="88" />

# CultureLens

**An AI-powered cultural interpretation engine for the global internet.**

CultureLens explains memes, slang, and traditions from any culture using analogies drawn from the user's own — turning "I don't get it" into an instant, relatable explanation.

[**Live Demo**](https://culturelensai.vercel.app) · [**Demo Video**](https://youtu.be/2RJXygec9Sc) · [**Write-up on Medium**](https://medium.com/@agarwalnikhil909/the-internet-is-global-but-culture-isnt-building-culturelens-016daef78f68) · [**Report an Issue**](https://github.com/nikhilagarwal03/CultureLens/issues)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Upstash-Redis-DC382D?logo=redis&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-Jest%20%2B%20Playwright-C21325?logo=jest&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)

</div>

---

## Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Screenshots](#screenshots)
- [Features](#features)
- [Engineering Highlights](#engineering-highlights)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Testing & Quality](#testing--quality)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## Overview

Translation tools convert words. They don't convert **meaning**. A user unfamiliar with American football has no context for why the Super Bowl is culturally significant, even if every word in the sentence is translated correctly.

CultureLens closes that gap. Given any cultural reference — a meme, a piece of slang, a tradition, a trending topic — it identifies the reference, explains where it comes from, and reframes it through an analogy from the user's own culture.

> **Input:** *What is the Super Bowl?*
>
> **Output for an Indian user:** The Super Bowl is comparable to the IPL Final combined with the scale of a national festival — it's the championship game of American football and one of the biggest sporting and entertainment events in the United States.

## How It Works

Every query runs through a five-stage pipeline rather than returning a single block of AI-generated text:

```
User Input
   │
   ▼
Reference Detection & Cultural Context Analysis
   │
   ▼
Prompt Construction (culture-aware)
   │
   ▼
LLM Generation — OpenRouter
   │
   ▼
Localization — Lingo.dev
   │
   ▼
Structured, Cached Response
```

The final response is broken into five layers so users get a structured explanation, not a wall of text: **Reference**, **Origin Culture**, **Cultural Impact**, **Local Analogy**, and **Context**.

## Screenshots

<p align="center">
  <img src="https://culturelensai.vercel.app/Screenshot%202.png" alt="CultureLens — main result view" width="640" style="border-radius: 10px; box-shadow: 0 2px 14px #0002; margin-bottom: 14px;" />
</p>
<p align="center">
  <img src="https://culturelensai.vercel.app/Screenshot%2001.png" alt="CultureLens — onboarding" width="300" style="border-radius: 10px; box-shadow: 0 2px 14px #0002; margin-right: 8px;" />
  <img src="https://culturelensai.vercel.app/Screenshot%203.png" alt="CultureLens — shareable card" width="300" style="border-radius: 10px; box-shadow: 0 2px 14px #0002; margin-left: 8px;" />
</p>

## Features

| Feature | Description |
|---|---|
| **Cultural Analogy Engine** | Converts a cultural reference into a structured, relatable explanation grounded in the user's own culture |
| **Interactive Globe Onboarding** | Culture/country selection through a D3-geo + TopoJSON world map |
| **Trending References** | Surfaces recently searched cultural references |
| **Shareable Cultural Cards** | Every result can be turned into a permalinked, social-ready card at `/cards/[slug]` |
| **Multi-Language Output** | Explanations localized in real time via Lingo.dev |
| **Guest Mode** | No account required — name + country is enough to personalize results |
| **Usage Metrics** | Lightweight visitor-count and metrics endpoints for product analytics |

## Engineering Highlights

Notes for anyone reviewing this as a technical artifact rather than a product:

- **Caching strategy** — Upstash Redis sits in front of the LLM call to cut cost and latency on repeated or similar queries, rather than hitting OpenRouter on every request.
- **Structured, validated API layer** — every route handler goes through a shared validation/error/response layer (`lib/server/api`) instead of ad hoc `try/catch` blocks per route.
- **Separation of client and server concerns** — despite being a single Next.js app, browser-side logic (`lib/client`) and server-only logic (`lib/server`) are cleanly separated, keeping API keys and DB access out of the client bundle.
- **Automated testing at two levels** — unit tests (Jest + Testing Library) for logic and components, and Playwright E2E specs covering the real user flow (dashboard search, mobile responsiveness).
- **Performance budget enforced in CI** — Lighthouse CI runs against the built app, and `autocannon` is used for load testing the API routes.
- **Config-aware startup** — the app detects missing environment configuration at boot (`getPhase1ConfigStatus`) rather than failing silently at request time.

## Tech Stack

CultureLens is a single full-stack **Next.js 16** application (App Router) — there is no separate backend service; API routes and server logic live in the same codebase as the UI.

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling / Motion | Tailwind CSS 4, Framer Motion |
| Map Visualization | D3-geo, TopoJSON, world-atlas |
| AI / LLM | OpenRouter |
| Localization | Lingo.dev SDK |
| Database | MongoDB (Mongoose) |
| Caching | Upstash Redis |
| Testing | Jest, Testing Library, Playwright |
| Performance | Lighthouse CI, autocannon |
| CI/CD | GitHub Actions, Vercel |


## Project Structure

```
CultureLens
└── client                     # Next.js app — frontend and backend in one codebase
    ├── app
    │   ├── api                # route handlers: explain, cards, trending,
    │   │                      #   languages, metrics, health, visitor-count
    │   ├── app                # main query/result experience
    │   ├── cards/[slug]        # shareable cultural card pages
    │   ├── onboarding          # guest onboarding (name, country, globe picker)
    │   └── profile, developer  # secondary pages
    ├── components              # landing, navbar, providers, ui
    ├── lib
    │   ├── client               # browser-side API calls, storage, search helpers
    │   └── server
    │       ├── ai                # LLM prompts, reference/trend detection, caching
    │       ├── api                # request validation, error handling, responses
    │       ├── db                 # Mongoose models + services
    │       └── localization        # Lingo.dev integration
    ├── e2e                     # Playwright specs
    └── scripts                 # db-init, lingo-check, load-test
```

## Getting Started

```bash
git clone https://github.com/nikhilagarwal03/CultureLens.git
cd CultureLens/client
npm install
```

Create `.env.local` in `client/`:

```env
# Database
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=culturelens

# AI
OPENROUTER_API_KEY=your_openrouter_api_key

# Localization (Lingo.dev)
LINGO_API_KEY=your_lingo_api_key
LINGO_ENGINE_ID=your_lingo_engine_id

# Caching (Upstash Redis)
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token

# App config
NEXT_PUBLIC_APP_NAME=CultureLens
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_USER_LANGUAGE=en
```

> Ensure your MongoDB Atlas cluster is reachable and your IP is whitelisted (or use `0.0.0.0/0` for local development).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing & Quality

```bash
npm run test            # unit tests (Jest)
npm run test:coverage   # unit tests with coverage
npm run test:e2e        # end-to-end tests (Playwright)
npm run lint             # ESLint
npm run perf:frontend    # Lighthouse CI performance audit
npm run perf:load        # API load testing (autocannon)
npm run db:init          # initialize local MongoDB collections/indexes
npm run lingo:check      # validate Lingo.dev configuration
```

## Deployment

Deploys to **Vercel**:

1. Push the repository to GitHub
2. Import it into Vercel
3. Add the environment variables listed above
4. Deploy

## Roadmap

- Browser extension for instant meme explanations
- Mobile application
- Cultural knowledge graph
- Personalized cultural discovery feed
- AI-powered trend analytics dashboard

---

<div align="center">

Built by **[Nikhil Agarwal](https://github.com/nikhilagarwal03)** · [Read the full write-up →](https://medium.com/@agarwalnikhil909/the-internet-is-global-but-culture-isnt-building-culturelens-016daef78f68)

</div>
