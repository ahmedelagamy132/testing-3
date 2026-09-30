# Miduva — setup status

_Last updated: 30 September 2026_

This file lists what is set up on miduva.com, what still needs something only
you can provide, and how to restore from a backup.

---

## ✅ Done

### 1. Leads inbox in the admin — `miduva.com/admin/leads`
Every submission from the contact form and the **RFP** / **Let's talk** popups
(on the home page and the blog) is saved to the site database and shown here.

- Sign in with the same password as the site editor (`PUCK_ADMIN_PASSWORD` in `.env`).
  The site editor's top bar has a **Leads** button.
- Each lead shows name, email, phone, company, website, monthly budget, which
  form was used, and **which page it came from** (e.g. a specific blog post).
- Set a **status**: New → Contacted → Qualified → Won / Lost.
- Add **private notes** (call summary, next step…).
- Search, filter by status or form, **Export CSV** (opens in Excel/Sheets), delete.
- Summary cards: total leads, last 7 days, new (not yet contacted), won.

> Leads are stored, but **nobody is emailed** when one arrives (see "Needs you" #1).
> Until that's set up, check `/admin/leads` regularly — rows marked **New** have a teal edge.

### 2. Automatic daily backups
- Runs every day at **03:15 server time (UTC)** from root's crontab.
- Script: `scripts/backup.sh` · Log: `/var/log/miduva-backup.log`
- Saved to `/opt/miduva/backups/<date>/`, kept for **14 days**:

  | File | Contains |
  |---|---|
  | `miduva.db.gz` | Site content, revisions, **leads** |
  | `mysql.sql.gz` | WordPress blog + Perfex CRM databases |
  | `wp-uploads.tar.gz` | Blog images |
  | `site-media.tar.gz` | Images uploaded in the site editor |
  | `env` | Passwords and keys (root-only) |

- The old Payload volumes from the earlier site were archived once to
  `backups/legacy/`.
- A test run completed and both database copies were checked as valid.

> Backups are on the **same server**. If the server itself is lost, so are they
> (see "Needs you" #2).

### 3. Blog (headless WordPress) — `miduva.com/blog`
- Write at **`miduva.com/wp-admin`**, user `miduva-admin`, password
  `WP_ADMIN_PASSWORD` in `.env` → **change it after first login**.
- Four starter articles are waiting as **drafts** under Posts.
- SEO built in: Yoast fields per post, canonical URLs, structured data, RSS
  (`/blog/rss.xml`), posts added to `/sitemap.xml` automatically.

### 4. Search Console & analytics — ready, just add your IDs
The code is in place. Paste the values into `.env` (see below) and restart;
no rebuild needed. Trackers only load after a visitor accepts cookies.

---

## ⏳ Needs you (can't be done without your accounts)

### 1. Email alerts for new leads — *most important*
Pick **one**:

- **Email (Resend, free tier):** create an account at resend.com, verify the
  `miduva.com` domain (it gives you DNS records to add), create an API key, then add
  to `.env`:
  ```
  RESEND_API_KEY=re_xxxxxxxx
  CONTACT_FROM_EMAIL=Miduva <leads@miduva.com>
  CONTACT_NOTIFICATION_EMAIL=you@yourcompany.com
  ```
- **Slack / Zapier / Make webhook:** add
  `CONTACT_WEBHOOK_URL=https://hooks...` (optional `CONTACT_WEBHOOK_SECRET`).

### 2. Off-site backup copy
Daily backups stay on this server. For real safety, copy them somewhere else
too (Backblaze B2, AWS S3, Google Drive via rclone, or your server provider's
snapshot feature). Send me the credentials for whichever you choose, or enable
**automatic server snapshots** in your hosting panel (simplest).

### 3. Google Analytics & Meta Pixel
Add to `.env`:
```
GA_MEASUREMENT_ID=G-XXXXXXXXXX   # analytics.google.com → Admin → Data streams
META_PIXEL_ID=123456789012345    # business.facebook.com → Events Manager
```

### 4. Google Search Console
1. search.google.com/search-console → **Add property** → *URL prefix* → `https://miduva.com/`
2. Choose **HTML tag** verification and copy only the `content="…"` value.
3. Add `GOOGLE_SITE_VERIFICATION=that-value` to `.env`, apply (below), click **Verify**.
4. Then **Sitemaps** → submit `https://miduva.com/sitemap.xml`.

### 5. Calendar for "Book your free call"
The Free Offer now lives inside **Get in touch** as a "Get a free growth
strategy" banner. Its **Book your free call** button opens your booking
calendar in a popup — once you add the link:

1. Create a free account at **cal.com** and connect your Google/Outlook calendar.
2. Create an event type, e.g. *Strategy call*, 30 minutes, with a video link.
3. Copy its public link (e.g. `https://cal.com/miduva/strategy-call`).
4. In the **site editor** → *Contact* section → *Free strategy call* →
   **Calendar booking link**, paste it and **Publish**.

Until then the button scrolls visitors to the contact form. A Calendly link
works too.

### 6. Publish blog posts
Review the four drafts at `/wp-admin` → Posts, edit, and **Publish**. The blog
starts building search traffic only once posts are live.

### 7. CRM (crm.miduva.com)
The CRM returns *403 Forbidden*: the Perfex CRM files were never uploaded to
`perfex/html/`. Upload your Perfex package there, then ask me to finish the
install and add HTTPS for `crm.miduva.com`.

---

## How to apply `.env` changes
```bash
cd /opt/miduva && docker compose up -d nextjs
```
(`.env` holds secrets and is never committed to git.)

## How to restore from a backup
Pick a folder in `/opt/miduva/backups/`, then:

```bash
# Site content + leads
gunzip -c backups/DATE/miduva.db.gz > /tmp/miduva.db
docker cp /tmp/miduva.db miduva-nextjs-1:/data/miduva.db && docker compose restart nextjs

# Blog + CRM databases
gunzip -c backups/DATE/mysql.sql.gz | docker exec -i miduva-mysql-1 sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD"'

# Blog images
docker run --rm -v miduva_wp_data:/dst -v "$PWD/backups/DATE":/in alpine:3.22 tar xzf /in/wp-uploads.tar.gz -C /dst/wp-content
```
Ask for help before restoring on the live server if you're unsure: a restore
overwrites current data.
