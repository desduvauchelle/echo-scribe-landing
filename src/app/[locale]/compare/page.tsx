import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getDictionary } from '@/i18n'
import { localizedPath } from '@/lib/i18n-utils'
import { comparisons } from '@/components/compare/comparisons'
import { comparisonMetadata } from '@/components/compare/metadata'
import { CompareInstall } from '@/components/compare/CompareInstall'

export function generateMetadata() {
	return comparisonMetadata('/compare', 'Compare Dictation & Meeting Apps', 'Compare Tucky with Superwhisper, Wispr Flow, Granola, Otter, and Fireflies. Private, local dictation and meeting tools with free core features for Mac.')
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params
	if (locale !== 'en') redirect(localizedPath('/compare', 'en'))
	return <>
		<section className="bg-base-200 px-5 py-16 sm:px-8 md:py-24"><div className="mx-auto max-w-6xl">
			<p className="mb-5 text-sm font-semibold uppercase tracking-widest text-primary">Compare Tucky</p>
			<h1 className="max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">Your next voice app.<br /><span className="text-primary">A clearer choice.</span></h1>
			<p className="mt-6 max-w-2xl text-lg leading-relaxed text-base-content/80">Compare dictation and meeting tools side by side. See what each app offers, where your data goes, and what comes free.</p>
			<p className="mt-8 text-2xl font-bold">Private. Local. Free.</p>
			<p className="mt-3 max-w-2xl leading-relaxed text-base-content/70">Tucky’s core transcription and AI run on your Mac. No account or subscription required. Optional sharing uses the services you connect.</p>
		</div></section>
		<div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
			{(['Dictation', 'Meetings'] as const).map((category) => <section key={category} className="mb-14 last:mb-0">
				<h2 className="text-3xl font-bold tracking-tight">{category === 'Dictation' ? 'Speak instead of type' : 'Make more of your meetings'}</h2>
				<p className="mt-3 mb-6 text-base-content/70">{category === 'Dictation' ? 'Compare voice typing, models, and everyday writing.' : 'Compare recording, transcripts, summaries, and shared workspaces.'}</p>
				<div>{comparisons.filter((c) => c.category === category).map((c) => <Link key={c.slug} href={localizedPath(`/compare/${c.slug}`, 'en')} className="group grid gap-3 border-t border-base-content/15 py-7 transition-colors hover:text-primary sm:grid-cols-[1fr_1.4fr_auto] sm:items-center sm:gap-8">
					<h3 className="text-xl font-semibold">Tucky vs {c.name}</h3><p className="leading-relaxed text-base-content/75">{c.headline}</p><span className="font-medium underline underline-offset-4">Compare →</span>
				</Link>)}</div>
			</section>)}
		</div>
		<CompareInstall dict={await getDictionary('en')} />
	</>
}
