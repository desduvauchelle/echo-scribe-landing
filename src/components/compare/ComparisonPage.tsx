import Link from 'next/link'
import type { Dictionary } from '@/i18n'
import { localizedPath } from '@/lib/i18n-utils'
import { CompareInstall } from '@/components/compare/CompareInstall'
import { ScreenshotFrame } from '@/components/product/ScreenshotFrame'
import { comparisons, type Comparison } from './comparisons'

export function ComparisonLinks({ current }: { current?: string }) {
	return <nav aria-label="Compare Tucky" className="flex flex-wrap gap-x-6 gap-y-3">
		{comparisons.filter(({ slug }) => slug !== current).map(({ slug, name }) => <Link key={slug} href={localizedPath(`/compare/${slug}`, 'en')} className="underline decoration-base-content/30 underline-offset-4 hover:text-primary">Tucky vs {name} →</Link>)}
	</nav>
}

export function ComparisonPage({ comparison: c, dict }: { comparison: Comparison; dict: Dictionary }) {
	return <>
		<section className="bg-base-200 px-5 py-14 sm:px-8 md:py-20">
			<div className="mx-auto max-w-6xl">
				<Link href={localizedPath('/compare', 'en')} className="text-sm underline underline-offset-4">All comparisons</Link>
				<div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
					<div>
						<p className="mb-5 text-sm font-semibold uppercase tracking-widest text-primary">Tucky vs {c.name}</p>
						<h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{c.headline}</h1>
						<p className="mt-6 max-w-2xl text-lg leading-relaxed text-base-content/80">{c.intro}</p>
						<div className="mt-8 flex flex-wrap items-center gap-5">
							<a href="#install" className="btn btn-primary">Get Tucky free for Mac</a>
							<a href="#comparison" className="font-medium underline underline-offset-4">Compare features ↓</a>
						</div>
						<p className="mt-4 text-sm text-base-content/70">Apple Silicon · macOS 14+ · No account required</p>
					</div>
					<aside className="border-l-2 border-primary/35 pl-7 lg:mt-10">
						<p className="text-3xl font-bold leading-snug tracking-tight sm:text-4xl">Private.<br />Local.<br />Free.</p>
						<p className="mt-5 max-w-xs leading-relaxed text-base-content/80">Your core transcription and AI run on your Mac. No subscription. No per-minute bill.</p>
						<p className="mt-4 max-w-xs text-sm leading-relaxed text-base-content/70">Download models once to use core features offline. Optional uploads and connected services share the data you send.</p>
					</aside>
				</div>
			</div>
		</section>
		<section id="comparison" className="scroll-mt-24 px-5 py-16 sm:px-8 md:py-24">
			<div className="mx-auto max-w-6xl">
				<h2 className="text-3xl font-bold tracking-tight">Tucky vs {c.name}: at a glance</h2>
				<p id="comparison-note" className="mt-3 mb-8 max-w-3xl leading-relaxed text-base-content/70">Compare the workflow you need, where your data goes, and what the free plan includes. Reviewed September 4, 2026; plans and features can change.</p>
				<div className="overflow-hidden rounded-2xl border border-base-content/15">
					<table aria-describedby="comparison-note" className="w-full table-fixed text-left text-sm leading-relaxed sm:text-base">
						<caption className="sr-only">Feature comparison of Tucky and {c.name}</caption>
						<thead><tr className="border-b border-base-content/15"><th scope="col" className="w-[30%] p-3 sm:p-5">Feature</th><th scope="col" className="w-[35%] bg-primary/10 p-3 text-primary sm:p-5">Tucky</th><th scope="col" className="p-3 sm:p-5">{c.name}</th></tr></thead>
						<tbody>{c.rows.map(([feature, tucky, competitor]) => <tr key={feature} className="border-b border-base-content/10 last:border-0"><th scope="row" className="p-3 align-top font-medium [overflow-wrap:anywhere] sm:p-5">{feature}</th><td className="bg-primary/5 p-3 align-top [overflow-wrap:anywhere] sm:p-5">{tucky}</td><td className="p-3 align-top text-base-content/80 [overflow-wrap:anywhere] sm:p-5">{competitor}</td></tr>)}</tbody>
					</table>
				</div>
				{c.note && <p className="mt-5 max-w-4xl text-sm leading-relaxed text-base-content/70">{c.note}</p>}
				<p className="mt-4 text-sm text-base-content/70">Tucky’s local workloads depend on your Mac’s storage and processing capacity. Optional external services may have their own fees.</p>
			</div>
		</section>
		<section className="bg-base-200 px-5 py-16 sm:px-8">
			<div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
				<div><p className="mb-4 font-semibold text-primary">More of your work, in one place</p><h2 className="text-3xl font-bold tracking-tight">From a conversation<br />to something you can use.</h2><p className="mt-5 leading-relaxed text-base-content/80">Record meetings, review summaries, and ask local chat about your saved history. Dictate a note or task when an idea arrives. Keep the context on your Mac.</p><Link href={localizedPath('/features/capture', 'en')} className="mt-6 inline-block font-medium underline underline-offset-4">Explore Tucky’s capture features →</Link></div>
				<ScreenshotFrame shot={{ src: '/screenshots/recorded/meeting-summary.png', alt: 'Meeting summary and recording controls in the app', caption: 'Meeting summary from the app, previously named Echo Scribe.' }} />
			</div>
		</section>
		<section className="px-5 py-16 sm:px-8 md:py-24">
			<div className="mx-auto max-w-6xl">
				<h2 className="mb-8 text-3xl font-bold tracking-tight">Which fits your day?</h2>
				<div className="grid gap-8 md:grid-cols-2">
					<div className="border-t-2 border-primary pt-6"><h3 className="text-xl font-semibold">Choose Tucky if…</h3><p className="mt-3 leading-relaxed text-base-content/80">You work on an Apple Silicon Mac and want private, local dictation and meeting tools with free core features. You prefer keeping your history on your own device.</p></div>
					<div className="border-t-2 border-base-content/25 pt-6"><h3 className="text-xl font-semibold">Consider {c.name} if…</h3><p className="mt-3 leading-relaxed text-base-content/80">{c.bestFor}</p></div>
				</div>
				<details className="mt-12 rounded-xl border border-base-content/15 p-5"><summary className="cursor-pointer font-semibold">Sources and comparison notes</summary><div className="mt-4 space-y-3 text-sm leading-relaxed"><p>Prepared by Tucky using published product documentation, not a controlled accuracy or speed benchmark.</p><ul className="list-disc space-y-2 pl-5">{c.sources.map(({ label, url }) => <li key={url}><a href={url} className="underline underline-offset-4">{label}</a></li>)}<li><Link href={localizedPath('/features/platform', 'en')} className="underline underline-offset-4">Tucky’s local processing and platform requirements</Link></li></ul></div></details>
				<div className="mt-12"><h3 className="mb-5 text-xl font-semibold">Keep comparing</h3><ComparisonLinks current={c.slug} /></div>
			</div>
		</section>
		<CompareInstall dict={dict} />
	</>
}
