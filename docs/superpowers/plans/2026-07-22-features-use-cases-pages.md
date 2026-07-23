# Features & Use-Case Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 10 static Features/Use-Case pages reachable from two new header dropdowns, illustrated with Playwright-rendered "screenshots" of controlled HTML mockups.

**Architecture:** All 10 pages render through one shared `ProductPage` server component driven by a per-page config. App "screenshots" are PNGs generated once by a committed Playwright script from self-contained HTML mockups (fake data), then embedded via `next/image` inside a macOS-window `ScreenshotFrame`. Two header dropdowns (`Features ▾`, `Use Cases ▾`) and a mobile accordion are driven by a shared nav config.

**Tech Stack:** Next.js 15 (App Router, React 19 server components), TypeScript strict, Tailwind v4 + DaisyUI 5, Playwright (devDependency, screenshot generation only).

## Global Constraints

- No semicolons, single quotes, trailing commas; `import type` for type-only imports; prefix unused vars with `_`.
- Every internal href built with `localizedPath(path, locale)` from `@/lib/i18n-utils` — NEVER hand-write `` `/${locale}/…` `` (unit test `no-hardcoded-locale-links.unit.test.ts` fails the build otherwise).
- Every page exports `generateMetadata` returning `buildPageMetadata({ path, locale, title, description })` with the **locale-agnostic** path (e.g. `/features/capture`).
- Every dictionary key MUST exist in BOTH `src/i18n/dictionaries/en.ts` and `src/i18n/dictionaries/fr.ts` (typechecked via `DictionaryKey = keyof typeof en`). `fr` is typed `const fr: Dictionary`.
- Use DaisyUI component classes (`dropdown`, `menu`, `collapse`, `btn`, `card`) and theme tokens (`base-100`, `base-200`, `base-content`, `primary`, `accent`). Dark mode is `data-theme`, not `prefers-color-scheme`.
- Commands: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`. Do not commit to `main` without the user's go-ahead — branch first if asked to commit.
- Screenshot data is 100% fictional — no real names, meetings, or user data.

---

### Task 1: Nav config + nav dictionary keys

**Files:**
- Create: `src/components/layout/nav.config.ts`
- Modify: `src/i18n/dictionaries/en.ts` (after `'nav.contact'`)
- Modify: `src/i18n/dictionaries/fr.ts` (after `'nav.contact'`)

**Interfaces:**
- Produces: `NavGroup` type `{ labelKey: DictionaryKey; hubPath: string; itemKeys: { path: string; labelKey: DictionaryKey }[] }`; `FEATURE_GROUP: NavGroup`; `USECASE_GROUP: NavGroup`. Paths are locale-agnostic (e.g. `/features/capture`); consumers wrap with `localizedPath`.

- [ ] **Step 1: Add nav dictionary keys to `en.ts`** (insert after the `'nav.contact'` line)

```ts
	'nav.features': 'Features',
	'nav.usecases': 'Use cases',
	'nav.features.capture': 'Capture & Record',
	'nav.features.organize': 'Understand & Organize',
	'nav.features.editor': 'Editor & Export',
	'nav.features.platform': 'Platform & System',
	'nav.features.all': 'All features',
	'nav.usecases.consultants': 'For Consultants',
	'nav.usecases.sales': 'For Sales Teams',
	'nav.usecases.founders': 'For Founders',
	'nav.usecases.students': 'For Students & Educators',
	'nav.usecases.all': 'All use cases',
```

- [ ] **Step 2: Add the same keys to `fr.ts`** (insert after the `'nav.contact'` line, French values)

```ts
	'nav.features': 'Fonctionnalités',
	'nav.usecases': 'Cas d’usage',
	'nav.features.capture': 'Capture et enregistrement',
	'nav.features.organize': 'Comprendre et organiser',
	'nav.features.editor': 'Édition et export',
	'nav.features.platform': 'Plateforme et système',
	'nav.features.all': 'Toutes les fonctionnalités',
	'nav.usecases.consultants': 'Pour les consultants',
	'nav.usecases.sales': 'Pour les équipes commerciales',
	'nav.usecases.founders': 'Pour les fondateurs',
	'nav.usecases.students': 'Pour les étudiants et enseignants',
	'nav.usecases.all': 'Tous les cas d’usage',
```

- [ ] **Step 3: Create `nav.config.ts`**

```ts
import type { DictionaryKey } from '@/i18n'

export interface NavItem {
	path: string
	labelKey: DictionaryKey
}

export interface NavGroup {
	labelKey: DictionaryKey
	hubPath: string
	itemKeys: NavItem[]
}

export const FEATURE_GROUP: NavGroup = {
	labelKey: 'nav.features',
	hubPath: '/features',
	itemKeys: [
		{ path: '/features/capture', labelKey: 'nav.features.capture' },
		{ path: '/features/organize', labelKey: 'nav.features.organize' },
		{ path: '/features/editor', labelKey: 'nav.features.editor' },
		{ path: '/features/platform', labelKey: 'nav.features.platform' },
	],
}

export const USECASE_GROUP: NavGroup = {
	labelKey: 'nav.usecases',
	hubPath: '/use-cases',
	itemKeys: [
		{ path: '/use-cases/consultants', labelKey: 'nav.usecases.consultants' },
		{ path: '/use-cases/sales-teams', labelKey: 'nav.usecases.sales' },
		{ path: '/use-cases/founders', labelKey: 'nav.usecases.founders' },
		{ path: '/use-cases/students', labelKey: 'nav.usecases.students' },
	],
}

export const NAV_GROUPS: NavGroup[] = [FEATURE_GROUP, USECASE_GROUP]
```

- [ ] **Step 4: Verify typecheck passes**

Run: `pnpm typecheck`
Expected: PASS (all new keys present in en + fr; `DictionaryKey` references resolve).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/nav.config.ts src/i18n/dictionaries/en.ts src/i18n/dictionaries/fr.ts
git commit -m "feat: add nav config and dictionary keys for product menus"
```

---

### Task 2: NavDropdown component + Header wiring

**Files:**
- Create: `src/components/layout/NavDropdown.tsx`
- Modify: `src/components/layout/Header.tsx`

**Interfaces:**
- Consumes: `NavGroup` from `nav.config.ts`, `NAV_GROUPS`; `localizedPath` from `@/lib/i18n-utils`; `Dictionary` from `@/i18n`.
- Produces: `NavDropdown({ group, dict, locale })` server component.

- [ ] **Step 1: Create `NavDropdown.tsx`** (DaisyUI hover dropdown; label links to hub)

```tsx
import Link from 'next/link'
import type { Dictionary } from '@/i18n'
import type { NavGroup } from './nav.config'
import { localizedPath } from '@/lib/i18n-utils'

export function NavDropdown({ group, dict, locale }: { group: NavGroup; dict: Dictionary; locale: string }) {
	return (
		<div className="dropdown dropdown-hover">
			<Link
				href={localizedPath(group.hubPath, locale)}
				className="flex items-center gap-1 text-base-content/70 transition-colors hover:text-primary"
			>
				{dict[group.labelKey]}
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</Link>
			<ul className="dropdown-content menu z-50 mt-2 w-60 rounded-box border border-base-content/10 bg-base-100 p-2 shadow-lg">
				{group.itemKeys.map((item) => (
					<li key={item.path}>
						<Link href={localizedPath(item.path, locale)}>{dict[item.labelKey]}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
```

- [ ] **Step 2: Wire dropdowns into `Header.tsx` desktop nav.** Import `NavDropdown` and `NAV_GROUPS`; replace the desktop `<nav>` block so it renders Home, the two dropdowns, then Blog/Contact. Change the `NAV_LINKS` used by desktop to home/blog/contact only, and build a combined `mobileGroups` for MobileMenu (Task 3).

Add imports at top of `Header.tsx`:

```tsx
import { NavDropdown } from './NavDropdown'
import { NAV_GROUPS } from './nav.config'
```

Replace the desktop `<nav>` inner links (lines rendering `NAV_LINKS.slice(0, 3)`) with:

```tsx
				<nav className="hidden items-center gap-6 md:flex">
					<Link href={localizedPath('/', locale)} className="text-base-content/70 transition-colors hover:text-primary">
						{dict['nav.home']}
					</Link>
					{NAV_GROUPS.map((group) => (
						<NavDropdown key={group.hubPath} group={group} dict={dict} locale={locale} />
					))}
					<Link href={localizedPath('/blog', locale)} className="text-base-content/70 transition-colors hover:text-primary">
						{dict['nav.blog']}
					</Link>
					<Link href={localizedPath('/contact', locale)} className="text-base-content/70 transition-colors hover:text-primary">
						{dict['nav.contact']}
					</Link>
					<LanguageSwitcher locale={locale} />
					<ThemeToggle />
					<Link href={`${localizedPath('/', locale)}#install`} className="btn btn-primary btn-sm gap-2 rounded-[9px] font-semibold">
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="7 10 12 15 17 10" />
							<line x1="12" y1="15" x2="12" y2="3" />
						</svg>
						{dict['nav.download']}
					</Link>
				</nav>
```

Keep the existing `NAV_LINKS` array for MobileMenu but it will be updated in Task 3.

- [ ] **Step 3: Run dev server and verify dropdowns render**

Run: `pnpm dev`, then use the Browser pane: `preview_start {name:"echo-scribe"}` (or start dev and navigate to `http://localhost:3000`). Hover "Features" → panel with 4 items appears; label click goes to `/features` (will 404 until Task 7 — acceptable now). Check `read_console_messages` for no errors.

- [ ] **Step 4: Typecheck + lint**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/NavDropdown.tsx src/components/layout/Header.tsx
git commit -m "feat: add Features and Use Cases header dropdowns"
```

---

### Task 3: MobileMenu group (accordion) support

**Files:**
- Modify: `src/components/layout/MobileMenu.tsx`
- Modify: `src/components/layout/Header.tsx` (pass `groups` prop)

**Interfaces:**
- Consumes: existing `NavLink { href; label }`.
- Produces: `MobileMenu` accepts additional optional prop `groups?: MobileGroup[]` where `MobileGroup = { label: string; href: string; items: NavLink[] }`.

- [ ] **Step 1: Extend `MobileMenu.tsx` props and rendering.** Add the `MobileGroup` interface and render groups as labeled sections above the flat links. Full updated component:

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'

interface NavLink {
	href: string
	label: string
}

interface MobileGroup {
	label: string
	href: string
	items: NavLink[]
}

export function MobileMenu({
	links,
	groups = [],
	locale,
}: {
	links: NavLink[]
	groups?: MobileGroup[]
	locale: string
}) {
	const [menuOpen, setMenuOpen] = useState(false)

	return (
		<>
			<button
				className="md:hidden btn btn-ghost btn-square"
				onClick={() => setMenuOpen(!menuOpen)}
				aria-label="Toggle menu"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current">
					{menuOpen ? (
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					) : (
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
					)}
				</svg>
			</button>

			{menuOpen && (
				<div className="md:hidden border-t border-base-200 bg-base-100 absolute top-full left-0 right-0 shadow-lg">
					<nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="text-base-content/70 hover:text-primary transition-colors py-1"
								onClick={() => setMenuOpen(false)}
							>
								{link.label}
							</Link>
						))}
						{groups.map((group) => (
							<div key={group.href} className="border-t border-base-200 pt-2">
								<Link
									href={group.href}
									className="block py-1 text-sm font-semibold text-base-content"
									onClick={() => setMenuOpen(false)}
								>
									{group.label}
								</Link>
								<div className="flex flex-col gap-1 pl-3">
									{group.items.map((item) => (
										<Link
											key={item.href}
											href={item.href}
											className="text-base-content/70 hover:text-primary transition-colors py-1 text-sm"
											onClick={() => setMenuOpen(false)}
										>
											{item.label}
										</Link>
									))}
								</div>
							</div>
						))}
						<LanguageSwitcher locale={locale} />
						<ThemeToggle />
					</nav>
				</div>
			)}
		</>
	)
}
```

- [ ] **Step 2: Build `mobileGroups` in `Header.tsx` and pass to MobileMenu.** Update `NAV_LINKS` to the flat set and add a `mobileGroups` array from `NAV_GROUPS`:

```tsx
	const NAV_LINKS = [
		{ href: localizedPath('/', locale), label: dict['nav.home'] },
		{ href: localizedPath('/blog', locale), label: dict['nav.blog'] },
		{ href: localizedPath('/contact', locale), label: dict['nav.contact'] },
	]

	const mobileGroups = NAV_GROUPS.map((group) => ({
		label: dict[group.labelKey],
		href: localizedPath(group.hubPath, locale),
		items: group.itemKeys.map((item) => ({
			href: localizedPath(item.path, locale),
			label: dict[item.labelKey],
		})),
	}))
```

Change the MobileMenu usage to: `<MobileMenu links={NAV_LINKS} groups={mobileGroups} locale={locale} />`

- [ ] **Step 3: Verify mobile menu in browser.** In the Browser pane `resize_window {preset:"mobile"}`, reload, open the hamburger → Home/Blog/Contact plus two groups with indented items. `read_console_messages` clean.

- [ ] **Step 4: Typecheck + lint**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/MobileMenu.tsx src/components/layout/Header.tsx
git commit -m "feat: add grouped sections to mobile menu"
```

---

### Task 4: Screenshot pipeline infrastructure + first screens

**Files:**
- Create: `tools/screenshots/frame.css`
- Create: `tools/screenshots/screens/meeting-hud.html`
- Create: `tools/screenshots/screens/chat.html`
- Create: `tools/screenshots/screens/meetings.html`
- Create: `tools/screenshots/render.mjs`
- Modify: `package.json` (devDependency `playwright` + `"screenshots"` script)
- Output: `public/screenshots/meeting-hud.png`, `chat.png`, `meetings.png`

**Interfaces:**
- Produces: `render.mjs` renders every `tools/screenshots/screens/*.html` to `public/screenshots/<name>.png` at `deviceScaleFactor: 2`, screenshotting the `#shot` element. Screen HTML must contain a root element `id="shot"` sized to the design width.

- [ ] **Step 1: Install Playwright as a devDependency**

Run: `pnpm add -D playwright && pnpm exec playwright install chromium`
Expected: `playwright` in `devDependencies`; Chromium downloaded. (If Chromium download is blocked, fall back to the Playwright MCP browser to render each `file://` HTML and screenshot `#shot` — same output paths.)

- [ ] **Step 2: Create `tools/screenshots/frame.css`** — shared app-shell + brand tokens (self-contained, system font stack, green palette matching the site).

```css
:root {
	--bg: #ffffff;
	--panel: #f6f8f7;
	--ink: #14231d;
	--muted: #5b6b64;
	--line: rgba(20, 35, 29, 0.1);
	--accent: #1f7a54;
	--accent-soft: rgba(31, 122, 84, 0.1);
	--warning: #b8791f;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: transparent; padding: 24px; }
#shot { width: 880px; border-radius: 18px; overflow: hidden; background: var(--bg); border: 1px solid var(--line); box-shadow: 0 32px 80px rgba(18, 59, 45, 0.16); }
.titlebar { display: flex; align-items: center; gap: 8px; padding: 13px 18px; background: var(--panel); border-bottom: 1px solid var(--line); }
.dot { width: 12px; height: 12px; border-radius: 50%; }
.dot.r { background: #ff5f57; } .dot.y { background: #febc2e; } .dot.g { background: #28c840; }
.titlebar .name { margin-left: 8px; font-size: 13px; color: var(--muted); }
.body { padding: 22px 24px; color: var(--ink); }
.row { display: flex; gap: 14px; }
.sidebar { width: 210px; border-right: 1px solid var(--line); padding: 18px; background: var(--panel); }
.sidebar .item { padding: 8px 10px; border-radius: 8px; font-size: 14px; color: var(--muted); }
.sidebar .item.active { background: var(--accent-soft); color: var(--accent); font-weight: 600; }
.card { border: 1px solid var(--line); border-radius: 12px; padding: 16px; margin-bottom: 12px; }
.tag { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 3px 9px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); }
.h { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }
.sub { font-size: 13px; color: var(--muted); }
.bubble { border-radius: 12px; padding: 12px 14px; font-size: 14px; line-height: 1.5; margin-bottom: 10px; max-width: 78%; }
.bubble.user { background: var(--accent); color: #fff; margin-left: auto; }
.bubble.ai { background: var(--panel); color: var(--ink); border: 1px solid var(--line); }
```

- [ ] **Step 3: Create `tools/screenshots/screens/meeting-hud.html`** (live meeting HUD, fictional data)

```html
<!doctype html>
<html><head><meta charset="utf-8"><link rel="stylesheet" href="../frame.css"></head>
<body>
<div id="shot">
	<div class="titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="name">Echo Scribe — Meeting</span></div>
	<div class="body">
		<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
			<div class="h">Weekly Product Sync</div>
			<span class="tag" style="background:rgba(184,121,31,.12);color:var(--warning)">● Recording 12:04</span>
		</div>
		<div class="card"><div class="sub" style="margin-bottom:6px">Live transcript</div>
			<div style="font-size:15px;line-height:1.7">Dana: Let's lock the launch date before we scope the editor work. Priya: I can have the export pipeline ready by Thursday…<span style="display:inline-block;width:2px;height:16px;background:var(--accent);vertical-align:middle"></span></div>
		</div>
		<div class="card" style="display:flex;gap:12px;align-items:center;background:var(--accent-soft);border-color:rgba(31,122,84,.25)">
			<div style="display:flex;gap:3px;align-items:flex-end;height:20px">
				<span style="width:3px;height:8px;background:var(--accent)"></span><span style="width:3px;height:16px;background:var(--accent)"></span><span style="width:3px;height:20px;background:var(--accent)"></span><span style="width:3px;height:12px;background:var(--accent)"></span>
			</div>
			<span style="font-size:13px;font-weight:600;color:var(--accent)">Capturing system + mic audio</span>
			<span style="margin-left:auto;font-family:monospace;font-size:12px;color:var(--muted)">Auto-stop on silence</span>
		</div>
	</div>
</div>
</body></html>
```

- [ ] **Step 4: Create `tools/screenshots/screens/chat.html`** (chat-with-documents, fictional)

```html
<!doctype html>
<html><head><meta charset="utf-8"><link rel="stylesheet" href="../frame.css"></head>
<body>
<div id="shot">
	<div class="titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="name">Echo Scribe — Ask</span></div>
	<div class="body">
		<div class="bubble user">What did we decide about the launch date?</div>
		<div class="bubble ai"><strong>From “Weekly Product Sync” (Tue):</strong> the team committed to <strong>March 14</strong>. Priya owns the export pipeline (due Thursday); Dana signs off on copy.</div>
		<div class="bubble user">Any blockers mentioned?</div>
		<div class="bubble ai">One: the editor auto-zoom needs QA on external displays. Tagged to project <span class="tag">Launch</span>.</div>
		<div class="card" style="margin-top:8px;display:flex;align-items:center;gap:10px"><span class="sub">Searching 128 transcripts · fully on-device</span></div>
	</div>
</div>
</body></html>
```

- [ ] **Step 5: Create `tools/screenshots/screens/meetings.html`** (meetings list, fictional)

```html
<!doctype html>
<html><head><meta charset="utf-8"><link rel="stylesheet" href="../frame.css"></head>
<body>
<div id="shot">
	<div class="titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="name">Echo Scribe — Meetings</span></div>
	<div class="row">
		<div class="sidebar">
			<div class="item active">Meetings</div><div class="item">Recordings</div><div class="item">Tasks</div><div class="item">Projects</div><div class="item">Daily summary</div>
		</div>
		<div class="body" style="flex:1">
			<div class="h" style="margin-bottom:14px">This week</div>
			<div class="card"><span class="tag">Summarized</span><div style="margin-top:8px;font-weight:600">Weekly Product Sync</div><div class="sub">32 min · 4 speakers · 6 tasks extracted</div></div>
			<div class="card"><span class="tag">Summarized</span><div style="margin-top:8px;font-weight:600">Acme — Discovery Call</div><div class="sub">altered 45 min · 3 speakers · tagged “Acme”</div></div>
			<div class="card"><span class="tag" style="background:rgba(184,121,31,.12);color:var(--warning)">Processing</span><div style="margin-top:8px;font-weight:600">Design Review</div><div class="sub">18 min · denoising audio…</div></div>
		</div>
	</div>
</div>
</body></html>
```

> Note: the two "altered"/typo-looking strings above are intentional placeholder copy examples — replace with the clean sentences shown when authoring (`45 min · 3 speakers · tagged "Acme"`). Keep all names fictional.

- [ ] **Step 6: Create `tools/screenshots/render.mjs`**

```js
import { chromium } from 'playwright'
import { readdir, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, basename } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const screensDir = join(here, 'screens')
const outDir = join(here, '..', '..', 'public', 'screenshots')

await mkdir(outDir, { recursive: true })
const files = (await readdir(screensDir)).filter((f) => f.endsWith('.html'))
const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 2 })

for (const file of files) {
	const name = basename(file, '.html')
	await page.goto('file://' + join(screensDir, file), { waitUntil: 'networkidle' })
	const shot = page.locator('#shot')
	await shot.screenshot({ path: join(outDir, name + '.png') })
	console.log('rendered', name + '.png')
}

await browser.close()
```

- [ ] **Step 7: Add `package.json` script.** Add to `"scripts"`: `"screenshots": "node tools/screenshots/render.mjs"`.

- [ ] **Step 8: Render and verify the three PNGs exist**

Run: `pnpm screenshots`
Expected: logs `rendered meeting-hud.png`, `rendered chat.png`, `rendered meetings.png`; files present in `public/screenshots/`. Open one PNG (Read tool) to eyeball framing/data.

- [ ] **Step 9: Commit**

```bash
git add tools/screenshots package.json public/screenshots pnpm-lock.yaml
git commit -m "feat: add Playwright screenshot pipeline and first app mockups"
```

---

### Task 5: Remaining screen mockups

**Files:**
- Create: `tools/screenshots/screens/dictation.html`, `screen-recorder.html`, `daily-summary.html`, `dashboard.html`, `tasks.html`, `projects.html`, `editor.html`, `export.html`, `settings.html`
- Output: matching `public/screenshots/*.png`

**Interfaces:**
- Consumes: `frame.css` + `render.mjs` from Task 4. Each screen root is `id="shot"`, links `../frame.css`.

- [ ] **Step 1: Author the 9 remaining HTML mockups** following the Task 4 pattern (titlebar + body, fictional data, brand tokens). Content per screen:
  - `dictation.html` — floating push-to-talk pill, waveform, "⌃ Space", partial dictated sentence.
  - `screen-recorder.html` — capture setup window: window/area toggle, camera preview thumbnail, countdown "3", record button.
  - `daily-summary.html` — "Your day" rollup: 3 metric tiles (meetings, tasks, recordings) + bulleted highlights.
  - `dashboard.html` — home overview with activity feed rows (fictional).
  - `tasks.html` — extracted tasks list with checkboxes + source meeting chips.
  - `projects.html` — project cards with auto-tagged transcript counts.
  - `editor.html` — recording editor: timeline track, auto-zoom keyframes, background swatch, play head.
  - `export.html` — export dialog: MP4/GIF toggle, resolution dropdown, progress bar 68%.
  - `settings.html` — settings pane: permissions rows (mic/screen/accessibility ✓), model pickers, theme light/dark/auto, hotkey field.

- [ ] **Step 2: Render all screens**

Run: `pnpm screenshots`
Expected: 12 total PNGs logged and present in `public/screenshots/`.

- [ ] **Step 3: Eyeball each PNG** (Read tool on a few) — confirm no clipping, legible text, fictional data only.

- [ ] **Step 4: Commit**

```bash
git add tools/screenshots/screens public/screenshots
git commit -m "feat: add remaining app screen mockups and render PNGs"
```

---

### Task 6: ScreenshotFrame + ProductPage shared components

**Files:**
- Create: `src/components/product/ScreenshotFrame.tsx`
- Create: `src/components/product/ProductPage.tsx`

**Interfaces:**
- Consumes: `Eyebrow` (`@/components/landing/Eyebrow`), `ScrollReveal` (`@/components/landing/ScrollReveal`), `CTA` (`@/components/landing/CTA`), `localizedPath`, `cn`, `Dictionary`.
- Produces: exported types `Shot`, `Slab`, `ProductPageProps`; components `ScreenshotFrame({ shot })` and `ProductPage(props: ProductPageProps)`.

- [ ] **Step 1: Create `ScreenshotFrame.tsx`** (macOS-window chrome around a `next/image`)

```tsx
import Image from 'next/image'

export interface Shot {
	src: string
	alt: string
	caption?: string
	width?: number
	height?: number
}

export function ScreenshotFrame({ shot }: { shot: Shot }) {
	return (
		<figure className="overflow-hidden rounded-3xl border border-base-content/18 bg-elevated shadow-[0_32px_80px_rgba(18,59,45,0.14)]">
			<div className="flex items-center gap-2 border-b border-base-content/10 bg-base-200 px-4.5 py-3.5" aria-hidden="true">
				<span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
				<span className="h-3 w-3 rounded-full bg-[#febc2e]" />
				<span className="h-3 w-3 rounded-full bg-[#28c840]" />
			</div>
			<Image src={shot.src} alt={shot.alt} width={shot.width ?? 880} height={shot.height ?? 560} className="h-auto w-full" />
			{shot.caption ? <figcaption className="border-t border-base-content/10 px-5 py-3 text-sm text-base-content/60">{shot.caption}</figcaption> : null}
		</figure>
	)
}
```

- [ ] **Step 2: Create `ProductPage.tsx`** (hero + alternating slabs + CTA)

```tsx
import Link from 'next/link'
import type { Dictionary } from '@/i18n'
import { cn } from '@/lib/utils'
import { localizedPath } from '@/lib/i18n-utils'
import { Eyebrow } from '@/components/landing/Eyebrow'
import { ScrollReveal } from '@/components/landing/ScrollReveal'
import { CTA } from '@/components/landing/CTA'
import { ScreenshotFrame, type Shot } from './ScreenshotFrame'

export interface Slab {
	eyebrow: string
	title: string
	desc: string
	steps?: { title: string; desc: string }[]
	shot?: Shot
	reverse?: boolean
	tinted?: boolean
}

export interface ProductPageProps {
	eyebrow: string
	title: string
	subtitle: string
	hero?: Shot
	slabs: Slab[]
	dict: Dictionary
	locale: string
}

export function ProductPage({ eyebrow, title, subtitle, hero, slabs, dict, locale }: ProductPageProps) {
	return (
		<>
			<section className="border-b border-base-content/10 bg-base-100 py-20">
				<div className="container mx-auto max-w-[1080px] px-6 text-center">
					<ScrollReveal y={30}>
						<Eyebrow className="mb-5">{eyebrow}</Eyebrow>
						<h1 className="mx-auto mb-5 max-w-[18ch] text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.05] tracking-[-0.03em]">{title}</h1>
						<p className="mx-auto mb-8 max-w-[52ch] text-[19px] leading-[1.6] text-base-content/70">{subtitle}</p>
						<Link href={`${localizedPath('/', locale)}#install`} className="btn btn-primary gap-2 rounded-[10px] font-semibold">
							{dict['nav.download']}
						</Link>
					</ScrollReveal>
					{hero ? <div className="mt-14"><ScrollReveal y={30}><ScreenshotFrame shot={hero} /></ScrollReveal></div> : null}
				</div>
			</section>

			{slabs.map((slab, i) => (
				<section key={slab.title + i} className={cn('border-t border-base-content/10 py-25', slab.tinted ? 'bg-base-200' : 'bg-base-100')}>
					<div className="container mx-auto max-w-[1080px] px-6">
						<ScrollReveal y={30} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-18">
							<div className={cn(slab.reverse && 'lg:order-last')}>
								<Eyebrow className="mb-5">{slab.eyebrow}</Eyebrow>
								<h2 className="mb-5 text-[clamp(28px,3.8vw,46px)] font-extrabold leading-[1.1] tracking-[-0.03em]">{slab.title}</h2>
								<p className="mb-8 text-[17px] leading-[1.7] text-base-content/70">{slab.desc}</p>
								{slab.steps ? (
									<div className="flex flex-col gap-4">
										{slab.steps.map((step, n) => (
											<div key={step.title} className="flex items-start gap-4">
												<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-[13px] font-bold text-primary">{n + 1}</div>
												<div>
													<strong className="mb-0.5 block text-[15px] font-semibold">{step.title}</strong>
													<span className="text-sm text-base-content/70">{step.desc}</span>
												</div>
											</div>
										))}
									</div>
								) : null}
							</div>
							<div>{slab.shot ? <ScreenshotFrame shot={slab.shot} /> : null}</div>
						</ScrollReveal>
					</div>
				</section>
			))}

			<CTA dict={dict} />
		</>
	)
}
```

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: PASS. (`bg-elevated`, `px-4.5`, `py-3.5`, `gap-18`, `py-25` are already used elsewhere in the codebase, so the Tailwind config supports them.)

- [ ] **Step 4: Commit**

```bash
git add src/components/product/ScreenshotFrame.tsx src/components/product/ProductPage.tsx
git commit -m "feat: add shared ProductPage and ScreenshotFrame components"
```

---

### Task 7: Feature pages (hub + 4) with config, copy, and routes

**Files:**
- Create: `src/components/product/features.config.ts`
- Create: `src/app/[locale]/features/page.tsx`
- Create: `src/app/[locale]/features/capture/page.tsx`
- Create: `src/app/[locale]/features/organize/page.tsx`
- Create: `src/app/[locale]/features/editor/page.tsx`
- Create: `src/app/[locale]/features/platform/page.tsx`
- Modify: `src/i18n/dictionaries/en.ts` + `fr.ts` (feature-page keys)

**Interfaces:**
- Consumes: `ProductPage`, `ProductPageProps`, `Slab`, `Shot`; `getDictionary`, `buildPageMetadata`, `Dictionary`.
- Produces: `buildFeaturePage(key, dict, locale): ProductPageProps` builder per page, driven by dictionary keys.

Content source: the user-provided feature taxonomy (Capture; Understand & Organize; Editor & Export; Platform / System). Copy is authored to that taxonomy in the `en.ts` voice; `fr.ts` is a faithful translation.

- [ ] **Step 1: Add feature-page dictionary keys to `en.ts`.** Full key set (author the values in the existing marketing voice; the hub + capture page are shown complete below as the exemplar; organize/editor/platform follow the identical key shape).

Hub keys:
```ts
	'features.hub.meta.desc': 'Everything Echo Scribe captures, understands, and exports — private and on-device.',
	'features.hub.eyebrow': 'Features',
	'features.hub.title': 'One private app for everything you say, see, and decide.',
	'features.hub.subtitle': 'Capture meetings and your screen, turn them into searchable knowledge, and ship polished recordings — all running locally on your Mac.',
```
Capture page keys (exemplar — full copy):
```ts
	'features.capture.meta.desc': 'Auto-record meetings, capture your screen, and dictate anywhere — with on-device denoising.',
	'features.capture.eyebrow': 'Capture & Record',
	'features.capture.title': 'Never miss what was said — or shown.',
	'features.capture.subtitle': 'Echo Scribe detects meetings, records system and mic audio, captures your screen, and turns your voice into text — automatically.',
	'features.capture.slab1.eyebrow': 'Meetings',
	'features.capture.slab1.title': 'Meetings record themselves.',
	'features.capture.slab1.desc': 'Auto-detect calls, capture both sides of the audio, watch a live HUD, and stop automatically when the room goes quiet.',
	'features.capture.slab1.step1.title': 'Auto-detect', 'features.capture.slab1.step1.desc': 'Starts when a meeting begins — no manual setup.',
	'features.capture.slab1.step2.title': 'System + mic', 'features.capture.slab1.step2.desc': 'Records everyone, not just you.',
	'features.capture.slab1.step3.title': 'Auto-stop', 'features.capture.slab1.step3.desc': 'Ends on inactivity so you never leave it running.',
	'features.capture.slab2.eyebrow': 'Screen capture',
	'features.capture.slab2.title': 'Record your screen like a studio.',
	'features.capture.slab2.desc': 'Window and area capture, a camera preview, and a countdown — set up in one clean window.',
	'features.capture.slab2.step1.title': 'Window or area', 'features.capture.slab2.step1.desc': 'Grab exactly what you need.',
	'features.capture.slab2.step2.title': 'Camera preview', 'features.capture.slab2.step2.desc': 'Add your face when it helps.',
	'features.capture.slab2.step3.title': 'Countdown', 'features.capture.slab2.step3.desc': 'A beat to get ready before it rolls.',
	'features.capture.slab3.eyebrow': 'Dictation & audio',
	'features.capture.slab3.title': 'Speak — it types. Cleanly.',
	'features.capture.slab3.desc': 'Push-to-talk voice-to-text with a hotkey, plus on-device denoising so transcripts stay crisp.',
	'features.capture.slab3.step1.title': 'Push-to-talk', 'features.capture.slab3.step1.desc': 'Hold a hotkey, speak, release.',
	'features.capture.slab3.step2.title': 'Fast ASR', 'features.capture.slab3.step2.desc': 'Local Parakeet speech recognition.',
	'features.capture.slab3.step3.title': 'Denoise', 'features.capture.slab3.step3.desc': 'RNNoise cleanup before transcription.',
	'shot.meeting-hud.alt': 'Echo Scribe live meeting view recording a product sync',
	'shot.screen-recorder.alt': 'Echo Scribe screen recorder setup window',
	'shot.dictation.alt': 'Echo Scribe push-to-talk dictation pill',
```
Organize page keys (`features.organize.*`): hub-style subtitle plus 3 slabs — Slab1 "Search / chat with your documents" (shot `chat`), Slab2 "Daily summary + dashboard" (shot `daily-summary`), Slab3 "Tasks, projects & guides" (shot `projects`). Alt keys `shot.chat.alt`, `shot.daily-summary.alt`, `shot.meetings.alt`, `shot.dashboard.alt`, `shot.tasks.alt`, `shot.projects.alt`.
Editor page keys (`features.editor.*`): Slab1 "Recording editor" (shot `editor`) — auto-zoom, backgrounds, timeline; Slab2 "Export" (shot `export`) — MP4/GIF, Google Drive upload. Alt keys `shot.editor.alt`, `shot.export.alt`.
Platform page keys (`features.platform.*`): Slab1 "Runs on your Mac, privately" (shot `settings`) — local Gemma LLM via llama.cpp, permissions; Slab2 "Set up in minutes" — onboarding/permissions, calendar, auto-updater. Alt key `shot.settings.alt`.

- [ ] **Step 2: Add all the same feature-page keys to `fr.ts`** with faithful French translations (same keys, French values). Typecheck is the gate that none are missed.

- [ ] **Step 3: Create `features.config.ts`** — a builder mapping a page key to `ProductPageProps` using the dictionary. Example (shows capture + hub; organize/editor/platform follow the same shape with their keys and shots):

```ts
import type { Dictionary } from '@/i18n'
import type { ProductPageProps, Slab } from './ProductPage'

const S = '/screenshots'

function slab(dict: Dictionary, base: string, shotSrc: string, shotAltKey: keyof Dictionary, opts: { reverse?: boolean; tinted?: boolean } = {}): Slab {
	return {
		eyebrow: dict[`${base}.eyebrow` as keyof Dictionary],
		title: dict[`${base}.title` as keyof Dictionary],
		desc: dict[`${base}.desc` as keyof Dictionary],
		steps: [1, 2, 3].map((n) => ({
			title: dict[`${base}.step${n}.title` as keyof Dictionary],
			desc: dict[`${base}.step${n}.desc` as keyof Dictionary],
		})),
		shot: { src: `${S}/${shotSrc}.png`, alt: dict[shotAltKey] },
		reverse: opts.reverse,
		tinted: opts.tinted,
	}
}

export function buildCapturePage(dict: Dictionary, locale: string): ProductPageProps {
	return {
		eyebrow: dict['features.capture.eyebrow'],
		title: dict['features.capture.title'],
		subtitle: dict['features.capture.subtitle'],
		hero: { src: `${S}/meeting-hud.png`, alt: dict['shot.meeting-hud.alt'] },
		slabs: [
			slab(dict, 'features.capture.slab1', 'meeting-hud', 'shot.meeting-hud.alt'),
			slab(dict, 'features.capture.slab2', 'screen-recorder', 'shot.screen-recorder.alt', { reverse: true, tinted: true }),
			slab(dict, 'features.capture.slab3', 'dictation', 'shot.dictation.alt'),
		],
		dict,
		locale,
	}
}
// buildOrganizePage, buildEditorPage, buildPlatformPage, buildFeaturesHub — same pattern.
```
> The dynamic-key indexing (`as keyof Dictionary`) type-checks because every referenced key exists in `en.ts`. If strict indexed access complains, the fallback is to list keys explicitly per slab (no template strings). Prefer explicit keys if `pnpm typecheck` errors.

- [ ] **Step 4: Create the 5 feature route files.** Each is thin. Example `src/app/[locale]/features/capture/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { ProductPage } from '@/components/product/ProductPage'
import { buildCapturePage } from '@/components/product/features.config'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params
	const dict = await getDictionary(locale)
	return buildPageMetadata({ path: '/features/capture', locale, title: dict['features.capture.title'], description: dict['features.capture.meta.desc'] })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params
	const dict = await getDictionary(locale)
	return <ProductPage {...buildCapturePage(dict, locale)} />
}
```
The hub (`features/page.tsx`) uses `buildFeaturesHub` (title `features.hub.title`, path `/features`, a slab per feature area linking-by-copy, hero `dashboard`). `organize`, `editor`, `platform` mirror the capture file with their builder + path + title/desc keys.

- [ ] **Step 5: Verify in browser.** `pnpm dev`; navigate `/features`, `/features/capture`, `/features/organize`, `/features/editor`, `/features/platform`. Confirm screenshots render, no console errors, dropdown links resolve. Screenshot `/features/capture` as proof.

- [ ] **Step 6: Typecheck + lint + build**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/product/features.config.ts "src/app/[locale]/features" src/i18n/dictionaries/en.ts src/i18n/dictionaries/fr.ts
git commit -m "feat: add features hub and four feature pages"
```

---

### Task 8: Use-case pages (hub + 4) with config, copy, and routes

**Files:**
- Create: `src/components/product/usecases.config.ts`
- Create: `src/app/[locale]/use-cases/page.tsx`
- Create: `src/app/[locale]/use-cases/consultants/page.tsx`
- Create: `src/app/[locale]/use-cases/sales-teams/page.tsx`
- Create: `src/app/[locale]/use-cases/founders/page.tsx`
- Create: `src/app/[locale]/use-cases/students/page.tsx`
- Modify: `src/i18n/dictionaries/en.ts` + `fr.ts` (use-case keys)

**Interfaces:**
- Consumes: `ProductPage`, `slab` helper pattern from Task 7, the already-rendered screenshots.
- Produces: `buildConsultantsPage`, `buildSalesPage`, `buildFoundersPage`, `buildStudentsPage`, `buildUseCasesHub`.

Content source: persona job-stories. Each page reuses existing screenshots (no new assets). Structure per persona: hero → 3 slabs (the job → the workflow → the payoff), each pointing at a relevant screen.

- [ ] **Step 1: Add use-case dictionary keys to `en.ts`.** Consultants exemplar (full copy); the other three personas mirror the key shape with their own copy:

```ts
	'usecases.hub.meta.desc': 'How consultants, sales teams, founders, and students use Echo Scribe.',
	'usecases.hub.eyebrow': 'Use cases',
	'usecases.hub.title': 'Built for the way you actually work.',
	'usecases.hub.subtitle': 'Pick your world — Echo Scribe captures the meeting, finds the answer, and hands you the follow-up.',
	'usecases.consultants.meta.desc': 'Billable client meetings, captured, summarized, and tagged to the right project — automatically.',
	'usecases.consultants.eyebrow': 'For Consultants',
	'usecases.consultants.title': 'Every client call, on the record and in order.',
	'usecases.consultants.subtitle': 'Stop scribbling during calls. Echo Scribe records the meeting, extracts the tasks, and files it under the right client.',
	'usecases.consultants.slab1.eyebrow': 'The problem',
	'usecases.consultants.slab1.title': 'You can’t bill and take notes at once.',
	'usecases.consultants.slab1.desc': 'Meetings auto-record with both sides of the audio, so you stay present with the client and keep a perfect record.',
	'usecases.consultants.slab1.step1.title': 'Auto-record', 'usecases.consultants.slab1.step1.desc': 'Starts on its own when the call begins.',
	'usecases.consultants.slab1.step2.title': 'Both sides', 'usecases.consultants.slab1.step2.desc': 'System + mic captures everyone.',
	'usecases.consultants.slab1.step3.title': 'Stay present', 'usecases.consultants.slab1.step3.desc': 'No note-taking during the call.',
	'usecases.consultants.slab2.eyebrow': 'The workflow',
	'usecases.consultants.slab2.title': 'Ask across every engagement.',
	'usecases.consultants.slab2.desc': 'Search transcripts by question — “what did Acme ask for?” — answered on-device from your own history.',
	'usecases.consultants.slab2.step1.title': 'Semantic search', 'usecases.consultants.slab2.step1.desc': 'Find the answer, not just keywords.',
	'usecases.consultants.slab2.step2.title': 'Private', 'usecases.consultants.slab2.step2.desc': 'Client data never leaves your Mac.',
	'usecases.consultants.slab2.step3.title': 'Instant recall', 'usecases.consultants.slab2.step3.desc': 'Months of calls, one query.',
	'usecases.consultants.slab3.eyebrow': 'The payoff',
	'usecases.consultants.slab3.title': 'Follow-ups write themselves.',
	'usecases.consultants.slab3.desc': 'Tasks are extracted and auto-tagged to the right project, so nothing falls through after the call.',
	'usecases.consultants.slab3.step1.title': 'Extracted tasks', 'usecases.consultants.slab3.step1.desc': 'Action items pulled automatically.',
	'usecases.consultants.slab3.step2.title': 'Auto-tagged', 'usecases.consultants.slab3.step2.desc': 'Filed under the right client.',
	'usecases.consultants.slab3.step3.title': 'Nothing dropped', 'usecases.consultants.slab3.step3.desc': 'Every commitment tracked.',
```
Sales (`usecases.sales.*`): discovery calls → CRM-ready notes → searchable call history. Shots: `meeting-hud`, `meetings`, `chat`.
Founders (`usecases.founders.*`): wear every hat → screen-record demos + dictate → daily rollup. Shots: `screen-recorder`, `dictation`, `daily-summary`.
Students (`usecases.students.*`): lecture capture → searchable study transcripts → guides/templates. Shots: `meeting-hud`, `chat`, `projects`.
(No new `shot.*.alt` keys needed — reuse those added in Task 7.)

- [ ] **Step 2: Add the same use-case keys to `fr.ts`** (French translations). Typecheck gates completeness.

- [ ] **Step 3: Create `usecases.config.ts`** using the same `slab` helper approach as Task 7 (import it or replicate the small helper). Each builder wires the persona's 3 slabs to the reused screenshots.

- [ ] **Step 4: Create the 5 use-case route files** — same thin pattern as Task 7 Step 4, with paths `/use-cases`, `/use-cases/consultants`, `/use-cases/sales-teams`, `/use-cases/founders`, `/use-cases/students` and the matching title/desc keys.

- [ ] **Step 5: Verify in browser.** Navigate each use-case route; confirm screenshots render and CTA appears; screenshot `/use-cases/consultants` as proof; console clean.

- [ ] **Step 6: Typecheck + lint**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/product/usecases.config.ts "src/app/[locale]/use-cases" src/i18n/dictionaries/en.ts src/i18n/dictionaries/fr.ts
git commit -m "feat: add use-cases hub and four persona pages"
```

---

### Task 9: SEO plumbing + full verification

**Files:**
- Modify: `src/lib/sitemap-shared.ts` (`STATIC_PAGES`)

**Interfaces:**
- Consumes: nothing new.
- Produces: sitemap entries for all 10 new routes.

- [ ] **Step 1: Add the 10 routes to `STATIC_PAGES`** in `src/lib/sitemap-shared.ts`:

```ts
export const STATIC_PAGES = [
	'',
	'/features',
	'/features/capture',
	'/features/organize',
	'/features/editor',
	'/features/platform',
	'/use-cases',
	'/use-cases/consultants',
	'/use-cases/sales-teams',
	'/use-cases/founders',
	'/use-cases/students',
	'/blog',
	'/blog/authors',
	'/contact',
	'/privacy',
	'/legal',
	'/cookies',
]
```

- [ ] **Step 2: Full production build**

Run: `pnpm build`
Expected: PASS; build output lists all 10 new routes as generated pages.

- [ ] **Step 3: Verify sitemap includes new URLs.** `pnpm dev`; in the Browser pane navigate `http://localhost:3000/sitemap/0.xml` (static-pages shard). Confirm the 10 new URLs appear as bare default-locale URLs (and `/fr/...` alternates if multi-lang is enabled).

- [ ] **Step 4: Verify canonical + no-hardcoded-links.** Run the unit tests:

Run: `pnpm test` (or the project's test command) — the `no-hardcoded-locale-links` unit test must pass. If no `test` script, confirm via `pnpm build` (the test runs in CI/build per CLAUDE.md) and manually grep: `grep -rn '/${locale}' src/app src/components` returns nothing new.

- [ ] **Step 5: Full lint + typecheck sweep**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/sitemap-shared.ts
git commit -m "feat: register features and use-cases routes in sitemap"
```

---

## Self-Review Notes

- **Spec coverage:** IA/routing → Tasks 1,7,8,9; two dropdowns → Task 2; mobile → Task 3; screenshot pipeline → Tasks 4,5; shared template → Task 6; SEO/i18n → Tasks 1,7,8,9; verification → Task 9. All spec sections mapped.
- **Copy authoring:** marketing strings are content (data), authored to the user-supplied taxonomy/personas. Capture + Consultants pages are written out verbatim as exemplars; the remaining pages specify exact key shape + content brief + which screenshot each slab uses. `pnpm typecheck` is the hard gate that no key is missing from en/fr.
- **Type consistency:** `Shot`/`Slab`/`ProductPageProps` defined in Task 6, consumed unchanged in 7/8. `slab()` helper signature is stable. `NavGroup` from Task 1 consumed in Tasks 2,3.
- **Known risk:** dynamic dictionary indexing (`as keyof Dictionary`) — if strict TS rejects it, fall back to explicit per-slab keys (noted in Task 7 Step 3).
