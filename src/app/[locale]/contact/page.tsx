import type { Metadata } from 'next'
import { getDictionary } from '@/i18n'
import type { Dictionary, DictionaryKey } from '@/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { Eyebrow } from '@/components/landing/Eyebrow'
import { ScrollReveal } from '@/components/landing/ScrollReveal'
import { InstallBox } from '@/components/landing/InstallBox'
import { TrackedLink } from '@/components/analytics/TrackedLink'

const GITHUB_URL = 'https://github.com/desduvauchelle/echo-scribe'

// Resolves to the latest release's Windows installer at request time (see
// src/app/download/[platform]/route.ts) so the link never breaks on a new version.
const WINDOWS_DOWNLOAD_URL = '/download/windows'

/**
 * Echo Scribe is free, needs no account, and installs with one Terminal line —
 * so there is nothing to "get in touch" about before using it. This page is the
 * adoption path, not a contact form: install command first, support second.
 *
 * The route stays `/contact` because it is already indexed, sitemapped, and
 * referenced from the legal pages. The header links `/contact#support` so a
 * visitor who clicks "Support" lands on the help section rather than the install.
 */
const HELP_LINKS: { href: string; title: DictionaryKey; desc: DictionaryKey; cta: DictionaryKey }[] = [
	{
		href: `${GITHUB_URL}/issues`,
		title: 'support.help.issues.title',
		desc: 'support.help.issues.desc',
		cta: 'support.help.issues.cta',
	},
	{
		href: `${GITHUB_URL}/releases`,
		title: 'support.help.releases.title',
		desc: 'support.help.releases.desc',
		cta: 'support.help.releases.cta',
	},
	{
		href: GITHUB_URL,
		title: 'support.help.source.title',
		desc: 'support.help.source.desc',
		cta: 'support.help.source.cta',
	},
]

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params
	const dict = await getDictionary(locale)
	return buildPageMetadata({
		path: '/contact',
		locale,
		title: dict['support.heading'],
		description: dict['support.meta.description'],
	})
}

export default async function GetEchoScribePage({
	params,
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const dict: Dictionary = await getDictionary(locale)

	const requirements = [
		dict['cta.meta.macos'],
		dict['cta.meta.chips'],
		dict['cta.meta.update'],
		dict['cta.meta.models'],
	]

	return (
		<main>
			{/* Install — the actual conversion. Copying the command is as far as
			    the site can take someone; `install_copy` fires on that click. */}
			<section className="border-b border-base-content/10 bg-base-100 py-20 text-center">
				<div className="container mx-auto max-w-[1080px] px-6">
					<ScrollReveal y={30}>
						<Eyebrow className="mb-5">{dict['support.eyebrow']}</Eyebrow>

						<h1 className="mb-3.5 text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-0.03em]">
							{dict['support.heading']}
						</h1>
						<p className="mx-auto mb-10 max-w-2xl text-lg text-base-content/70">{dict['support.subtitle']}</p>

						<InstallBox dict={dict} location="contact_page" />

						<div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[13px] text-base-content/50">
							<span>{dict['cta.windows.label']}</span>
							<TrackedLink
								href={WINDOWS_DOWNLOAD_URL}
								eventName="app_download"
								eventParams={{ platform: 'windows', method: 'installer', location: 'contact_page' }}
								prefetch={false}
								className="btn btn-outline btn-sm gap-1.5 rounded-lg font-medium"
							>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M3 5.7 10.2 4.7v6.9H3V5.7Zm0 12.6 7.2 1v-6.8H3v5.8Zm8.1 1.1L21 20.8V12.5h-9.9v6.9Zm0-14.9v7h9.9V3.2l-9.9 1.3Z" />
								</svg>
								{dict['cta.windows.button']}
							</TrackedLink>
						</div>

						<div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[13px] text-base-content/50">
							{requirements.map((item, i) => (
								<span key={item} className="flex items-center gap-5">
									{i > 0 && <span aria-hidden="true">·</span>}
									{item}
								</span>
							))}
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* Support — GitHub is the real channel for a free, no-account app. */}
			<section id="support" className="scroll-mt-20 bg-base-200 py-20">
				<div className="container mx-auto max-w-[1080px] px-6">
					<ScrollReveal y={30}>
						<div className="mb-12 text-center">
							<Eyebrow className="mb-5">{dict['support.help.eyebrow']}</Eyebrow>
							<h2 className="mb-3.5 text-[clamp(24px,3vw,36px)] font-extrabold tracking-[-0.03em]">
								{dict['support.help.heading']}
							</h2>
							<p className="mx-auto max-w-2xl text-base-content/70">{dict['support.help.subtitle']}</p>
						</div>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							{HELP_LINKS.map((link) => (
								<div key={link.href} className="card border border-base-content/10 bg-base-100 p-6">
									<h3 className="mb-2 text-lg font-bold tracking-[-0.01em]">{dict[link.title]}</h3>
									<p className="mb-5 grow text-sm text-base-content/70">{dict[link.desc]}</p>
									<a
										href={link.href}
										target="_blank"
										rel="noreferrer"
										className="btn btn-outline btn-sm w-fit gap-1.5 rounded-lg font-medium"
									>
										{dict[link.cta]}
										<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
											<path d="M7 17 17 7" />
											<path d="M8 7h9v9" />
										</svg>
									</a>
								</div>
							))}
						</div>
					</ScrollReveal>
				</div>
			</section>
		</main>
	)
}
