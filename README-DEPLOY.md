# UpperCrust Wealth — website

Static site (HTML, CSS, JS — no build step) with a private admin panel at `/admin` and a monthly performance spreadsheet.

## 1. Push to GitHub (first time)
```bash
cd uppercrust-site
git init
git add .
git commit -m "UpperCrust Wealth website"
git branch -M main
git remote add origin https://github.com/<your-org>/uppercrust-site.git
git push -u origin main
```
**Every later update:** replace the folder contents with the new zip, then
```bash
git add -A
git commit -m "Website update"
git push
```
`git add -A` also records files that were deleted (for example the old `mf.html` and fund pages).

## 2. Host on Netlify
1. netlify.com → **Add new site → Import an existing project → GitHub** → choose `uppercrust-site`.
2. Build command: *leave empty*. Publish directory: `.` → **Deploy**.
3. **Domain management** → add `uppercrustwealth.com`, follow the DNS steps (HTTPS is automatic).

## 3. Admin panel (`/admin`)
1. Netlify → **Identity → Enable**. Registration → **Invite only**.
2. Identity → Services → **Git Gateway → Enable**.
3. Identity → **Invite users** (yourself and editors) → accept the email → open `https://uppercrustwealth.com/admin`.

| Admin section | What it changes |
|---|---|
| Contact, event and firm details | phone, email, address, WhatsApp, LinkedIn, Conclave sticker, firm figures, PMS provider and SEBI number, compliance officer, performance-sheet link |
| Insights | research notes on the Asset Management page |
| Leadership | names, roles, LinkedIn links, portraits |
| Photographs | upload a photo into any place on the site |

Every save is a Git commit — versioned and reversible.

## 4. Monthly performance (Google Sheet)
1. Import `content/performance.csv` into a Google Sheet.
2. Each month paste the factsheet rows (fund and benchmark), set `as_of`, set `publish` to `yes` for funds that may be shown.
3. File → Share → **Publish to web** → the sheet → **CSV** → copy the link.
4. Paste it into /admin → Contact, event and firm details → **Performance spreadsheet**.
The record panel and AUM figures follow the sheet. If no link is set, `content/performance.csv` is used.

## 5. Enquiries
Netlify → **Forms → Enable form detection**, redeploy once. Letters arrive under Forms → `enquiry`; add an email notification.


## Leads & enquiries on GitHub Pages (Google Sheet)
GitHub Pages cannot receive form posts, so the site sends them to a small Google Apps Script instead:
1. Open `backend/apps-script.gs` and follow the 5 steps at the top (create a Sheet, paste the script, deploy as a web app).
2. Paste the web-app URL into /admin → Contact, event and firm details → **Lead & enquiry endpoint**
   (or into `content/site.json` → `"leadEndpoint"` if you edit files directly).
Every **Research library** sign-up (name, mobile, email) and every **enquiry letter** then lands in the Sheet — optionally emailed to you.
Until the URL is set, the Research room still opens and enquiry letters open the visitor's email app.

## Research library (resources.html)
Locked behind a short form. After a visitor submits name, mobile and email, the room stays unlocked on their device.
Notes come from /admin → Insights; attach a PDF to a note to make it downloadable.

## Before launch — please confirm
- PMS wording approved by compliance (footer and disclosure name Moat Financial Services Pvt. Ltd., SEBI PMS Reg. No. INP000004482).
- Compliance officer details filled in (/admin).
- Leadership LinkedIn URLs and portraits (/admin → Leadership).
- City photos you supplied: usage rights confirmed.

## Local preview
`python3 -m http.server` in this folder → http://localhost:8000

## Structure (modular — one concern per file)
```
├── .gitignore
├── PHOTO-BRIEF.md
├── README-DEPLOY.md
├── admin/
│   ├── config.yml
│   └── index.html
├── assets/
│   ├── css/
│   │   ├── base.css
│   │   ├── components/
│   │   │   ├── blocks.css
│   │   │   ├── buttons.css
│   │   │   ├── cards.css
│   │   │   ├── faq.css
│   │   │   ├── footer.css
│   │   │   ├── header.css
│   │   │   ├── hero.css
│   │   │   ├── insights.css
│   │   │   ├── letter.css
│   │   │   ├── media.css
│   │   │   ├── people.css
│   │   │   ├── principles.css
│   │   │   ├── quote.css
│   │   │   └── steps.css
│   │   ├── core.css
│   │   ├── fonts.css
│   │   ├── layout.css
│   │   ├── pages/
│   │   │   ├── fund.css
│   │   │   ├── home.css
│   │   │   ├── mf.css
│   │   │   ├── pms.css
│   │   │   ├── soon.css
│   │   │   └── stories.css
│   │   └── tokens.css
│   ├── fonts/  (7 files)
│   ├── img/
│   │   ├── logo-dark.png
│   │   ├── logo-light.png
│   │   └── photos/  (11 files)
│   └── js/
│       ├── components/
│       │   ├── contact.js
│       │   ├── footer.js
│       │   ├── header.js
│       │   ├── insights.js
│       │   └── team.js
│       ├── data/
│       │   ├── funds.js
│       │   ├── images.js
│       │   ├── loader.js
│       │   └── site.js
│       ├── main.js
│       ├── modules/
│       │   ├── bind.js
│       │   ├── india-map.js
│       │   ├── inview.js
│       │   ├── letter-form.js
│       │   ├── media.js
│       │   ├── picker.js
│       │   ├── rail.js
│       │   ├── record.js
│       │   ├── stories.js
│       │   ├── strata.js
│       │   ├── subnav.js
│       │   └── suggest.js
│       └── uc.js
├── broking.html
├── client-stories.html
├── content/
│   ├── funds.json
│   ├── images.json
│   ├── insights.json
│   ├── performance.csv
│   ├── site.json
│   └── team.json
├── index.html
├── insurance.html
├── netlify.toml
├── pms.html
├── robots.txt
├── sitemap.xml
└── wealth-advisory.html
```

## Downloads and enquiries into Google Sheets
Every document download (name, mobile, email, which document) and every enquiry letter is sent to a Google Apps Script
web app that writes it into a Google Sheet and emails yash@uppercrustwealth.com.
1. In the Sheet: Extensions, Apps Script, paste `backend/apps-script.gs`, Save.
2. Deploy, New deployment, Web app. Execute as: Me. Who has access: Anyone. Deploy and approve the permissions.
3. Copy the web app URL (https://script.google.com/macros/s/.../exec).
4. Paste it into `content/site.json` as the value of `leadEndpoint` (or /admin, Contact, event and firm details), then commit.
Until step 4 is done, downloads still work and letters open the visitor's email app.
If you change the script later, use Deploy, Manage deployments, Edit, New version. The URL stays the same.
