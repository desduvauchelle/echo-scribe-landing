# Features & Use-Case Pages — Design Spec

**Date:** 2026-07-22
**Status:** Approved design, pending spec review
**Owner:** Echo Scribe landing

## Goal

Add dedicated **Features** and **Use Case** pages to the Echo Scribe landing site,
reachable from **two new header dropdown menus** (Features ▾ and Use Cases ▾). Each
page is illustrated with realistic **app "screenshots"** produced by rendering
controlled HTML mockups with Playwright — never by touching the user's local Echo
Scribe install and never exposing real meeting data.

## Non-goals (YAGNI)

- No screenshots of the real installed app; no screen-recording/computer-use capture.
- No light/dark **image pairs** in v1 — one polished neutral rendering per screen.
  (Can add `data-theme`-swapped pairs later.)
- No CMS/dynamic content — pages are static server components with dictionary copy.
- No new blog/SDK data sources.

## 1. Information architecture & routing

Two independent top-level dropdowns in the header. Header nav order:

```
Home · Features ▾ · Use Cases ▾ · Blog · Contact · [Download]
```

Each dropdown's **label links to its hub page**; items link to detail pages.

Ten new pages under `src/app/[locale]/`:

| Group | Page | Route (default locale) | Slug file |
|---|---|---|---|
| hub | Features overview | `/features` | `features/page.tsx` |
| Features | Capture & Record | `/features/capture` | `features/capture/page.tsx` |
| Features | Understand & Organize | `/features/organize` | `features/organize/page.tsx` |
| Features | Editor & Export | `/features/editor` | `features/editor/page.tsx` |
| Features | Platform & System | `/features/platform` | `features/platform/page.tsx` |
| hub | Use Cases overview | `/use-cases` | `use-cases/page.tsx` |
| Use Cases | For Consultants | `/use-cases/consultants` | `use-cases/consultants/page.tsx` |
| Use Cases | For Sales Teams | `/use-cases/sales-teams` | `use-cases/sales-teams/page.tsx` |
| Use Cases | For Founders | `/use-cases/founders` | `use-cases/founders/page.tsx` |
| Use Cases | For Students & Educators | `/use-cases/students` | `use-cases/students/page.tsx` |

Secondary-locale (`fr`) URLs carry the `/fr` prefix as usual; default locale is bare.

## 2. Navigation components

### Desktop header (`src/components/layout/Header.tsx`)

- Add two `NavDropdown` entries between Home and Blog.
- Implement a small **`NavDropdown` server component** using DaisyUI `dropdown`
  (`dropdown dropdown-hover` + `menu` in a `dropdown-content` card) so it works
  without client JS. Trigger is a `Link` to the hub page with a chevron; the panel
  lists the group's item links.
- The dropdown data is a typed config (see §4) mapping label + href, built with
  `localizedPath(path, locale)` for **every** href (never hand-written `/${locale}/…`).

### Mobile menu (`src/components/layout/MobileMenu.tsx`)

- Extend the current flat `links: NavLink[]` API to also accept
  `groups?: { label: string; href: string; items: NavLink[] }[]`.
- Render each group as a DaisyUI `collapse`/accordion (or a simple labeled section)
  with the hub link as the heading and item links beneath. Existing flat links
  (Home, Blog, Contact) render as today. Keep the `onClick={() => setMenuOpen(false)}`
  close behavior on every link.
- No change to the existing `NavLink` shape; `groups` is additive/optional so nothing
  else that renders `MobileMenu` breaks.

## 3. Shared page template (data-driven)

All 10 pages render through **one shared server component** so we don't hand-author
10 bespoke layouts.

### `ProductPage` component — `src/components/product/ProductPage.tsx`

Props (all copy comes in already-resolved from the dictionary by the page):

```ts
interface Shot { src: string; alt: string; caption?: string }
interface Slab {
  eyebrow: string
  title: string
  desc: string
  steps: { title: string; desc: string }[]   // 0–3 numbered steps
  shot?: Shot                                  // optional screenshot beside copy
  reverse?: boolean
  tinted?: boolean
}
interface ProductPageProps {
  eyebrow: string
  title: string
  subtitle: string
  hero?: Shot                 // large framed screenshot under the hero
  slabs: Slab[]
  dict: Dictionary            // for the reused CTA + download label
  locale: string
}
```

Sections, reusing the existing homepage visual system:

1. **Hero** — `Eyebrow`, headline, subhead, primary Download CTA
   (`localizedPath('/', locale) + '#install'`), optional framed hero screenshot.
2. **Screenshot showcase / alternating slabs** — same look as `Features.tsx`
   (numbered steps + visual beside copy). The "visual" is now a framed
   `next/image` screenshot (see §5 `ScreenshotFrame`) instead of a CSS mockup.
3. **CTA** — reuse existing `CTA` component (`src/components/landing/CTA.tsx`).

### Screenshot frame — `src/components/product/ScreenshotFrame.tsx`

Wraps a `next/image` in the same macOS-window chrome used by
`FeatureMockups.TranscriptionDemo` (traffic-light dots, elevated card, rounded-3xl,
soft green shadow) so rendered PNGs feel native to the site. `role="img"` +
`alt`/`aria-label`. Uses fixed intrinsic width/height from the rendered PNG size.

### Feature vs Use-Case pages

- **Feature pages** describe *what it does* — slabs map to the capability list.
- **Use-case pages** wrap the **same screenshots** in a persona narrative
  (job → workflow → payoff). Screenshots are a shared library (§5), so use-case
  pages add copy only, no new assets.

Each `page.tsx` is thin: resolve `dict`, assemble the `ProductPageProps` config from
dictionary keys, render `<ProductPage … />`, and export `generateMetadata`.

## 4. Page config & content mapping

A single typed config module — `src/components/product/pages.config.ts` — lists each
page's `path`, dictionary-key prefix, which screenshots it uses, and slab structure.
The nav dropdown config (`src/components/layout/nav.config.ts`) derives its item lists
from the same source of truth so menu and pages never drift.

Screenshot → page mapping (v1 core screens in `public/screenshots/`):

| Screen asset | Primary page(s) |
|---|---|
| `meeting-hud` | features/capture, use-cases/consultants, sales-teams |
| `screen-recorder` | features/capture, use-cases/founders |
| `dictation` | features/capture, use-cases/founders |
| `chat` | features/organize, use-cases/students, consultants |
| `daily-summary` | features/organize, use-cases/founders |
| `meetings` | features/organize, use-cases/consultants, sales-teams |
| `dashboard` | features/organize, hubs |
| `tasks` | features/organize, use-cases/consultants |
| `projects` | features/organize, use-cases/consultants |
| `editor` | features/editor, use-cases/founders |
| `export` | features/editor |
| `settings` | features/platform |

## 5. Screenshot pipeline (Playwright render of controlled HTML)

The novel piece. Produces static PNGs; **no runtime/build dependency on Playwright**
for the Next app — it's a one-shot generator script committed alongside its output.

### Layout

```
tools/screenshots/
  frame.css            # shared app-shell styling (matches brand tokens + macOS chrome)
  data.ts (or inline)  # controlled fake data (no real names/meetings)
  screens/
    meeting-hud.html
    screen-recorder.html
    dictation.html
    chat.html
    daily-summary.html
    meetings.html
    dashboard.html
    tasks.html
    projects.html
    editor.html
    export.html
    settings.html
  render.mjs           # Playwright script → renders each screen to PNG
public/screenshots/
  *.png                # committed output (2× retina), + *.webp optional
```

### `render.mjs`

- Launches Chromium via Playwright (already available in this environment).
- For each `screens/*.html`: `page.setViewportSize` to the screen's design size,
  `deviceScaleFactor: 2`, `page.goto('file://…')`, wait for fonts/network idle,
  screenshot the app-window element (`page.locator('.app-window').screenshot(...)`)
  to `public/screenshots/<name>.png`.
- Deterministic: fixed data, no timestamps that change per run, no external fonts
  (use system font stack or brand webfont embedded locally).
- Documented run command in the spec/README: `node tools/screenshots/render.mjs`.

### Mockup styling

- Self-contained HTML/CSS, no framework. Colors pulled from the site's DaisyUI green
  palette so screenshots match the brand.
- **All data hardcoded and fictional** — sample meeting titles, fake attendee first
  names, lorem-style transcript lines, placeholder task text. Explicitly nothing from
  the real app or user.
- One neutral, polished rendering per screen (readable on both light and dark site
  themes because each sits inside its own window chrome on a card).

## 6. SEO / i18n plumbing (required by CLAUDE.md)

- Each `page.tsx` exports `generateMetadata` → `buildPageMetadata({ path, locale,
  title, description })` with the **locale-agnostic** path (e.g. `/features/capture`),
  a unique branded title, and a unique description.
- Add all 10 routes to `STATIC_PAGES` in `src/lib/sitemap-shared.ts`.
- Add every new dictionary key to **both** `src/i18n/dictionaries/en.ts` and
  `fr.ts` (build typechecks that all keys exist in both via the `DictionaryKey`
  union). English copy authored here; French translated.
- All internal links via `localizedPath` / dropdown config → the
  `no-hardcoded-locale-links` unit test stays green.
- No `robots: { index: false }` — these pages are meant to be indexed.

### Dictionary key convention

Flat dot keys, one prefix per page, e.g.:

```
'nav.features', 'nav.usecases'
'features.hub.title', 'features.hub.subtitle', …
'features.capture.title', 'features.capture.subtitle',
'features.capture.slab1.eyebrow', 'features.capture.slab1.title',
'features.capture.slab1.desc', 'features.capture.slab1.step1.title', …
'usecases.consultants.title', … etc.
'shot.meeting-hud.alt', 'shot.chat.alt', …   # screenshot alt text
```

## 7. Verification

1. `node tools/screenshots/render.mjs` → confirm expected PNGs exist in
   `public/screenshots/`.
2. `pnpm typecheck` — proves every dictionary key exists in en + fr and props line up.
3. `pnpm lint`.
4. `pnpm build` — proves all 10 routes compile and metadata is valid.
5. Dev server + Playwright: load `/features`, `/features/capture`, `/use-cases`,
   one use-case page; screenshot each to confirm layout + images render; check
   console for errors; toggle dark theme on one page.
6. Confirm sitemap includes the 10 new URLs and each page's canonical is
   self-referencing.

## 8. Files touched / added (summary)

**Added**
- `src/app/[locale]/features/page.tsx` (+ `capture/`, `organize/`, `editor/`,
  `platform/` subpages)
- `src/app/[locale]/use-cases/page.tsx` (+ `consultants/`, `sales-teams/`,
  `founders/`, `students/` subpages)
- `src/components/product/ProductPage.tsx`, `ScreenshotFrame.tsx`,
  `pages.config.ts`
- `src/components/layout/NavDropdown.tsx`, `nav.config.ts`
- `tools/screenshots/**` (mockups + `render.mjs`)
- `public/screenshots/*.png`

**Modified**
- `src/components/layout/Header.tsx` (two dropdowns)
- `src/components/layout/MobileMenu.tsx` (optional `groups` support)
- `src/lib/sitemap-shared.ts` (`STATIC_PAGES`)
- `src/i18n/dictionaries/en.ts`, `src/i18n/dictionaries/fr.ts` (new keys)

## Open questions / decisions locked

- Menu: **two** separate dropdowns (Features, Use Cases). ✔
- Hub pages: **kept** (`/features`, `/use-cases`) as dropdown-label destinations. ✔
- Personas: consultants, sales teams, founders, students/educators. ✔
- Screenshots: Playwright-rendered controlled HTML, one look per screen. ✔
