import type { MetadataRoute } from 'next'

const SITE_URL =
	process.env.SITE_URL ??
	(process.env.VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
		: 'http://localhost:3000')

// AI crawlers we explicitly welcome. The `*` group below already allows them —
// this named group exists so the posture is *declared* rather than incidental:
// an SEO/AEO audit can read the intent, and a future tightening of `*` can't
// silently cut off AI discovery. Being cited by ChatGPT/Claude/Perplexity is a
// primary discovery channel for this product, so all of them stay allowed.
//
// Two of these — `Google-Extended` (Gemini) and `Applebot-Extended` (Apple
// Intelligence) — are robots.txt-only tokens with no live user-agent. They exist
// solely to be named here; you cannot test them with a request.
//
// CRITICAL: robots.txt is most-specific-group-wins, NOT merge. A crawler named
// here obeys ONLY this group and ignores `*` entirely — which is why this group
// repeats `Disallow: /api/`. Drop that line and every AI crawler gains `/api/`.
const AI_CRAWLERS = [
	// OpenAI — training, search index, and user-triggered fetch respectively
	'GPTBot',
	'OAI-SearchBot',
	'ChatGPT-User',
	// Anthropic
	'ClaudeBot',
	'Claude-User',
	'Claude-SearchBot',
	// Perplexity
	'PerplexityBot',
	'Perplexity-User',
	// Google Gemini / Apple Intelligence (robots.txt-only tokens)
	'Google-Extended',
	'Applebot-Extended',
	// Others
	'Amazonbot',
	'CCBot',
	'meta-externalagent',
	'MistralAI-User',
	'DuckAssistBot',
	'Bytespider',
]

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: ['/api/'],
			},
			{
				userAgent: AI_CRAWLERS,
				allow: '/',
				// Must mirror the `*` group — see the most-specific-group-wins note above.
				disallow: ['/api/'],
			},
		],
		sitemap: `${SITE_URL}/sitemap.xml`,
	}
}
