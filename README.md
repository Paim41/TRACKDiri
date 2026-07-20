<div align="center">

<img width="90" height="90" alt="1783888480355" src="https://github.com/user-attachments/assets/496013bd-70ff-4c9d-8703-31e9403a2b9d" />

# TRACKDiri
**A full-stack daily health and hydration tracker — installable, secure, and reminder-driven.**

Log water, track wellness habits, and get gentle nudges to stay on top of your day. Sessions are hardened server-side; Postgres remembers every record, reminder, and event.

[![Live Demo](https://img.shields.io/badge/OPEN%20APP-Live%20Demo-4C9AFF?style=for-the-badge&logo=vercel&logoColor=0C1117)](https://trackdiri.vercel.app)
[![PWA Ready](https://img.shields.io/badge/Installable-PWA-0C1117?style=for-the-badge)](https://trackdiri.vercel.app)
[![Argon2id](https://img.shields.io/badge/Argon2id-Password%20Hashing-163F14?style=for-the-badge)](https://trackdiri.vercel.app)
[![Type](https://img.shields.io/badge/Type-Health%20Tracker-070D0C?style=for-the-badge)](https://trackdiri.vercel.app)

</div>

---

## About

TRACKDiri is a **full-stack daily health and hydration web application** built with Next.js App Router, TypeScript, Prisma, PostgreSQL, secure HTTP-only sessions, Google OAuth entry points, PWA support, and server-side health APIs.

Public, authentication, and protected routes all live under one App Router structure. Prisma and PostgreSQL hold users, sessions, health records, reminders, push subscriptions, security events, and audit logs. It's a wellness companion, not a diagnostic or emergency tool.

> *"Track your day. Nudge, don't diagnose."*

---

## Architecture

```
Public / Auth / Protected Routes  →  Next.js App Router
    ↓
Session Layer          →  Argon2id hashing, hashed tokens, secure HTTP-only cookies
    ↓
Google OAuth            →  Authorization + callback via official Google endpoints
    ↓
Server-Owned APIs        →  Consistent ApiResponse<T> shape, Zod-validated input
    ↓
Data Layer                →  Prisma + PostgreSQL (records, reminders, subscriptions, audit logs)
    ↓
PWA Shell                  →  Manifest, service worker, offline page, generated icons
    ↓
Real-Time / Reminders        →  Replaceable provider abstraction, polling-compatible refresh
```

---

## Features

- **Hydration & Health Tracking** — server-side APIs for daily records with a consistent response shape
- **Secure Custom Auth** — Argon2id password hashing, hashed reset/verification tokens, HTTP-only session cookies
- **Google OAuth** — sign-in via official Google authorization and callback endpoints
- **Installable PWA** — manifest, service worker, offline page, and generated icon set from the official logo
- **Push Reminders** — VAPID-based web push, with notification actions that open the water-logging screen for manual confirmation
- **Validated APIs** — Zod input validation, server-side ownership checks, and security-event logging
- **Test Coverage** — unit tests via Vitest and end-to-end coverage via Playwright

---

## Built For

```
Purpose  → Personal daily health and hydration tracking
Backend  → PostgreSQL + Prisma, custom session auth, Google OAuth
Theme    → Installable PWA, wellness-first UI
Not For  → Medical diagnosis, treatment, or emergency use
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router), TypeScript |
| Database | PostgreSQL, Prisma |
| Auth | Argon2id, custom sessions, Google OAuth |
| Notifications | Web Push (VAPID) |
| Styling | Tailwind CSS |
| Testing | Vitest, Playwright |
| Deployment | Docker, Vercel |

---

## Project Structure

```
TRACKDiri/
├── app/
├── components/
├── lib/
├── prisma/
├── public/
├── scripts/
├── tests/
├── AUTH_SETUP.md
├── docker-compose.yml
└── vercel.json
```

---

## Setup Guide

1. Copy `.env.example` to `.env` and configure every required environment variable (see below)
2. Add the official assets to `public/assets/`: `trackdiri-background.png`, `trackdiri-logo.png`, `trackdiri-navigation.png`
3. Run `npm run assets:icons` to generate favicon, Apple, and PWA icon sizes
4. Run `npm run db:generate` and `npm run db:migrate`
5. Start the dev server with `npm run dev`
6. Create the first administrator (see Local Setup below)
7. Create a Google OAuth client and set the redirect URI to `/api/auth/google/callback`
8. Generate VAPID keys for push notifications and set them in `.env`
9. Install the PWA on a test device (iOS requires install-before-notifications)
10. Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run test:e2e`
11. Review `AUTH_SETUP.md` for the full production checklist before deploying

---

## Environment Variables

```
DATABASE_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
ARGON2_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=

NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=

VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=

REALTIME_PROVIDER=
REDIS_URL=
CRON_SECRET=
```

Never commit real secrets.

---

## Local Setup

```
npm install
npm run assets:icons
npm run db:generate
npm run db:migrate
npm run dev
```

Runs at `http://localhost:3000`.

Create the first administrator:

```
SETUP_ADMIN_EMAIL=admin@example.com SETUP_ADMIN_PASSWORD='StrongPass1!' npm run setup:admin
```

---

## Google OAuth

1. Create a Google OAuth client
2. Add the redirect URI: `https://your-domain.example/api/auth/google/callback`
3. Set `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, and `NEXT_PUBLIC_APP_URL`

See `AUTH_SETUP.md` for the full production database, OAuth, SMTP, and Vercel setup checklist.

---

## Mobile Notifications

Generate VAPID keys and set `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT`. Users should install the PWA on iOS before enabling notifications. Notification actions open `/app/water?action=record`; TRACKDiri still requires manual confirmation before recording a glass.

---

## Commands

```
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## Docker

```
docker compose up --build
```

## Deployment

On Vercel:

1. Connect the GitHub repository
2. Add every required environment variable
3. Attach a production PostgreSQL database
4. Run `npm run db:deploy` during release, or through a protected migration job
5. Deploy with `npm run build`

---

## Security Notes

- Passwords are hashed with Argon2id
- Sessions live in HTTP-only cookies; reset and verification tokens are hashed before storage
- API input is validated with Zod
- Server-side ownership checks gate every protected resource
- Security events are logged for audit
- TRACKDiri is a wellness tracker, not an emergency, diagnostic, or treatment service

---

## Roadmap / Ideas

- [ ] Weekly and monthly hydration/wellness trend views
- [ ] Configurable reminder schedules per user
- [ ] Additional OAuth providers beyond Google
- [ ] Shareable progress summaries
- [ ] Native real-time provider (beyond polling-compatible refresh)

---

<div align="center">

*TRACKDiri — track your day, nudge don't diagnose.*

[trackdiri.vercel.app](https://trackdiri.vercel.app)


