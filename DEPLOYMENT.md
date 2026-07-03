# Deployment Guide

## Prerequisites

- Node.js 18+
- Neon PostgreSQL Database
- Clerk Account
- OpenRouter API Key
- Stripe Account
- Vercel Account

## Environment Variables

Create `.env.local`:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Neon PostgreSQL
DATABASE_URL=postgresql://...

# OpenRouter AI
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=...

# Resend (Email)
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_PLATFORM_NAME=WebForge
```

## Vercel Deployment

1. Push to GitHub
2. Import project in Vercel
3. Set all environment variables
4. Build command: `npx prisma generate && next build`
5. Deploy!

## Database Setup

```bash
npx prisma db push
npx prisma db seed
```

## Stripe Configuration

1. Create products in Stripe Dashboard:
   - Starter ($19/month)
   - Pro ($49/month)
   - Agency ($99/month)
2. Set webhook endpoint: `https://your-domain.com/api/stripe/webhook`
3. Subscribe to events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`

## Architecture

- **Frontend**: Next.js 15 App Router + Tailwind CSS + ShadCN UI
- **Backend**: Next.js Server Actions + Route Handlers
- **Database**: Neon PostgreSQL via Prisma
- **Auth**: Clerk
- **AI**: OpenRouter (Anthropic, Google, DeepSeek)
- **Payments**: Stripe
- **Storage**: Vercel Blob
- **Deployment**: Vercel Edge/Functions

## Security

- All routes protected by Clerk middleware
- Server actions check authentication
- Stripe webhook signature verification
- Input validation via Zod
- CSP headers in vercel.json
- Database prepared statements via Prisma
- No secrets in client-side code

## Multi-Agent AI Architecture

```
User Input → Branding Agent → Layout Agent → Content Agent → SEO Agent → Builder Agent → Database
```

## License

Private - All rights reserved.
