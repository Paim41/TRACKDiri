# TRACKDiri Authentication Setup

Use these values for the deployed production app:

```text
Production URL: https://trackdiri.vercel.app
Google callback URL: https://trackdiri.vercel.app/api/auth/google/callback
```

## 1. Database

Create a PostgreSQL database with any managed provider such as Vercel Postgres, Neon, Supabase, Railway or Render.

Add the connection string to Vercel:

```bash
npx vercel env add DATABASE_URL production
```

Then run the migration against the production database from your machine:

```bash
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
npm run db:deploy
```

For local development, start Docker Desktop and run:

```bash
docker compose up -d postgres
$env:DATABASE_URL="postgresql://trackdiri:trackdiri@localhost:5432/trackdiri?schema=public"
npm run db:deploy
```

## 2. Google OAuth

1. Open Google Cloud Console.
2. Create or select a project.
3. Configure the OAuth consent screen.
4. Create an OAuth Client ID for a Web application.
5. Add this Authorized JavaScript origin:

```text
https://trackdiri.vercel.app
```

6. Add this Authorized redirect URI:

```text
https://trackdiri.vercel.app/api/auth/google/callback
```

7. Add the values to Vercel:

```bash
npx vercel env add AUTH_GOOGLE_ID production
npx vercel env add AUTH_GOOGLE_SECRET production
npx vercel env add NEXT_PUBLIC_APP_URL production
```

Set `NEXT_PUBLIC_APP_URL` to:

```text
https://trackdiri.vercel.app
```

## 3. Email Verification

Normal email/password registration creates a verification token. Configure SMTP so users receive the verification link:

```bash
npx vercel env add SMTP_HOST production
npx vercel env add SMTP_PORT production
npx vercel env add SMTP_USER production
npx vercel env add SMTP_PASSWORD production
npx vercel env add EMAIL_FROM production
```

## 4. Security Secrets

Generate strong random values and add them to Vercel:

```bash
npx vercel env add AUTH_SECRET production
npx vercel env add ARGON2_SECRET production
```

## 5. Push Notifications

Generate VAPID keys and add:

```bash
npx vercel env add VAPID_PUBLIC_KEY production
npx vercel env add VAPID_PRIVATE_KEY production
npx vercel env add VAPID_SUBJECT production
```

Use an email subject such as:

```text
mailto:admin@yourdomain.com
```

## 6. Redeploy

After adding or changing environment variables:

```bash
npx vercel --prod --yes
```
