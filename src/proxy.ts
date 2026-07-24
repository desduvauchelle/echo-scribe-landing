import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isMultiLang, supportedLocales, defaultLocale } from './i18n/config'
import { defaultLocaleRedirectTarget } from './lib/i18n-utils'

// `/opengraph-image` and `/twitter-image` are root-level `next/og` metadata
// routes, and `/download` is a root-level route handler (src/app/download/
// [platform]/route.ts) — none carry a file extension, so the `pathname.includes('.')`
// guard misses them; they must never be rewritten into the `[locale]` tree or they 404.
const SKIP_PREFIXES = ['/_next/', '/sitemap', '/opengraph-image', '/twitter-image', '/download']
const SKIP_PATHS = ['/favicon.ico', '/sitemap.xml', '/robots.txt']

// Permanent 301s for retired URLs that still receive traffic or sit in Google's
// index. Keys are locale-agnostic bare paths; the default locale carries no
// prefix so these match the crawled/bookmarked form directly. Add a new entry
// whenever a page is removed rather than letting it 404.
const PERMANENT_REDIRECTS: Record<string, string> = {
	// Deleted blog post flagged in the SEO audit — send its residual link equity
	// (and any lingering bookmarks) to the blog index.
	'/blog/scale-service-business-without-hiring': '/blog',
}

function getLocaleFromHeaders(request: NextRequest): string {
	const acceptLanguage = request.headers.get('accept-language')
	if (!acceptLanguage) return defaultLocale

	const preferred = acceptLanguage
		.split(',')
		.map((part) => {
			const [lang, q] = part.trim().split(';q=')
			return { lang: lang?.split('-')[0] ?? '', q: q ? parseFloat(q) : 1 }
		})
		.sort((a, b) => b.q - a.q)

	for (const { lang } of preferred) {
		if (supportedLocales.includes(lang)) {
			return lang
		}
	}

	return defaultLocale
}

function detectLocale(request: NextRequest): string {
	// 1. Cookie
	const cookieLocale = request.cookies.get('ge-locale')?.value
	if (cookieLocale && supportedLocales.includes(cookieLocale)) {
		return cookieLocale
	}

	// 2. Query param
	const paramLocale = request.nextUrl.searchParams.get('lang')
	if (paramLocale && supportedLocales.includes(paramLocale)) {
		return paramLocale
	}

	// 3. Accept-Language header
	return getLocaleFromHeaders(request)
}

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	// ─── CORS protection for API routes ─────────────────────────────────
	if (pathname.startsWith('/api/')) {
		const origin = request.headers.get('origin')
		if (origin) {
			const host =
				request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? ''
			try {
				if (new URL(origin).host !== host) {
					return NextResponse.json(
						{ error: 'Cross-origin requests are not allowed' },
						{ status: 403, headers: { Vary: 'Origin' } },
					)
				}
			} catch {
				return NextResponse.json(
					{ error: 'Invalid origin' },
					{ status: 403 },
				)
			}
		}
		return NextResponse.next()
	}

	// Skip static files (images, fonts, media, etc.)
	if (pathname.includes('.')) {
		return NextResponse.next()
	}

	// Skip static routes
	if (
		SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
		SKIP_PATHS.includes(pathname)
	) {
		return NextResponse.next()
	}

	// Retired-URL 301s — run before locale handling so the redirect fires on the
	// bare default-locale path exactly as crawlers/bookmarks request it.
	const redirectTarget = PERMANENT_REDIRECTS[pathname]
	if (redirectTarget) {
		const url = request.nextUrl.clone()
		url.pathname = redirectTarget
		url.search = ''
		return NextResponse.redirect(url, 301)
	}

	const paramLocale = request.nextUrl.searchParams.get('lang')

	// Check if path starts with a supported locale
	const segments = pathname.split('/')
	const firstSegment = segments[1] ?? ''
	const pathnameHasLocale = supportedLocales.includes(firstSegment)

	if (pathnameHasLocale) {
		const locale = firstSegment

		// The default language must never carry a locale segment in the URL.
		// Permanently redirect `/en/foo` → `/foo` (and `/en` → `/`) so the
		// prefixed form collapses into the canonical bare URL instead of serving
		// duplicate content. Secondary locales (`/fr/...`) are left untouched.
		const bareTarget = defaultLocaleRedirectTarget(pathname, defaultLocale)
		if (bareTarget) {
			const url = request.nextUrl.clone()
			url.pathname = bareTarget
			return NextResponse.redirect(url, 301)
		}

		const response = NextResponse.next()
		response.headers.set('x-locale', locale)

		if (paramLocale && supportedLocales.includes(paramLocale)) {
			response.cookies.set('ge-locale', paramLocale, {
				path: '/',
				maxAge: 60 * 60 * 24 * 365,
				sameSite: 'lax',
			})
		}

		return response
	}

	// Single-language mode: always rewrite to /{defaultLocale}/path
	if (!isMultiLang) {
		const url = request.nextUrl.clone()
		url.pathname = `/${defaultLocale}${pathname}`
		const response = NextResponse.rewrite(url)
		response.headers.set('x-locale', defaultLocale)
		return response
	}

	// Path does NOT have a locale prefix
	const locale = detectLocale(request)

	if (locale !== defaultLocale) {
		// Redirect to /{locale}/path
		const url = request.nextUrl.clone()
		url.pathname = `/${locale}${pathname}`
		const response = NextResponse.redirect(url)
		response.headers.set('x-locale', locale)

		if (paramLocale && supportedLocales.includes(paramLocale)) {
			response.cookies.set('ge-locale', paramLocale, {
				path: '/',
				maxAge: 60 * 60 * 24 * 365,
				sameSite: 'lax',
			})
		}

		return response
	}

	// Default locale: rewrite internally to /{defaultLocale}/path
	const url = request.nextUrl.clone()
	url.pathname = `/${defaultLocale}${pathname}`
	const response = NextResponse.rewrite(url)
	response.headers.set('x-locale', defaultLocale)

	if (paramLocale && supportedLocales.includes(paramLocale)) {
		response.cookies.set('ge-locale', paramLocale, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365,
			sameSite: 'lax',
		})
	}

	return response
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff|woff2|ttf|eot|mp4|webm|json|xml|txt)$).*)',
	],
}
