# MarketBox

A full-stack, real-time peer-to-peer marketplace web application built with Next.js 16 (App Router), TypeScript, Tailwind CSS, PostgreSQL, Drizzle ORM, Clerk Authentication, UploadThing, Ably WebSockets, and Upstash Redis.

Designed with an image-first, clean browsing experience inspired by Facebook Marketplace and Etsy.

**Live Application:** [https://market-box-three.vercel.app](https://market-box-three.vercel.app)

---

## Features

### 1. Discovery & Search
- Full-text search over titles and descriptions with URL-synchronized query state.
- Category filtering with a responsive horizontal pill strip.
- Min and Max price bounds with instant query updates.
- Sorting by newest first, price low to high, and price high to low.
- Reusable, responsive `ListingCard` with square image framing, status badges, price hierarchy, star rating summaries, and relative timestamps.

### 2. Listings Management
- Create listings with multiple image uploads powered by UploadThing.
- Edit listing details and toggle active or sold inventory status.
- Listing detail view with interactive photo gallery (hero preview + thumbnail strip), seller reputation snippets, and owner-only management controls.
- Deleting listings with cascading cleanup of associated images, conversations, and reviews.

### 3. Real-Time Chat & Messaging
- 1-on-1 buyer-to-seller messaging linked directly to listings.
- Real-time message broadcast via Ably WebSockets without manual polling.
- Messenger container anchored to newest messages, sender/recipient speech bubbles, day dividers, and sticky composer.
- Inbox overview tracking buyer and seller conversation roles.

### 4. Reviews & Seller Reputation
- Verified review system: buyers can leave 1-to-5 star ratings with written feedback.
- Anti-abuse constraints: database-level unique constraint (`reviewer_id` + `listing_id`) prevents duplicate reviews; sellers cannot review their own items.
- Aggregated reputation stats displayed across listing detail pages and public seller profile cards.

### 5. Security & Rate Limiting
- Upstash Redis sliding window rate limiter protects listing mutations, message sends, and review submissions.
- Centralized validation using Zod schemas for all server actions.
- Preserved form state on validation failure with actionable error banners.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Actions, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Database** | PostgreSQL (Neon serverless) |
| **ORM** | Drizzle ORM + Drizzle Kit |
| **Authentication** | Clerk Auth |
| **File Storage** | UploadThing |
| **Real-Time** | Ably WebSockets |
| **Caching / Rate Limiting** | Upstash Redis (`@upstash/ratelimit`) |
| **Schema Validation** | Zod |

---

## Project Structure

```
market-box/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ably/token/route.ts      # Ably token authentication endpoint
│   │   │   └── uploadthing/core.ts      # UploadThing file router
│   │   ├── chats/                       # Messaging inbox & conversation views
│   │   ├── dashboard/                   # Seller inventory dashboard
│   │   ├── listings/                    # Creation, detail, and edit pages
│   │   ├── profile/[id]/                # Public seller profiles & ratings
│   │   ├── globals.css                  # Tailwind tokens and theme setup
│   │   ├── layout.tsx                   # Root layout with sticky top navigation
│   │   └── page.tsx                     # Marketplace discovery and filters
│   ├── components/
│   │   ├── CategoryFilter.tsx           # Category selector pill bar
│   │   ├── ListingCard.tsx              # Reusable product card component
│   │   ├── ListingGallery.tsx           # Product detail image gallery
│   │   ├── PriceFilter.tsx              # Min/max price inputs
│   │   ├── ReviewForm.tsx               # Review submission component
│   │   ├── SearchBar.tsx                # Search input with submit trigger
│   │   ├── SortSelect.tsx               # Sort order dropdown
│   │   └── StarRating.tsx               # Visual star rating renderer
│   ├── db/
│   │   └── schema.ts                    # PostgreSQL table definitions
│   └── lib/
│       ├── ably.ts                      # Ably client initialization
│       ├── auth.ts                      # Clerk user sync helper
│       ├── db.ts                        # Drizzle database client
│       ├── ratelimit.ts                 # Upstash Redis sliding window limiters
│       ├── reviews.ts                   # Review queries and aggregation logic
│       └── validations/                 # Zod validation schemas
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+ installed
- A Neon PostgreSQL database instance
- A Clerk account for authentication
- An UploadThing account for image hosting
- An Ably account for real-time messaging
- An Upstash Redis database for rate limiting

### 1. Clone the repository

```bash
git clone https://github.com/Jul10r/Market-box.git
cd market-box
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# UploadThing
UPLOADTHING_TOKEN=...

# Ably Realtime
ABLY_API_KEY=...

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

### 4. Database Setup

Push the Drizzle schema to your PostgreSQL database:

```bash
npm run db:push
```

You can inspect and manage your data locally with Drizzle Studio:

```bash
npm run db:studio
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Scripts

- `npm run dev` - Starts the Next.js development server with Turbopack
- `npm run build` - Generates an optimized production build
- `npm run start` - Runs the production build locally
- `npm run lint` - Runs ESLint code style and syntax checks
- `npm run db:push` - Applies database schema changes using Drizzle Kit
- `npm run db:studio` - Launches Drizzle Studio in your browser
