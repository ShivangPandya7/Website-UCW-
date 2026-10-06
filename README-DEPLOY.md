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
The record panel, AUM figures and calculator all follow the sheet. If no link is set, `content/performance.csv` is used.

## 5. Enquiries
Netlify → **Forms → Enable form detection**, redeploy once. Letters arrive under Forms → `enquiry`; add an email notification.

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
│   │   │   ├── calculator.css
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
│       │   ├── calculator.js
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
