import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// One URL form per page, site-wide: NO trailing slash. `/blog/` 308-redirects
	// to `/blog`, so the slashed variant can never be indexed alongside the bare
	// one. This is Next's default, but it is pinned explicitly because flipping it
	// would redirect every already-indexed URL to a new slashed form AND change
	// what `<link rel="canonical">` emits for the site root — see the `buildUrl`
	// docblock in src/lib/sitemap-shared.ts.
	trailingSlash: false,
	serverExternalPackages: [
		'@growth-engine/sdk-server',
		'@libsql/client',
		'libsql',
		'drizzle-orm',
	],
}

export default nextConfig
