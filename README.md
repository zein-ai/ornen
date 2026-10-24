# Ornen

Ornen’s marketing website and lead-generation stack: conversion-focused pages, a DeepSeek-powered website assistant, and an on-site enquiry form. Built with React, TypeScript, Vite, Tailwind CSS, and Vercel Web Standard serverless functions.

## What is included

- Responsive home, pricing, and branded not-found pages.
- Route-specific titles, descriptions, canonical URLs, Open Graph, Twitter, and robots metadata.
- A floating assistant grounded only in Ornen’s approved services, prices, timelines, and contact details.
- Deterministic name/email capture. The AI never writes leads or claims to book calls.
- A full contact form with service and budget qualification.
- Consented chat transcripts attached to chatbot enquiries.
- Upstash Redis lead storage and distributed IP rate limits.
- Resend email notifications with the visitor set as `replyTo`.
- Validation, honeypots, request limits, upstream timeouts, and safe client-facing errors.
- Mobile CSS hero fallback, deferred desktop WebGL, reduced-motion support, and offscreen render pausing.

Booking is intentionally **not** included. Interested visitors submit a project enquiry for human follow-up.

## Local development

```bash
npm install
npm run dev
```

The Vite development server runs on `http://localhost:3000`. This serves the frontend only.

To exercise the Vercel functions locally, use the Vercel CLI and provide the environment variables below:

```bash
npx vercel dev
```

## Environment variables

Copy `.env.example` into your local Vercel environment or configure these variables in the Vercel project. They are **server-side only**; none use a `VITE_` prefix or ship to the browser.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | For chat | DeepSeek API credential. |
| `DEEPSEEK_MODEL` | No | Defaults to `deepseek-flash`. |
| `UPSTASH_REDIS_REST_URL` | For leads and rate limits | Upstash Redis REST endpoint. |
| `UPSTASH_REDIS_REST_TOKEN` | For leads and rate limits | Upstash Redis REST token. |
| `RESEND_API_KEY` | For email alerts | Resend API credential. |
| `RESEND_FROM_EMAIL` | For email alerts | Verified sender, for example `Ornen Leads <leads@ornen.co>`. |
| `LEAD_NOTIFICATION_EMAIL` | For email alerts | Inbox that receives new enquiries. |

The assistant returns a graceful configuration message if DeepSeek is missing. The contact form directs visitors to `hello@ornen.co` if Redis is not configured. If email delivery fails after a lead is stored, the lead remains in Redis; the API does not report it as lost.

## Lead storage

Each successful enquiry creates:

- `ornen:lead:<uuid>` — the lead JSON, including timestamp and consented transcript when present.
- `ornen:leads:recent` — a list capped to the latest 500 lead IDs.

There is deliberately no public lead-listing endpoint. Read leads through the Upstash console or an authenticated internal process. Add retention/deletion procedures appropriate to your privacy obligations.

## Quality checks

```bash
npm run lint
npm test
npm run build
npm audit
```

The Three.js hero is lazy-loaded and appears as a separate production chunk. Its bundle-size warning does not block the initial mobile experience; do not move it back into the entry bundle.

## Deployment

Deploy the repository to Vercel. `vercel.json` serves the SPA only for `/` and `/pricing`, leaving `/api/*` to the serverless functions and unknown paths to a real platform 404.

Before enabling the live lead flow:

1. Add all required environment variables to Production (and Preview if desired).
2. Verify the Resend sender domain/address.
3. Submit a real test enquiry and confirm both Redis storage and email delivery.
4. Ask the assistant pricing and out-of-scope questions; confirm it stays within the approved facts.
5. Check keyboard, mobile safe-area, reduced-motion, and form error/success behavior.

## Privacy and operations

The privacy policy describes DeepSeek processing, consented transcript submission, Upstash storage, and Resend notifications. Keep it aligned with the actual providers and retention practices. Never commit `.env`, credentials, lead data, or notification inbox contents.
