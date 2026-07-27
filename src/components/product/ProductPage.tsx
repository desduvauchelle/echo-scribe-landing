import type { Dictionary } from '@/i18n'
import { cn } from '@/lib/utils'
import { Eyebrow } from '@/components/landing/Eyebrow'
import { ScrollReveal } from '@/components/landing/ScrollReveal'
import { CTA } from '@/components/landing/CTA'
import { TrackedLink } from '@/components/analytics/TrackedLink'
import { ScreenshotFrame, type Shot } from './ScreenshotFrame'

export interface Slab {
	eyebrow: string
	title: string
	desc: string
	steps?: { title: string; desc: string }[]
	shot?: Shot
	reverse?: boolean
	tinted?: boolean
}

export interface Faq {
	q: string
	a: string
}

export interface ProductPageProps {
	eyebrow: string
	title: string
	subtitle: string
	hero?: Shot
	slabs: Slab[]
	/** Optional prose paragraphs rendered under the hero — depth for SEO + context. */
	intro?: string[]
	/** Optional FAQ block rendered before the CTA. Emits FAQPage JSON-LD. */
	faqs?: Faq[]
	dict: Dictionary
	locale: string
}

export function ProductPage({ eyebrow, title, subtitle, hero, slabs, intro, faqs, dict, locale }: ProductPageProps) {
	return (
		<>
			{faqs && faqs.length > 0 ? (
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
			) : null}
			<section className="border-b border-base-content/10 bg-base-100 py-20">
				<div className="container mx-auto max-w-[1080px] px-6 text-center">
					<ScrollReveal y={30}>
						<Eyebrow className="mb-5">{eyebrow}</Eyebrow>
						<h1 className="mx-auto mb-5 max-w-[18ch] text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.05] tracking-[-0.03em]">{title}</h1>
						<p className="mx-auto mb-8 max-w-[52ch] text-[19px] leading-[1.6] text-base-content/70">{subtitle}</p>
						<TrackedLink
							href="#install"
							className="btn btn-primary gap-2 rounded-[10px] font-semibold"
							eventName="install_cta_click"
							eventParams={{ location: 'product_hero' }}
						>
							{dict['nav.download']}
						</TrackedLink>
					</ScrollReveal>
					{hero ? <div className="mt-14"><ScrollReveal y={30}><ScreenshotFrame shot={hero} /></ScrollReveal></div> : null}
				</div>
			</section>

			{intro && intro.length > 0 ? (
				<section className="border-b border-base-content/10 bg-base-100 py-16">
					<div className="container mx-auto max-w-[720px] px-6">
						<ScrollReveal y={30} className="flex flex-col gap-5">
							{intro.map((para) => (
								<p key={para} className="text-[17px] leading-[1.75] text-base-content/75">{para}</p>
							))}
						</ScrollReveal>
					</div>
				</section>
			) : null}

			{slabs.map((slab, i) => (
				<section key={slab.title + i} className={cn('border-t border-base-content/10 py-25', slab.tinted ? 'bg-base-200' : 'bg-base-100')}>
					<div className="container mx-auto max-w-[1080px] px-6">
						<ScrollReveal y={30} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-18">
							<div className={cn(slab.reverse && 'lg:order-last')}>
								<Eyebrow className="mb-5">{slab.eyebrow}</Eyebrow>
								<h2 className="mb-5 text-[clamp(28px,3.8vw,46px)] font-extrabold leading-[1.1] tracking-[-0.03em]">{slab.title}</h2>
								<p className="mb-8 text-[17px] leading-[1.7] text-base-content/70">{slab.desc}</p>
								{slab.steps ? (
									<div className="flex flex-col gap-4">
										{slab.steps.map((step, n) => (
											<div key={step.title} className="flex items-start gap-4">
												<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-[13px] font-bold text-primary">{n + 1}</div>
												<div>
													<strong className="mb-0.5 block text-[15px] font-semibold">{step.title}</strong>
													<span className="text-sm text-base-content/70">{step.desc}</span>
												</div>
											</div>
										))}
									</div>
								) : null}
							</div>
							<div>{slab.shot ? <ScreenshotFrame shot={slab.shot} /> : null}</div>
						</ScrollReveal>
					</div>
				</section>
			))}

			{faqs && faqs.length > 0 ? (
				<section className="border-t border-base-content/10 bg-base-200 py-24">
					<div className="container mx-auto max-w-[760px] px-6">
						<ScrollReveal y={30}>
							<Eyebrow className="mb-5">{dict['faq.eyebrow']}</Eyebrow>
							<h2 className="mb-10 text-[clamp(28px,3.8vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em]">{dict['faq.heading']}</h2>
						</ScrollReveal>
						<ScrollReveal y={20} stagger={0.08} className="flex flex-col gap-3">
							{faqs.map((f) => (
								<details key={f.q} className="group rounded-[12px] border border-base-content/10 bg-base-100 px-6 py-5">
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
			) : null}

			<CTA dict={dict} />
		</>
	)
}
