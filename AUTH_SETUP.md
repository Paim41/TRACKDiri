# TRACKDiri Authentication Setup

Use these values for the deployed production app:

```text
Production URL: https://trackdiri.vercel.app
Google callback URL: https://trackdiri.vercel.app/api/auth/google/callback
```

## 1. Supabase Database

1. Open Supabase and choose your TRACKDiri project.
2. Go to `Project Settings` -> `Database`.
3. Find `Connection string`, choose `URI`, then copy the PostgreSQL URL.
4. Use your database password in place of `[YOUR-PASSWORD]`.

Your Supabase URL should look like this:

```text
postgresql://postgres:[YOUR-PASSWORD]@db.oxkkijunlearouiwxuxu.supabase.co:5432/postgres?sslmode=require
```

Add that connection string to Vercel:

```bash
npx vercel env add DATABASE_URL production
```

When Vercel asks for the value, paste the full Supabase URL. Then run the migration against Supabase from your machine:

```bash
$env:DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.oxkkijunlearouiwxuxu.supabase.co:5432/postgres?sslmode=require"
npm run db:deploy
```

For local development, start Docker Desktop and run:

```bash
docker compose up -d postgres
$env:DATABASE_URL="postgresql://trackdiri:trackdiri@localhost:5432/trackdiri?schema=public"
npm run db:deploy
```

## 2. Google OAuth Login

1. Open Google Cloud Console.
2. Create or select a project.
3. Configure the OAuth consent screen.
4. Go to `APIs & Services` -> `Credentials`.
5. Create an OAuth Client ID for a `Web application`.
6. Add this Authorized JavaScript origin:

```text
https://trackdiri.vercel.app
```

7. Add this Authorized redirect URI:

```text
https://trackdiri.vercel.app/api/auth/google/callback
```

8. Copy the Google Client ID and Client Secret into Vercel:

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
