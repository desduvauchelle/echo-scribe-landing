import type { Metadata } from 'next'
import Link from 'next/link'
import { getDictionary } from '@/i18n'
import { buildPageMetadata } from '@/lib/seo'
import { localizedPath } from '@/lib/i18n-utils'
import { Eyebrow } from '@/components/landing/Eyebrow'
import { ScrollReveal } from '@/components/landing/ScrollReveal'
import { CTA } from '@/components/landing/CTA'
import { TrackedLink } from '@/components/analytics/TrackedLink'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params
	const dict = await getDictionary(locale)
	return buildPageMetadata({ path: '/loops', locale, title: dict['loops.meta.title'], description: dict['loops.meta.desc'] })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params
	const dict = await getDictionary(locale)

	const steps = [1, 2, 3, 4] as const
	const faqs = [1, 2, 3].map((n) => ({
		q: dict[`loops.faq${n}.q` as keyof typeof dict],
		a: dict[`loops.faq${n}.a` as keyof typeof dict],
	}))
	const explore = [
		{ href: '/features/capture', label: dict['loops.explore.capture.label'], desc: dict['loops.explore.capture.desc'] },
		{ href: '/features/organize', label: dict['loops.explore.organize.label'], desc: dict['loops.explore.organize.desc'] },
		{ href: '/use-cases', label: dict['loops.explore.usecases.label'], desc: dict['loops.explore.usecases.desc'] },
	]

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'FAQPage',
						mainEntity: faqs.map((f) => ({
							'@type': 'Question',
							name: f.q,
							acceptedAnswer: { '@type': 'Answer', text: f.a },
						})),
					}),
				}}
			/>

			{/* Hero */}
			<section className="border-b border-base-content/10 bg-base-100 py-20">
				<div className="container mx-auto max-w-[1080px] px-6 text-center">
					<ScrollReveal y={30}>
						<Eyebrow className="mb-5">{dict['loops.hero.eyebrow']}</Eyebrow>
						<h1 className="mx-auto mb-5 max-w-[20ch] text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.05] tracking-[-0.03em]">{dict['loops.hero.title']}</h1>
						<p className="mx-auto mb-8 max-w-[54ch] text-[19px] leading-[1.6] text-base-content/70">{dict['loops.hero.subtitle']}</p>
						<TrackedLink
							href="#install"
							className="btn btn-primary gap-2 rounded-[10px] font-semibold"
							eventName="install_cta_click"
							eventParams={{ location: 'loops_hero' }}
						>
							{dict['nav.download']}
						</TrackedLink>
					</ScrollReveal>
				</div>
			</section>

			{/* Intro prose */}
			<section className="border-b border-base-content/10 bg-base-100 py-16">
				<div className="container mx-auto max-w-[720px] px-6">
					<ScrollReveal y={30} className="flex flex-col gap-5">
						<p className="text-[17px] leading-[1.75] text-base-content/75">{dict['loops.intro1']}</p>
						<p className="text-[17px] leading-[1.75] text-base-content/75">{dict['loops.intro2']}</p>
					</ScrollReveal>
				</div>
			</section>

			{/* The four stages */}
			<section className="border-b border-base-content/10 bg-base-200 py-24">
				<div className="container mx-auto max-w-[1080px] px-6">
					<ScrollReveal y={30} stagger={0.1} className="grid gap-6 sm:grid-cols-2">
						{steps.map((n) => (
							<div key={n} className="rounded-[14px] border border-base-content/10 bg-base-100 p-7">
								<div className="mb-4 font-mono text-[13px] text-primary">{dict[`loops.step${n}.label` as keyof typeof dict]}</div>
								<h2 className="mb-2.5 text-[22px] font-bold tracking-[-0.02em]">{dict[`loops.step${n}.title` as keyof typeof dict]}</h2>
								<p className="text-[15px] leading-[1.7] text-base-content/70">{dict[`loops.step${n}.body` as keyof typeof dict]}</p>
							</div>
						))}
					</ScrollReveal>
				</div>
			</section>

			{/* Why a loop */}
			<section className="border-b border-base-content/10 bg-base-100 py-24">
				<div className="container mx-auto max-w-[720px] px-6">
					<ScrollReveal y={30} className="flex flex-col gap-5">
						<Eyebrow className="mb-1 self-start">{dict['loops.why.eyebrow']}</Eyebrow>
						<h2 className="text-[clamp(28px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em]">{dict['loops.why.title']}</h2>
						<p className="text-[17px] leading-[1.75] text-base-content/75">{dict['loops.why.body1']}</p>
						<p className="text-[17px] leading-[1.75] text-base-content/75">{dict['loops.why.body2']}</p>
					</ScrollReveal>
				</div>
			</section>

			{/* Explore — internal links into features & use cases */}
			<section className="border-b border-base-content/10 bg-base-200 py-24">
				<div className="container mx-auto max-w-[1080px] px-6">
					<ScrollReveal y={30} className="mb-10">
						<Eyebrow className="mb-5">{dict['loops.explore.eyebrow']}</Eyebrow>
						<h2 className="text-[clamp(26px,3.6vw,40px)] font-extrabold leading-[1.1] tracking-[-0.03em]">{dict['loops.explore.title']}</h2>
					</ScrollReveal>
					<ScrollReveal y={20} stagger={0.08} className="grid gap-5 sm:grid-cols-3">
						{explore.map((item) => (
							<Link
								key={item.href}
								href={localizedPath(item.href, locale)}
								className="group rounded-[14px] border border-base-content/10 bg-base-100 p-6 transition-colors hover:border-primary/40"
							>
								<h3 className="mb-2 flex items-center gap-1.5 text-[18px] font-bold">
									{item.label}
									<span className="text-primary transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
								</h3>
								<p className="text-[14px] leading-[1.6] text-base-content/70">{item.desc}</p>
							</Link>
						))}
					</ScrollReveal>
				</div>
			</section>

			{/* FAQ */}
			<section className="border-b border-base-content/10 bg-base-100 py-24">
				<div className="container mx-auto max-w-[760px] px-6">
					<ScrollReveal y={30}>
						<Eyebrow className="mb-5">{dict['faq.eyebrow']}</Eyebrow>
						<h2 className="mb-10 text-[clamp(28px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em]">{dict['faq.heading']}</h2>
					</ScrollReveal>
					<ScrollReveal y={20} stagger={0.08} className="flex flex-col gap-3">
						{faqs.map((f) => (
							<details key={f.q} className="group rounded-[12px] border border-base-content/10 bg-base-200 px-6 py-5">
								<summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold marker:hidden">
									{f.q}
									<span className="text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
								</summary>
								<p className="mt-3 text-[15px] leading-[1.7] text-base-content/70">{f.a}</p>
							</details>
						))}
					</ScrollReveal>
				</div>
			</section>

			<CTA dict={dict} />
		</>
	)
}
