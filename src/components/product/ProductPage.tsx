import Link from 'next/link'
import type { Dictionary } from '@/i18n'
import { cn } from '@/lib/utils'
import { Eyebrow } from '@/components/landing/Eyebrow'
import { ScrollReveal } from '@/components/landing/ScrollReveal'
import { CTA } from '@/components/landing/CTA'
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

export interface ProductPageProps {
	eyebrow: string
	title: string
	subtitle: string
	hero?: Shot
	slabs: Slab[]
	dict: Dictionary
	locale: string
}

export function ProductPage({ eyebrow, title, subtitle, hero, slabs, dict, locale }: ProductPageProps) {
	return (
		<>
			<section className="border-b border-base-content/10 bg-base-100 py-20">
				<div className="container mx-auto max-w-[1080px] px-6 text-center">
					<ScrollReveal y={30}>
						<Eyebrow className="mb-5">{eyebrow}</Eyebrow>
						<h1 className="mx-auto mb-5 max-w-[18ch] text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.05] tracking-[-0.03em]">{title}</h1>
						<p className="mx-auto mb-8 max-w-[52ch] text-[19px] leading-[1.6] text-base-content/70">{subtitle}</p>
						<Link href="#install" className="btn btn-primary gap-2 rounded-[10px] font-semibold">
							{dict['nav.download']}
						</Link>
					</ScrollReveal>
					{hero ? <div className="mt-14"><ScrollReveal y={30}><ScreenshotFrame shot={hero} /></ScrollReveal></div> : null}
				</div>
			</section>

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

			<CTA dict={dict} />
		</>
	)
}
