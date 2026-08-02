# Payload removal baseline

Captured before any Payload removal edits on 2026-07-29 (UTC).

This file is the comparison and recovery record for removing Payload CMS while
keeping the public landing page and its visual dashboard unchanged.

## Exact source state

- Git commit: `cfa312657da791b6a5b0e2232a882665441d6514`
- Branch: `main`
- No Payload-related source file had uncommitted changes at capture time.
- No local `payload.db`, `payload.db-shm`, `payload.db-wal`, `.env`, or
  `DATABASE_URI` was present.
- `PAYLOAD_SECRET` was not set.
- Because no CMS database was connected, the locally rendered landing page used
  the components' built-in content and public assets whenever the Payload lookup
  returned no document.

The full pre-removal content is recoverable byte-for-byte from the Git commit
above. The checksums below prove the exact files used for this baseline.

## Existing user changes preserved separately

These pre-existing working-tree edits are not part of Payload and must not be
overwritten by the removal:

- `app/globals.css`
- `components/dashboard.tsx`
- `components/hero-content.tsx`
- `components/systems-zoom-section.tsx`
- `../assets/ChatGPT Image Jun 21, 2026, 10_39_30 PM.png` (untracked)
- `../assets/ChatGPT Image Jun 21, 2026, 10_40_40 PM.png` (untracked)

## Public page structure before removal

The page routes were:

- `/` → `AppWrapper`
- `/main-site` → `AppWrapper`
- `/preview` → Payload live-preview wrapper
- `/admin` → Payload admin dashboard
- `/api/[...slug]` → Payload REST API
- `/api/contact` → Payload `contact-submissions` collection
- `/api/subscribe` → Payload `subscribers` collection

The public landing-page section order was:

1. Navigation
2. Hero
3. Systems
4. Problem & Solution
5. How It Works
6. Results
7. Our Work
8. Why Miduva
9. Parallax / The Difference
10. Visual Dashboard
11. Services
12. Growth OS
13. FAQ
14. Free Offer
15. Contact
16. Footer

The visual Dashboard section was rendered by `components/dashboard.tsx` and was
not the Payload admin dashboard. Its current built-in content was:

- URL label: `app.miduva.systems / growth-os`
- Status: `LIVE`
- Navigation: `Overview`, `Ads`, `Funnels`, `Automation`, `Data`, `Reports`
- Clients: `AR / Arvo Labs`, `NV / Novae`, `KL / Kilo & Co`
- Eyebrow: `Growth System · Arvo Labs`
- Title: `Q2 Performance Overview`
- KPIs:
  - `Qualified Leads` — `1,284` — `+38%`
  - `Pipeline` — `$482K` — `+21%`
  - `ROAS` — `5.2×` — `+0.8×`
  - `CAC` — `$41` — `-29%`
- Chart: `Lead flow · last 12 weeks`
- Chart subtitle: `Paid + Organic + Automation`
- Funnel: `Visitors 48,210`, `Engaged 12,882`, `Leads 3,104`,
  `SQLs 1,284`, `Closed-won 184`

## Payload package surface before removal

Runtime dependencies:

- `payload@^3.84.1`
- `@payloadcms/db-sqlite@^3.84.1`
- `@payloadcms/live-preview-react@^3.84.1`
- `@payloadcms/next@^3.84.1`
- `@payloadcms/richtext-lexical@^3.84.1`

NPM scripts:

- `payload`
- `payload:generate`
- `payload:migrate`
- `payload:seed`
- `payload:seed-images`
- `payload:seed-content`

Runtime/build configuration:

- `payload.config.ts`
- `payload-types.ts`
- `next.config.ts` wrapped by `withPayload`
- `tsconfig.json` alias `@payload-config`
- Payload-specific Docker build/runtime configuration
- Payload database ignores in `.gitignore` and `.dockerignore`
- Payload schema repair utilities in `scripts/`

## Complete Payload source inventory and SHA-256

```text
f20b0eec7784b5d6a38ad546db6350cbe536d7129214e03339bb4666ef5312dc  payload.config.ts
700919e5c38666130abca96059a9e06185ee5a4b41d0d850b51946e2243cb919  payload-types.ts
fc537b55ff54693a4e956c0c5e3b27b8d249be704dd243300a47adca5ce585f9  next.config.ts
8ef3ad7a4de99586151b5ee336bb66e1922d1a05e2f8318c1940eccc6c585c9f  package.json
ceafa33898a7ad5e66f5e28ff23d01ffb81a9cc5aefa38e39923a7abfb428f36  package-lock.json
6f8baca23f0f395be73d02b1c7034c35561ea6de20a33391d3a68e2de8a719b7  tsconfig.json
bb7023261b7e1f1c6c8210b0653b040a88764ef944b8a089f2b4c4e17795de5a  Dockerfile
51335230d299e62c9bb41e18c38ef4a4399e7d959d961c1f82abec81ceaa700c  app/api/contact/route.ts
1f1c43f72b2db840d0a7c678201a42144702b8ecec72685354ebceae99c5fd8c  app/api/subscribe/route.ts
0f65ae3f53a74ee6e2e4af7555a8d946022c9e047c8ebeec7cbb3355e5bd79ee  components/live-preview-wrapper.tsx
38e14121905893f1ba3867cbe32a9e4d50543b10bb687fd78940217a2031877e  app/(site)/page.tsx
a1640a34d480ad838dc3ba49ebd1b6ab4d9abdfa85f478f15bfad5b0244aac81  app/(site)/main-site/page.tsx
e6102e25499996455cc1b2b2725e4a1cd67bb3f57b8e37189d0cb75097a8ceb0  app/(site)/preview/page.tsx
f70cbc7f27af392ff274e0144531ebe992cc8f34975cb96a052637a069be61d3  app/(payload)/admin/importMap.js
b1d16d1a360da9e0e74875416e140321c21eaccaf0b52b297a492982d9b8220b  app/(payload)/admin/layout.tsx
72f038159fc63f0c20b6a4f4eade007a11b621fff3315a55ca13569f638c1af5  app/(payload)/admin/[[...segments]]/not-found.tsx
288fdfce7520e13d5b96f7d04e79bc6169d363a71904d73e22262f888477505d  app/(payload)/admin/[[...segments]]/page.tsx
8d573d10f9745c524d7cc5e52864bab230dcd13fca28a02dd5aa490087a44789  app/(payload)/admin/server-fn.ts
d55d4ab6a244297863984ae69f157120078feae235d643519caca877d0601bd0  app/(payload)/api/[...slug]/route.ts
2ca4f2dbcdb8c5c3695b9869a7c609caa663f752b5e33b9d57e4a395bce2f567  payload/collections/contact-submissions.ts
aa8b9a4d2bb6dcd93cdb41ed5181c9c3ec143a31c2aa45d0bf879407a3a74346  payload/collections/subscribers.ts
8909861d85b1c2a3bb209d1a7c77ab7ffa702ff5cd93cdf3fea3dd6b96cb7ccd  payload/components/admin-dashboard.scss
62b1f9ae112de9d353897647f1a74357368629ae06f6a0f84f488078da86670a  payload/components/admin-dashboard.tsx
46f033b0364515d5a04d8930f39667fa8926c663dc943ca3b9ce0d71f76a2df0  payload/components/admin-logo.scss
94ee0f87387faa3a2835454c6a4bca954bc49f31852c71047daf3af75d7433f7  payload/components/admin-logo.tsx
33361d00d1565dd180859f950b7b27f838bf6f6792c27181400d1bf88e8892da  payload/components/array-row-label.tsx
62e8a4d637d2b7baf8878f078f69e6a5a26d5178b640bb6d7d73937ab20bec5c  payload/components/large-image-field.scss
4a67369ec5fae600d50d67a4bbfb9e53e4f1bded60d6971345ebdddf308fe66c  payload/components/large-image-field.tsx
49cc75a107096deab9869791e9d9d063500161a028577d6241d23a59cefcaffb  payload/components/open-preview-button.scss
19163ebb59e8b87cc6cbc3d80b068b767c5d32deabf28061c9245bb918eed451  payload/components/open-preview-button.tsx
9d39e4508c3129a046e09edcf680b7ae464c25e107e1f006598dcbd8e90bb09a  payload/components/section-row-label.tsx
171c63e5021a0c95bbeed2a38c16e819ae90251e45c931d2e82caa926a5dc186  payload/components/tab-watcher-provider.tsx
37c0d63d93611e95fa970192802dfe332015839cd5bb528c47486f8813cdd730  payload/globals/landing-page.ts
677f88ea9d47e0aaf61c49b2f0ad261104a6df2a813cf22921cc7d0771568986  payload/seed-content.ts
59eba1dadecf30e639545a2c332a4a9b8a51bddbca790a9372fd94d2164a677b  payload/seed-images.ts
1866ec755cbce5941ba0df53eeea7b9c6d4d028bf52134657d4d8a58c8613ab4  payload/seed.ts
e40864e2cddc7d20da421baf423105230b6fb90d212abf787869de17891d4791  payload/utils/get-landing-page-data.ts
47c4018fdc05f39d945fbda806044feb749ee37892223a77f2237169d72a4795  payload/utils/get-payload.ts
f461b69cd59f2ce03d66bae8a6adb1c065b78aa4002db32e5652bfa6d3d0c4a3  payload/utils/transform-landing-page.ts
```

## Before/after acceptance checks

After removal:

- No source, route, configuration, dependency, lockfile entry, generated type,
  database utility, Docker instruction, comment, or import may reference Payload.
- The public landing page must still render the same 16-part structure above.
- The visual Dashboard component and its existing user-authored responsive edits
  must remain unchanged.
- The current landing-page components, copy fallbacks, styles, animations,
  images, and responsive behavior must remain unchanged.
- `/` and `/main-site` must render the same `AppWrapper`.
- The project must pass lint, TypeScript/build checks, and a repository-wide
  case-insensitive Payload search.
