import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('robots', () => {
	const originalEnv = process.env

	beforeEach(() => {
		vi.resetModules()
		process.env = { ...originalEnv }
	})

	afterEach(() => {
		process.env = originalEnv
	})

	async function loadRobots() {
		const mod = await import('./robots')
		return mod.default
	}

	it('returns rules allowing all crawlers on /', async () => {
		const robots = await loadRobots()
		const result = robots()
		const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules
		expect(rules?.userAgent).toBe('*')
		expect(rules?.allow).toBe('/')
	})

	it('disallows /api/ path', async () => {
		const robots = await loadRobots()
		const result = robots()
		const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules
		expect(rules?.disallow).toContain('/api/')
	})

	describe('AI crawler group', () => {
		async function loadAiGroup() {
			const robots = await loadRobots()
			const result = robots()
			const rules = Array.isArray(result.rules) ? result.rules : [result.rules]
			const group = rules.find((rule) => Array.isArray(rule?.userAgent))
			return { group, rules }
		}

		it('explicitly allows the major AI crawlers', async () => {
			const { group } = await loadAiGroup()
			expect(group).toBeDefined()
			const agents = group?.userAgent as string[]
			// Retrieval/citation bots — these drive referral traffic.
			expect(agents).toContain('OAI-SearchBot')
			expect(agents).toContain('ChatGPT-User')
			expect(agents).toContain('Claude-User')
			expect(agents).toContain('PerplexityBot')
			// Training/index bots.
			expect(agents).toContain('GPTBot')
			expect(agents).toContain('ClaudeBot')
			// robots.txt-only tokens — no live user-agent exists to test against,
			// so naming them here is the ONLY way to declare the posture.
			expect(agents).toContain('Google-Extended')
			expect(agents).toContain('Applebot-Extended')
			expect(group?.allow).toBe('/')
		})

		it('mirrors the /api/ disallow into the AI group', async () => {
			// robots.txt is most-specific-group-wins, not merge: a crawler named in
			// the AI group ignores the `*` group entirely. If this disallow is ever
			// dropped, every AI crawler silently gains access to /api/.
			const { group } = await loadAiGroup()
			expect(group?.disallow).toContain('/api/')
		})

		it('keeps the wildcard group so unnamed crawlers are still allowed', async () => {
			const { rules } = await loadAiGroup()
			const wildcard = rules.find((rule) => rule?.userAgent === '*')
			expect(wildcard?.allow).toBe('/')
			expect(wildcard?.disallow).toContain('/api/')
		})

		it('never disallows / for any group', async () => {
			// Guards against a tightening edit that blocks the whole site.
			const { rules } = await loadAiGroup()
			for (const rule of rules) {
				const disallow = Array.isArray(rule?.disallow)
					? rule.disallow
					: rule?.disallow
						? [rule.disallow]
						: []
				expect(disallow).not.toContain('/')
			}
		})
	})

	it('includes sitemap URL pointing to /sitemap.xml', async () => {
		process.env.SITE_URL = 'https://example.com'
		delete process.env.VERCEL_PROJECT_PRODUCTION_URL
		const robots = await loadRobots()
		const result = robots()
		expect(result.sitemap).toBe('https://example.com/sitemap.xml')
	})

	it('uses VERCEL_PROJECT_PRODUCTION_URL when SITE_URL is absent', async () => {
		delete process.env.SITE_URL
		process.env.VERCEL_PROJECT_PRODUCTION_URL = 'my-app.vercel.app'
		const robots = await loadRobots()
		const result = robots()
		expect(result.sitemap).toBe('https://my-app.vercel.app/sitemap.xml')
	})

	it('defaults to http://localhost:3000 when no URL env vars set', async () => {
		delete process.env.SITE_URL
		delete process.env.VERCEL_PROJECT_PRODUCTION_URL
		const robots = await loadRobots()
		const result = robots()
		expect(result.sitemap).toBe('http://localhost:3000/sitemap.xml')
	})

	it('prefers SITE_URL over VERCEL_PROJECT_PRODUCTION_URL', async () => {
		process.env.SITE_URL = 'https://custom-domain.com'
		process.env.VERCEL_PROJECT_PRODUCTION_URL = 'my-app.vercel.app'
		const robots = await loadRobots()
		const result = robots()
		expect(result.sitemap).toBe('https://custom-domain.com/sitemap.xml')
	})
})
