# Landing Page Improvements — Change Log

Tracking every change made to the miduva.com landing page. Newest phase on top.

---

## Phase 2 — Privacy, terms & cookie consent (2026-09-29)

### Why

Phase 1 added GA4 and the Meta Pixel. Those set cookies, which need consent under GDPR/UK GDPR, and the contact form collects personal data. The site had no privacy policy, no terms and no consent mechanism.

### What changed

| File | Change |
|---|---|
| `miduva-app/lib/consent.ts` (new) | Stores the visitor's choice in a `miduva_consent` cookie (`granted`/`denied`, 180 days, `SameSite=Lax`, `Secure` on HTTPS). Also has helpers to reopen the banner and to delete GA/Meta cookies (`_ga*`, `_gid`, `_gat`, `_fbp`, `_fbc`). |
| `miduva-app/components/consent-manager.tsx` (new) | The cookie banner. **GA4 and the Meta Pixel now load only after "Accept."** Declining after accepting turns GA off, deletes tracker cookies and reloads the page. Leftover tracker cookies are also cleared on every load while consent is "denied." The banner only appears when at least one tracking ID is configured. If none is, "Cookies" in the footer shows "No optional cookies in use." |
| `miduva-app/components/analytics.tsx` | Now just reads the env IDs on the server and hands them to the consent manager. Tracking scripts are never in the server HTML. |
| `miduva-app/components/cookie-settings-button.tsx` (new) | Button that reopens the banner. Used in the footer and on the privacy page. |
| `miduva-app/components/legal-page.tsx` (new) + `.legal-prose` styles in `app/globals.css` | Shared layout for the legal pages: logo header, title, "last updated" line, readable prose with a scrollable table on mobile, and a small footer. Uses the site's theme tokens. |
| `miduva-app/app/(site)/privacy/page.tsx` (new) | `/privacy`: what data is collected and why, legal basis, processors (hosting, Resend, CRM, Google/Meta only with consent), cookies (`#cookies` anchor, with a "Cookie settings" button), retention, rights (GDPR/PDPL), security and changes. |
| `miduva-app/app/(site)/terms/page.tsx` (new) | `/terms`: acceptable use, IP (client logos belong to their owners), **results and figures are illustrative, not guarantees**, no professional advice, third-party links, disclaimer/liability, contact. |
| `miduva-app/components/ui/motion-footer.tsx` | Added a "Legal" row under the copyright: Privacy · Terms · Cookies. |
| `miduva-app/components/contact-section.tsx` | Added "By sending this form you agree to our Privacy Policy" (linked) under the submit button. |
| `miduva-app/app/sitemap.ts` | Added `/privacy` and `/terms`. |

### Verified

- `tsc`, ESLint and `npm run build` all pass.
- Headless Chromium test against a local production build with test GA/Meta IDs:
  - First visit: the banner shows and there are **0 requests** to Google/Meta.
  - Accept: the banner closes, the trackers load (3 requests) and the cookie is `granted`.
  - After a reload the banner stays hidden.
  - Footer "Cookies" reopens the banner.
  - Decline: the cookie becomes `denied` and **no `_ga`/`_fbp` cookies remain**.
  - `/privacy` and `/terms` return 200 with correct canonicals, both are in the sitemap, and `/privacy` has no horizontal scroll at 390px wide.

### ⚠️ Needs your review before relying on it

The policy and terms are a **solid starting draft, not legal advice**. Have them checked, and fill in or confirm:

- **Legal entity name and registered address.** Not stated anywhere yet. GDPR expects the data controller to be identified.
- **Governing law / jurisdiction.** The terms leave this out on purpose. Add it once you know where Miduva is registered.
- **Retention periods.** I stated 24 months for enquiries, 90 days for server logs and up to 14 months for GA. Set GA4's retention to match (Admin → Data retention; the default is 2 months), and check that the nginx log rotation keeps no more than 90 days.
- **The CRM and hosting provider.** They're described generically ("our CRM", "our hosting provider"). Name them if your lawyer prefers.
- **The newsletter row.** It refers to the coming-soon page's subscribe form. Remove it if that form is retired.
- Legal link labels are fixed in code. They aren't editable in the Puck editor.

---

## Phase 1 — Technical SEO & analytics (2026-09-29)

### Why

An audit of live miduva.com found:

- No Open Graph or Twitter image, so shared links showed no preview card.
- `/robots.txt` and `/sitemap.xml` both returned 404.
- No structured data (JSON-LD).
- No canonical URL, even though `/` and `/main-site` serve the same page.
- No analytics or ad pixel, so the page's own conversions couldn't be measured.

### What changed

| File | Change |
|---|---|
| `miduva-app/lib/seo.tsx` (new) | Shared SEO helpers. `SITE_URL` comes from the `SITE_URL` env var and defaults to `https://miduva.com`. `buildLandingMetadata()` builds title, description, canonical `/`, Open Graph and Twitter card from the page's Puck SEO fields. `buildLandingJsonLd()` builds `Organization` + `WebSite` + `FAQPage` schema, and the FAQ entries are read from the published FAQ section, so edits in the Puck editor show up automatically. `<JsonLd>` renders it safely (`<` is escaped). |
| `miduva-app/app/(site)/layout.tsx` | Added `metadataBase` (needed for absolute OG/canonical URLs) and `applicationName`, and added the `<Analytics />` component. |
| `miduva-app/app/(site)/page.tsx` | Uses `buildLandingMetadata()` and renders the JSON-LD script. |
| `miduva-app/app/(site)/main-site/page.tsx` | Uses the same metadata. Its canonical points to `/`, so it isn't indexed as a duplicate. |
| `miduva-app/app/(site)/opengraph-image.tsx` (new) | Generated 1200×630 social card: navy gradient, white Miduva logo, headline with the second line in teal. Next.js adds `og:image` and `twitter:image` automatically. |
| `miduva-app/app/robots.ts` (new) | Serves `/robots.txt`: allows `/`, blocks `/admin` and `/api/`, links to the sitemap. |
| `miduva-app/app/sitemap.ts` (new) | Serves `/sitemap.xml` with the home page. `lastModified` is the page's last Puck publish date. |
| `miduva-app/components/analytics.tsx` (new) | Loads GA4 and/or the Meta Pixel **only if** the matching env var is set. IDs are read at request time, so they can be set without rebuilding the image, and are validated as alphanumeric before being put into the page. |
| `miduva-app/lib/analytics.ts` (new) | `trackLead(source)` sends GA4 `generate_lead` and Meta `Lead` events. It does nothing if no tracker is loaded. |
| `miduva-app/components/contact-section.tsx` | Calls `trackLead("contact-section")` after a successful form submission. |
| `docker-compose.yml` | Added `SITE_URL`, `GA_MEASUREMENT_ID` and `META_PIXEL_ID` env vars to the `nextjs` service. All are optional. |

Housekeeping: removed the empty, untracked `miduva-app/app/(site)/preview/` directory. It had no files in it.

### Verified

- `tsc --noEmit` passes, ESLint is clean on the new files, and `npm run build` succeeds.
- Tested with a local `next start` using test IDs:
  - `/robots.txt` and `/sitemap.xml` return the expected content.
  - `/` has canonical, full `og:*` and `twitter:*` tags, and an `og:image` that returns a 1200×630 PNG.
  - The JSON-LD parses and contains `Organization`, `WebSite` and `FAQPage` with all 8 FAQs.
  - `/main-site` has its canonical pointing at `https://miduva.com`.
  - The GA4 and Meta Pixel snippets appear only when their env vars are set.

### To go live

1. Add the tracking IDs to the `.env` next to `docker-compose.yml` (skip either one to leave it off):
   ```
   GA_MEASUREMENT_ID=G-XXXXXXXXXX
   META_PIXEL_ID=000000000000000
   ```
2. Rebuild and restart the app:
   ```bash
   docker compose up -d --build nextjs
   ```
3. Check the result:
   - https://miduva.com/robots.txt and https://miduva.com/sitemap.xml load.
   - Test https://miduva.com in [Google's Rich Results Test](https://search.google.com/test/rich-results) (FAQ + Organization) and the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) (preview card).
   - Submit the sitemap in Google Search Console.
   - In GA4 → Admin → Events, mark `generate_lead` as a key event. In Meta Events Manager, confirm `Lead` fires on a test submission.

### Notes / follow-ups

- ~~Cookie consent is not added yet.~~ Done in Phase 2: trackers now load only after consent.
- The OG image text is fixed in code. If the hero headline changes a lot in Puck, update `opengraph-image.tsx` to match.

---

## Backlog (from the audit, not started)

- [x] Privacy policy, terms, and a cookie consent banner (Phase 2; legal text still needs your review)
- [ ] Testimonials block (quotes with name, role and photo)
- [ ] Case-study block (before/after metrics for 1–3 named clients)
- [ ] Founder/team section
- [ ] Direct booking (Calendly/Cal.com), plus WhatsApp and phone contact
- [ ] Pricing or "how engagements work" section
- [ ] Social links in the footer
- [ ] Fix contradicting claims: "4.8× ROAS Guaranteed", "94% retention" and "14 days" in the footer vs. the dashboard, FAQ and stats; also the FAQ's stated niche (B2B SaaS/DTC) vs. the client logos
- [ ] Consider merging overlapping sections (Systems / Services / Growth OS; Free Offer / Contact)
- [ ] Arabic / RTL version
