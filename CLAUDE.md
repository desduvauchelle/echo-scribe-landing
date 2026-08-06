# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working on this client site.

## Project Overview

This is a Next.js 15 client site built on the Growth Engine platform. It connects to the Brain backend via two SDK packages: `@growth-engine/sdk-client` (browser-safe React hooks) and `@growth-engine/sdk-server` (Node.js route handler). All SDK calls flow through `/api/rs/[...route]` which delegates to `GrowthEngineHandler`.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm pull-forms` | Generate form Zod schemas into `src/generated/forms.ts` |

## Tech Stack

- **Framework**: Next.js 15 (React 19, App Router)
- **Language**: TypeScript strict mode
- **Styling**: Tailwind CSS 4 + DaisyUI 5 component classes
- **Animations**: GSAP 3.12 + ScrollTrigger
- **Validation**: Zod
- **SDK**: `@growth-engine/sdk-client` (browser) + `@growth-engine/sdk-server` (server)

## Code Style

- No semicolons, single quotes, trailing commas
- `import type { ... }` for type-only imports
- Prefix unused vars with `_`
- Use `cn()` from `@/lib/utils` for conditional class names (clsx + twMerge)
- DaisyUI semantic classes (`btn`, `btn-primary`, `card`, `input`, `alert`, `loading`, `navbar`, `hero`, `join`, `form-control`, `label`, `label-text`) over raw Tailwind equivalents for UI elements
- Theme colors via DaisyUI tokens: `base-100`, `base-200`, `base-content`, `primary`, `error`, `success`
- Dark mode via `data-theme="dark"` attribute on `<html>`, toggled by `ThemeToggle` component
- Blog content uses `prose prose-lg` from `@tailwindcss/typography`

## Key Files

| Path | Purpose |
|------|---------|
| `src/app/api/rs/[...route]/route.ts` | SDK route handler — all SDK calls proxy through here |
| `src/app/layout.tsx` | Root layout: `GrowthEngineProvider`, `GoogleAnalytics` |
| `src/app/[locale]/layout.tsx` | Locale layout: passes `dict`/`locale` props to `Header`, `Footer` |
| `src/app/[locale]/page.tsx` | Landing page (Hero, Features, CTA, latest blog posts) |
| `src/app/[locale]/blog/page.tsx` | Blog listing with search + pagination |
| `src/app/[locale]/blog/[slug]/page.tsx` | Blog detail with `getBlogPost()` + local `RelatedPosts` |
| `src/app/[locale]/blog/authors/page.tsx` | Author index page |
| `src/app/[locale]/blog/authors/[slug]/page.tsx` | Author detail with bio + their posts |
| `src/app/[locale]/contact/page.tsx` | "Get Echo Scribe" — install command first, GitHub support second. **No form** (see Adoption path below) |
| `src/app/[locale]/forms/[slug]/page.tsx` | Dynamic form page — renders any form by slug |
| `src/app/[locale]/privacy/page.tsx` | Privacy policy |
| `src/app/[locale]/legal/page.tsx` | Terms of service |
| `src/app/[locale]/cookies/page.tsx` | Cookie policy |
| `src/components/landing/` | Hero, Features, CTA (with scroll reveal animations) |
| `src/components/blog/` | RelatedPosts (local — replaces the SDK's), AllPostsIndex, AuthorByline, AuthorCard, AuthorChips. BlogList/BlogCard/BlogContent/BlogSearch come from the SDK |
| `src/lib/related-posts.ts` | Which posts a post links out to — relevance plus a coverage cycle that prevents orphan pages |
| `src/components/layout/` | Header, Footer, ThemeToggle, LanguageSwitcher |
| `src/components/landing/InstallBox.tsx` | The curl install command + copy button. Fires `install_copy` — the site's primary conversion |
| `src/components/analytics/GoogleAnalytics.tsx` | GA4 script loader + `trackEvent()` helper |
| `src/hooks/useGsap.ts` | `useScrollReveal()` and `useGsap()` hooks, re-exports `gsap` |
| `src/i18n/config.ts` | `defaultLocale`, `supportedLocales`, `isMultiLang` from env vars |
| `src/i18n/index.ts` | `getDictionary()` server function with caching, `Dictionary` and `DictionaryKey` types |
| `src/i18n/dictionaries/{locale}.ts` | Flat key-value translation dictionaries |
| `src/lib/utils.ts` | `cn()` helper (clsx + twMerge) |
| `src/lib/env.ts` | Runtime env var checker (logs missing vars on startup) |
| `src/lib/i18n-utils.ts` | `formatDate(date, locale)`, `localizedPath(path, locale)` + `localePrefix(locale)` — the default-locale-is-bare URL rule for all internal links |
| `src/lib/seo.ts` | `buildPageMetadata({ path, locale, title, … })` — self-referencing canonical + hreflang + OG/Twitter for every page's `generateMetadata` |
| `src/lib/structured-data.ts` | `homeJsonLd` (Organization/WebSite/SoftwareApplication graph) + `breadcrumbLd` — page-level schema.org builders, all URLs via `buildUrl`. Rendered through `src/components/seo/JsonLd.tsx` |
| `src/proxy.ts` | CORS protection for `/api/` + locale detection/routing + 301 redirect of default-locale-prefixed URLs (`/en/…` → `/…`) |
| `src/generated/forms.ts` | Auto-generated form Zod schemas (via `pnpm pull-forms`) |
| `src/app/globals.css` | Tailwind + DaisyUI + typography plugin imports |
| `src/app/sitemap.xml/route.ts` | Sitemap index — points at `/sitemap/{id}.xml` shards |
| `src/app/sitemap/[file]/route.ts` | Sitemap shards: id 0 = static pages, 1..N = blog batches, N+1 = authors |
| `src/lib/sitemap-shared.ts` | Sitemap builders, hreflang grouping, XML serializers (manual route handlers — do NOT add `src/app/sitemap.ts`; Next 16 + `[locale]` segment makes the metadata convention unreliable) |
| `src/app/rss.xml/route.ts` | Blog RSS 2.0 feed. Served with `X-Robots-Tag: noindex` — feeds belong in readers, not the search index. The literal `rss.xml` segment wins over `[locale]`, so `/rss.xml` is the feed (not a phantom locale page). |
| `src/lib/rss-shared.ts` | Pure RSS renderer (`renderRssFeed`) + `FeedPost` shape. Item links use the same `buildUrl('/blog/<slug>', defaultLocale)` as the sitemap/canonical. |
| `src/app/robots.ts` | Robots.txt (allows all, disallows `/api/`) |

## SDK Reference

### sdk-client (browser-safe — only use in `'use client'` components)

| Hook / Function | Signature | Returns |
|---|---|---|
| `useContent` | `useContent('blog', { locale })` | `{ posts, loading, error }` |
| `fetchBlog` | `fetchBlog(slug, locale?)` | `Promise<BlogPost \| null>` — use in `useEffect`, not top level |
| `getBlogUrl` | `getBlogUrl(post)` | URL path string (`/blog/{urlPath or slug}`) |
| `getSocialPosts` | `getSocialPosts(platform)` | `Promise<SocialPost[]>` |
| `useAuthors` | `useAuthors()` | `{ authors, loading, error }` |
| `fetchAuthor` | `fetchAuthor(slug)` | `Promise<BlogAuthor \| null>` |
| `fetchAuthorPosts` | `fetchAuthorPosts(authorSlug, { locale?, limit?, offset? })` | `Promise<BlogPost[]>` |
| `useBusinessConfig` | `useBusinessConfig()` | `{ config, loading, error }` — hours, contact, address, SEO |
| `getHours` | `getHours()` | `Promise<object \| null>` |
| `getContactInfo` | `getContactInfo()` | `Promise<object \| null>` |
| `useForms` | `useForms()` | `{ forms, loading, error }` |
| `useForm` | `useForm(slug)` | `{ form, schema, loading, error }` — schema is a Zod object |
| `submitForm` | `submitForm(slug, data)` | `{ ok, id?, error?, validationErrors? }` |
| `buildFormSchema` | `buildFormSchema(fields)` | `z.ZodObject` from `FormField[]` |
| `pushLead` | `pushLead(data)` | `{ ok, contactId?, existing?, error? }` |
| `triggerBlogGen` | `triggerBlogGen(payload)` | Job response with `jobId` |
| `triggerSocialSync` | `triggerSocialSync(platforms?)` | Job response with `jobId` |
| `useJobStatus` | `useJobStatus(jobId)` | `{ job, loading, error, refresh }` |
| `useSDKStatus` | `useSDKStatus()` | `{ manifest, loading, error }` |
| `onAnalyticsEvent` | `onAnalyticsEvent({ eventType, page?, sessionId? })` | `Promise<void>` |
| `SDK_VERSION` | Constant | Current SDK version string |

### sdk-server (Node.js only — never import in client components)

Used exclusively in `src/app/api/rs/[...route]/route.ts`:

```ts
import { GrowthEngineHandler } from '@growth-engine/sdk-server'
export const { GET, POST } = GrowthEngineHandler({ brainApiUrl, brainApiKey, tursoUrl, tursoAuthToken })
```

This is listed in `serverExternalPackages` in `next.config.ts`.

## i18n

Locale routing uses a `[locale]` segment in all pages under `src/app/[locale]/`.

**How it works:**

- `src/i18n/config.ts` reads `DEFAULT_LANGUAGE` and `ADDITIONAL_LANGUAGES` env vars
- Single-language mode: middleware rewrites all paths to `/{defaultLocale}/...` transparently (no locale in URL)
- Multi-language mode: middleware detects locale from cookie (`ge-locale`) → `?lang=` param → `Accept-Language` header → default, then redirects to `/{locale}/path`

**Using translations in server components (pages and layouts):**

```tsx
import { getDictionary } from '@/i18n'
const dict = await getDictionary(locale)
dict['hero.title']                                    // simple lookup
dict['blog.load.error'].replace('{error}', msg)       // with variable interpolation ({varName} syntax)
```

**Passing translations to child components:**

```tsx
// In a page or layout (server component):
<Hero dict={dict} locale={locale} />
<Footer dict={dict} locale={locale} />
```

**Server-side (layouts):**

```tsx
import { getDictionary } from '@/i18n'
const dict = await getDictionary(locale)
```

**Adding a language:**

1. Create `src/i18n/dictionaries/{code}.ts` exporting a `Dictionary` object with all keys from `en.ts`
2. Add a `case '{code}':` to the switch in `src/i18n/index.ts` `getDictionary()`
3. Set env: `ADDITIONAL_LANGUAGES=fr,{code}`

**Dictionary key convention:** flat dot-separated keys like `'blog.search.placeholder'`. All keys must exist in every dictionary (type-checked via `DictionaryKey` union from `en.ts`).

## Adoption path (read before adding a form or a "contact us" CTA)

**Echo Scribe is free, needs no account, and installs with one Terminal line. There is nothing to ask us for before using it — so the site has no contact form, by design.**

The scaffold ships a generic "Contact Us" form (slug `contact-form`: name / email / message). It ran on `/contact` and took **0 submissions across 44 sessions**, because it does not match how anyone adopts this product. It was removed on 2026-08-03. `/contact` is now "Get Echo Scribe": the install command first, GitHub support second.

**The conversion metric is `install_copy` and `app_download`, not form submissions.** Both carry a `location` param (`EventLocation` in `GoogleAnalytics.tsx`) so intent can be segmented by page. Mark both as key events in GA4. If you are ever asked why "conversions" are zero, check that the metric is not still pointed at `form_submit`.

Before adding any form here, it must clear one bar: *what does the visitor get that the install command does not already give them?* "Get in touch", "request a demo", and "join the waitlist" all fail that bar for a free, instantly-installable app.

**The form definition is server-authoritative and cannot be changed from this repo.** `submitForm()` re-fetches the form from Brain and validates against the *server's* field list, and `settings.successMessage` from the server overrides `translations.defaultSuccessMessage`. sdk-server exposes only `getFormBySlug`/`getActiveForms` — no create/update. Shrinking or relabelling a form's fields means editing it in the Brain admin UI; overriding `form.fields` in the `FormRenderer` prop changes only what renders, and submission will then fail validation against the untouched server schema.

**Note:** `contact-form` still exists in Brain and is still reachable at `/forms/contact-form` (and listed on `/forms`). Deactivate it in Brain if you want it gone entirely.

## Forms

`/forms/[slug]` — dynamic form page that renders any form by slug. Kept as scaffold infrastructure; nothing links to it.

**Usage pattern:**

```tsx
const { form, schema, loading } = useForm('contact-form')
// form.fields sorted by field.order, schema is a Zod object for validation
const result = await submitForm('contact-form', formData)
// result: { ok: true, id } | { ok: false, error?, validationErrors? }
```

Form fields must be sorted by `field.order` before rendering: `[...form.fields].sort((a, b) => a.order - b.order)`.

Supported field types: `text`, `email`, `tel`, `textarea`, `select`, `checkbox`, `number`, `url`.

Submissions automatically create CRM contacts (if email/name fields present) and trigger email notifications (if `notifyEmails` configured in form settings). Both are best-effort.

Run `pnpm pull-forms` to generate typed Zod schemas in `src/generated/forms.ts` for compile-time safety.

## Blog

- `useContent('blog', { locale })` fetches all published posts for the current locale
- `fetchBlog(slug, locale?)` fetches a single post — use inside `useEffect`, not at component top level
- `BlogList` handles client-side search filtering + pagination (9 posts per page)
- `BlogContent` renders HTML via `dangerouslySetInnerHTML` with `prose prose-lg` classes
- `RelatedPosts` — the LOCAL one ([src/components/blog/RelatedPosts.tsx](src/components/blog/RelatedPosts.tsx)), not the SDK's. See "Internal linking" below before switching back.
- `AllPostsIndex` renders every post as a plain link under the `/blog` grid — the crawlable half of the index
- Blog detail page uses `useParams()` to get `slug` and `locale`

### Internal linking (do not regress this)

Two SDK components quietly starve the blog of internal links, and both are worked around rather than used as shipped:

- **`RelatedPosts` from the SDK links the same three posts from every post** — it is `posts.filter(p => p.slug !== currentSlug).slice(0, 3)`. Measured at 31 posts: three posts held 90 of the 93 links and the other 26 held none, so a crawl reported nine posts as orphans (`orphan_page`) and one genuinely was. The local replacement reserves one of the three slots for the post's **successor in canonical order**, which threads a cycle through every post and makes an orphan structurally impossible; the other two rank on keyword/title overlap. Logic and tests: [src/lib/related-posts.ts](src/lib/related-posts.ts).
- **`BlogList` paginates with `<button onClick={setPage}>`, not links.** There is no page-2 URL — `/blog?page=2` serves the same nine posts — so a crawler reading `/blog` sees nine of 31. `AllPostsIndex` below the grid is what makes the rest reachable.

If you replace either component, re-check that every published post still has an inbound link from a server-rendered `<a>`. The unit tests cover the selection rule, not the wiring.

## Authors

- `getBlogAuthors(db)` lists all authors; `getBlogAuthor(db, slug)` looks one up by slug; `getBlogAuthorById(db, id)` looks one up by id (used to resolve `post.authorId`).
- `getAuthorPosts(db, slug, { locale, limit })` returns published posts for an author in a given locale.
- The blog list page (`/blog`) renders `<AuthorChips />` above the post grid; each chip links to `/blog/authors/{slug}`.
- The blog detail page (`/blog/{slug}`) renders `<AuthorByline />` between the date and the content, and passes the author into `<BlogContent />` for `Person` JSON-LD.
- v1 limitation: `BlogAuthor.bio` is locale-agnostic. UI chrome translates; bio text does not.

## GSAP Animations

Two hooks in `src/hooks/useGsap.ts`:

**`useScrollReveal(options?)`** — attach ref to element, it animates in on scroll:

```tsx
const ref = useScrollReveal<HTMLDivElement>({ y: 40, stagger: 0.15 })
<div ref={ref}>...</div>
```

Options (defaults): `y` (40), `x` (0), `opacity` (0), `duration` (0.8), `delay` (0), `stagger` (none — set to animate children), `start` ('top 85%'), `ease` ('power2.out').

**`useGsap(callback, scope, deps)`** — full GSAP control with auto-cleanup:

```tsx
const container = useRef<HTMLDivElement>(null)
useGsap(() => {
  gsap.from('.card', { opacity: 0, y: 40, stagger: 0.1 })
}, container, [])
```

Import `gsap` and `ScrollTrigger` from `@/hooks/useGsap` (re-exported with plugin registered).

## Analytics

GA4 via `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var. No scripts loaded when unset.

```tsx
import { trackEvent } from '@/components/analytics/GoogleAnalytics'
trackEvent('install_copy', { method: 'curl', platform: 'macos', location: 'hero' })  // no-op when GA not configured
```

Events: `install_copy` and `app_download` are the conversions — mark both as key events in GA4. `install_cta_click` and `cta_click` are intent only (they scroll to the install section). Every one takes a `location` param from the `EventLocation` union.

## Environment Variables

| Variable | Required | Scope | Purpose |
|----------|----------|-------|---------|
| `BRAIN_API_URL` | Yes | Server | Brain instance URL |
| `BRAIN_API_KEY` | Yes | Server | API key (`brain_live_...` or `brain_test_...`) |
| `TURSO_DATABASE_URL` | Yes | Server | Client Turso SQLite URL |
| `TURSO_AUTH_TOKEN` | Yes | Server | Turso auth token |
| `SITE_URL` | No | Server | Base URL for sitemap/robots (falls back to Vercel URL) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Client | GA4 measurement ID (`G-XXXXXXXXXX`) |
| `DEFAULT_LANGUAGE` | No | Server | Default locale (default: `en`) |
| `ADDITIONAL_LANGUAGES` | No | Server | Comma-separated locales (e.g. `fr,es,de`) |

The four required vars are server-only. Never prefix them with `NEXT_PUBLIC_`.

## Gotchas

- **sdk-client is browser-only.** Only import `@growth-engine/sdk-client` in `'use client'` components. It uses React hooks internally.
- **sdk-server is server-only.** Listed in `serverExternalPackages` in `next.config.ts`. Never import it in client components.
- **All pages are under `[locale]`.** Even in single-language mode, the file structure uses `src/app/[locale]/`. Middleware handles the rewrite so URLs don't show the locale prefix.
- **`params` is a Promise in Next.js 15.** Always `const { locale } = await params` in layouts and pages.
- **`fetchBlog` is not a hook.** Use it inside `useEffect`, not at component top level. It returns a `Promise<BlogPost | null>`.
- **Form field order matters.** Always sort by `field.order` before rendering: `[...form.fields].sort((a, b) => a.order - b.order)`.
- **DaisyUI 5 class names.** Use DaisyUI component classes (`btn`, `card`, `input`, `alert`, `navbar`, `hero`, `join`, `loading`, `form-control`, `label`, `label-text`), not raw Tailwind equivalents, for UI elements.
- **Tailwind v4 CSS syntax.** `globals.css` uses `@import 'tailwindcss'` and `@plugin 'daisyui'` — not `@tailwind base/components/utilities`.
- **`cn()` for class merging.** Use `cn()` from `@/lib/utils` instead of raw string concatenation when combining conditional classes.
- **Theme uses `data-theme` attribute**, not CSS `prefers-color-scheme`. Toggle is in `ThemeToggle` component, persisted in `localStorage`.

## Common Patterns

**New page:** Create `src/app/[locale]/your-page/page.tsx` as an async server component. Use `getDictionary(locale)` for translations. Add dictionary keys to all locale files. **Always** export a `generateMetadata` that returns `buildPageMetadata({ path, locale, title, description })` (see SEO below) — this gives the page a self-referencing canonical and a unique title.

**New component:** Place in `src/components/{category}/`. Use DaisyUI classes. Accept props — let pages fetch via SDK hooks and pass data down.

**Links between pages:** ALWAYS build hrefs with `localizedPath(path, locale)` from `@/lib/i18n-utils` — e.g. `` <Link href={localizedPath('/blog', locale)}> ``. NEVER hand-write `` `/${locale}/blog` ``. See the SEO section for why.

**Loading states:** Use DaisyUI spinner: `<span className="loading loading-spinner loading-lg" />`

**Error states:** Use DaisyUI alert: `<div className="alert alert-error"><span>{error}</span></div>`

## SEO & URLs (read before adding any page or link)

**The one rule: the default language lives at the site root with NO locale segment; secondary languages are prefixed.** `DEFAULT_LANGUAGE` (default `en`) → `/blog/my-post`. `ADDITIONAL_LANGUAGES` (e.g. `fr`) → `/fr/blog/my-post`. There is no `/en/...`.

**Why this matters (the bug this prevents):** if internal links point at one URL form (`/en/blog/x`) while the `<link rel="canonical">` and `sitemap.xml` point at another (`/blog/x`), Google sees the "canonical" URL has zero internal links, assigns it near-zero crawl priority, and leaves pages in *"Discovered – currently not indexed."* All three signals — internal links, canonical, sitemap — MUST point at the same URL.

**How the template keeps them aligned — never break these:**

- **Links:** build every href with `localizedPath(path, locale)` ([src/lib/i18n-utils.ts](src/lib/i18n-utils.ts)). For SDK blog/form components (`BlogCard`, `BlogList`, `FormCard`), pass `localePrefix={localePrefix(locale)}`. The local `RelatedPosts` and `AllPostsIndex` derive it from `locale` themselves. Never hand-write `` `/${locale}/...` `` — a unit test ([src/lib/no-hardcoded-locale-links.unit.test.ts](src/lib/no-hardcoded-locale-links.unit.test.ts)) fails the build if you do.
- **Canonical + title:** every page's `generateMetadata` returns `buildPageMetadata({ path, locale, title, description })` ([src/lib/seo.ts](src/lib/seo.ts)). It emits a self-referencing canonical (`buildUrl(path, locale)`), unique branded title, hreflang `alternates.languages` (+ `x-default`) in multi-lang mode, and OpenGraph/Twitter tags. The path is the **locale-agnostic** path (`''`, `/blog`, `/blog/${slug}`).
- **Sitemap:** generated from the same `buildUrl` in [src/lib/sitemap-shared.ts](src/lib/sitemap-shared.ts) — already bare for the default locale. Add any new static route to `STATIC_PAGES`.
- **Redirect:** [src/proxy.ts](src/proxy.ts) 301-redirects any default-locale-prefixed URL (`/en/...` → `/...`, `/en` → `/`) so the prefixed form can't become an indexable duplicate. Secondary locales (`/fr/...`) are served as-is.
- **Host:** `SITE_URL` must be the single canonical host (pick www-or-apex, configure the apex→www 301 in Vercel domains). `metadataBase` in [src/app/layout.tsx](src/app/layout.tsx) makes all absolute asset/OG URLs use it.
- **Structured data:** page-level schema.org lives in [src/lib/structured-data.ts](src/lib/structured-data.ts), rendered via `<JsonLd />` ([src/components/seo/JsonLd.tsx](src/components/seo/JsonLd.tsx)): the homepage emits an Organization/WebSite/SoftwareApplication graph (`homeJsonLd`), and use-case/blog/authors/contact pages emit `BreadcrumbList` (`breadcrumbLd`; use-case pages pass `breadcrumbs` through `ProductPageProps`). Every URL in every node goes through `buildUrl` so JSON-LD matches canonical/sitemap URL forms — locked by [src/lib/structured-data.unit.test.ts](src/lib/structured-data.unit.test.ts). Blog posts get `BlogPosting` JSON-LD via `<BlogContent canonicalUrl={buildUrl(...)} />`; features + /loops + the use-cases hub emit `FAQPage`. The `BusinessJsonLd` in [src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx) renders ONLY when the Brain business config has a `name` — it is currently empty, so it emits nothing (which is why the 2026-08 crawl flagged `missing_structured_data` despite the layout wiring). Never fabricate `aggregateRating`/`review` markup.
- **Locale guard (do NOT remove):** the `[locale]` segment matches ANY first path segment, so bogus requests (`/rss.xml/legal`, `/index.iml/...` from bot probes or stale links on a prior site) would otherwise render a real page at HTTP 200 with a self-referencing canonical to the garbage URL — the GSC *"Duplicate without user-selected canonical"* bug. [src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx) calls `notFound()` for any segment that isn't a configured locale (`isSupportedLocale` in [src/i18n/config.ts](src/i18n/config.ts)), so phantom URLs return 404 and Google drops them. Covered by [src/i18n/config.unit.test.ts](src/i18n/config.unit.test.ts) + the scaffold integration test's bogus-segment 404 cases.
- **RSS feed is `noindex`:** the blog feed at `/rss.xml` ([src/app/rss.xml/route.ts](src/app/rss.xml/route.ts)) is served with an `X-Robots-Tag: noindex` header so it (and any `/rss.xml/...` URLs crawlers derive from it) stays out of Google's index — feeds are for readers, not search. Pages advertise it via a site-wide `<link rel="alternate" type="application/rss+xml">` (added in `buildPageMetadata`'s `alternates.types`). If you ever add a second feed (Atom, per-locale), serve it `noindex` too.
- **AI crawlers are explicitly allowed:** [src/app/robots.ts](src/app/robots.ts) emits two groups — the `*` group, and a named `AI_CRAWLERS` group (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, CCBot, …) that declares the allow-posture rather than leaving it incidental. Being cited by ChatGPT/Claude/Perplexity is a primary discovery channel for this product. `Google-Extended` and `Applebot-Extended` are robots.txt-**only** tokens with no live user-agent — naming them here is the only way to declare their posture, and you cannot test them with a request. **The footgun: robots.txt is most-specific-group-wins, NOT merge.** A crawler named in the AI group obeys *only* that group and ignores `*` entirely, which is why the AI group repeats `Disallow: /api/`. Drop that line and every AI crawler gains `/api/`. [src/app/robots.unit.test.ts](src/app/robots.unit.test.ts) locks this invariant.

**Checklist when adding a page:** ① links via `localizedPath` ② `generateMetadata` → `buildPageMetadata` with the locale-agnostic path ③ add to `STATIC_PAGES` if it's a static route ④ unique title/description. If it should NOT be indexed (demo/preview), add `robots: { index: false }` to its metadata.
