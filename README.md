# TRACKDiri

TRACKDiri is a full-stack daily health and hydration web application built with Next.js App Router, TypeScript, Prisma, PostgreSQL, secure HTTP-only sessions, Google OAuth entry points, PWA support and server-side health APIs.

## Architecture

- Next.js App Router for public, authentication and protected application routes.
- Prisma with PostgreSQL for users, sessions, health records, reminders, push subscriptions, security events and audit logs.
- Custom session auth using Argon2id password hashing, hashed tokens and secure cookies.
- Google OAuth authorization and callback routes using official Google endpoints.
- Server-owned APIs return a consistent `ApiResponse<T>` shape.
- PWA manifest, service worker, offline page and generated icons based on the official TRACKDiri logo.
- Replaceable real-time provider abstraction with polling-compatible data refresh.

## Supplied Assets

The official assets are expected at:

- `public/assets/trackdiri-background.png`
- `public/assets/trackdiri-logo.png`
- `public/assets/trackdiri-navigation.png`

Run `npm run assets:icons` after copying those files to generate favicon, Apple and PWA icon sizes.

## Environment

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `ARGON2_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `EMAIL_FROM`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`
- `REALTIME_PROVIDER`
- `REDIS_URL`
- `CRON_SECRET`

Do not commit real secrets.

## Local Setup

```bash
npm install
npm run assets:icons
npm run db:generate
npm run db:migrate
npm run dev
```

Create the first administrator with:

```bash
SETUP_ADMIN_EMAIL=admin@example.com SETUP_ADMIN_PASSWORD='StrongPass1!' npm run setup:admin
```

## Google OAuth

Create a Google OAuth client and add this redirect URI:

```text
https://your-domain.example/api/auth/google/callback
```

Set `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` and `NEXT_PUBLIC_APP_URL`.

See `AUTH_SETUP.md` for the complete production database, Google OAuth, SMTP and Vercel environment setup checklist.

## Mobile Notifications

Generate VAPID keys and set `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` and `VAPID_SUBJECT`. Users should install the PWA on iOS before enabling notifications. Notification actions open `/app/water?action=record`; TRACKDiri still requires manual confirmation before recording a glass.

## Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## Deployment

On Vercel:

1. Connect the GitHub repository.
2. Add every required environment variable.
3. Attach a production PostgreSQL database.
4. Run `npm run db:deploy` during release or through a protected migration job.
5. Deploy with `npm run build`.

## Security Notes

TRACKDiri hashes passwords with Argon2id, stores sessions in HTTP-only cookies, hashes reset and verification tokens, validates API input with Zod, applies server-side ownership checks and logs security events. It is a wellness tracker, not an emergency, diagnostic or treatment service.
