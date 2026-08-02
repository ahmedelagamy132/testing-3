# Payload removal comparison

Completed and verified on 2026-07-29 (UTC).

The immutable pre-removal inventory, recovery revision, routes, landing-page
structure, dashboard content, and file checksums are in
`PAYLOAD_REMOVAL_BASELINE.md`.

## Before and after

| Area | Before removal | After removal | Result |
| --- | --- | --- | --- |
| `/` | Loaded `AppWrapper` through a CMS lookup; with no connected local database it used the components' built-in content | Loads the same `AppWrapper` and built-in content directly | Preserved |
| `/main-site` | Same CMS lookup and fallback path as `/` | Same direct `AppWrapper` path as `/` | Preserved |
| Landing sections | Navigation plus the 15 ordered content sections recorded in the baseline | Same `AppWrapper`, section renderer, section order, components, styles, images, and animations | Preserved |
| Visual Dashboard | `components/dashboard.tsx` with the responsive user edits recorded in the baseline | Same file and same edits; checksum `75360733154ba25bb63f3c4597a543303eb104674b54a9b053f23ed30a5d2d10` | Preserved |
| Contact form | Validated in the route and stored through the CMS | Same validation and response contract; stored in CMS-free SQLite | Preserved |
| Subscribe form | Validated in the route, deduplicated, and stored through the CMS | Same validation, deduplication, and response contract; stored in CMS-free SQLite | Preserved |
| Admin CMS | `/admin` and CMS REST routes | Removed; `/admin` returns 404 | Removed |
| Live preview | `/preview` and live-preview component | Removed; `/preview` returns 404 | Removed |
| Dependencies | Five CMS packages and their transitive packages | No CMS package remains; 256 installed packages removed | Removed |
| Deployment | CMS build variables, schema, source copies, upload directory, and database | Plain Next.js build plus `/data/miduva.db` for form submissions | Replaced |

## Runtime verification

Production build routes:

```text
○ /
ƒ /api/contact
ƒ /api/subscribe
○ /main-site
```

HTTP checks:

```text
/             rendered successfully
/main-site    200
/admin        404
/preview      404
```

Landing-page content markers found in the server-rendered HTML:

```text
We build custom growth systems.
Three systems.
One growth machine.
Q2 Performance Overview
Qualified Leads
Get a Free
Start the conversation
```

Form API checks:

```json
{"status":"subscribed"}
{"status":"already"}
{"status":"submitted"}
{"subscribers":1,"contacts":1}
```

The first two responses prove subscription deduplication. The third response and
database counts prove that contact and subscriber storage still work without the
CMS.

## Build and source verification

- `npm run build`: passed, including TypeScript and static generation.
- `npm run lint`: passed with 0 errors. Existing warnings remain.
- `git diff --check`: passed.
- Direct dependency audit: no CMS package installed.
- Source audit: no CMS imports, configuration, scripts, routes, generated types,
  Docker instructions, lockfile entries, or source files remain.
- The only remaining CMS name in project-authored files is in the two Markdown
  records intentionally retained for this before/after comparison.

## Form database

Form submissions now use `@libsql/client`.

- Local default: `file:./miduva.db`
- Docker default: `file:/data/miduva.db`
- Override: `MIDUVA_DATABASE_URI`
- Backward-compatible override: `DATABASE_URI`

The table and column names match the former subscriber and contact-submission
tables, allowing an existing compatible SQLite database to continue storing
those records without the CMS runtime.
