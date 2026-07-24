import { NextResponse } from 'next/server'

// Direct-download resolver. GitHub release asset filenames carry the version
// (e.g. `Echo.Scribe_0.1.2_x64-setup.exe`), so a hardcoded asset URL breaks on
// every release. Instead we ask the GitHub API for the latest release at request
// time and 302 the browser straight at the matching asset — always current, no
// GitHub page, no picking. Falls back to the releases page if anything fails.

const GITHUB_REPO = 'desduvauchelle/echo-scribe'
const LATEST_RELEASE_API = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`
const RELEASES_PAGE = `https://github.com/${GITHUB_REPO}/releases/latest`

// Cache the resolved redirect for an hour: new releases propagate within an hour
// and GitHub's unauthenticated API rate limit (60/h) is never a concern.
export const revalidate = 3600

type GithubAsset = { name: string; browser_download_url: string }

// Match an asset filename to a platform, ignoring version/arch noise in the name.
const PLATFORM_MATCHERS: Record<string, (name: string) => boolean> = {
	windows: (name) => name.endsWith('.exe') || name.endsWith('.msi'),
	mac: (name) => name.endsWith('.dmg') || name.endsWith('.tar.gz'),
}

export async function GET(_req: Request, { params }: { params: Promise<{ platform: string }> }) {
	const { platform } = await params
	const matcher = PLATFORM_MATCHERS[platform]
	if (!matcher) return NextResponse.redirect(RELEASES_PAGE, 302)

	try {
		const res = await fetch(LATEST_RELEASE_API, {
			headers: {
				Accept: 'application/vnd.github+json',
				'User-Agent': 'echo-scribe-landing',
			},
			next: { revalidate },
		})
		if (!res.ok) throw new Error(`GitHub API responded ${res.status}`)

		const release = (await res.json()) as { assets?: GithubAsset[] }
		const asset = release.assets?.find((a) => matcher(a.name))
		if (!asset) throw new Error(`No ${platform} asset in latest release`)

		return NextResponse.redirect(asset.browser_download_url, 302)
	} catch {
		// GitHub unreachable or no matching asset — send them to the releases page.
		return NextResponse.redirect(RELEASES_PAGE, 302)
	}
}
