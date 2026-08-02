This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Puck landing-page editor

The protected editor is available at `/admin`. It uses the Puck UI to edit drafts,
reorder singleton landing-page sections around the fixed dashboard, upload media,
review the latest 20 published revisions, and publish both `/` and `/main-site`.

Configure these server-only values before opening the editor:

```bash
PUCK_ADMIN_PASSWORD=choose-at-least-16-characters
PUCK_SESSION_SECRET=use-at-least-32-random-characters
```

Production refuses editor logins when either value is absent. Docker Compose passes
both values through and stores uploaded Puck media in the persistent `/data` volume.

## Contact form delivery

Contact submissions are always saved to the configured SQLite database. They can
also be delivered immediately by email, to a webhook, or to both.

For email delivery, set these server-side environment variables:

```bash
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=Miduva Website <website@miduva.com>
CONTACT_NOTIFICATION_EMAIL=hello@miduva.com
```

`CONTACT_FROM_EMAIL` must use a sender domain verified in Resend. Multiple
notification addresses can be supplied as a comma-separated list.

To deliver the same submission to a CRM or automation platform, set:

```bash
CONTACT_WEBHOOK_URL=https://example.com/contact-webhook
CONTACT_WEBHOOK_SECRET=optional-bearer-token
```

The webhook receives `{ "event": "contact.submitted", "data": { ... } }`. A
notification failure never discards the lead because the database write happens
first.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
