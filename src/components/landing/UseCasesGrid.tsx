import Link from 'next/link'
import type { Dictionary } from '@/i18n'
import { localizedPath } from '@/lib/i18n-utils'
import { Eyebrow } from './Eyebrow'
import { ScrollReveal } from './ScrollReveal'

export function UseCasesGrid({ dict, locale }: { dict: Dictionary; locale: string }) {
	const cards = [1, 2, 3, 4, 5, 6] as const

	return (
		<section id="use-cases" className="scroll-mt-20 border-t border-base-content/10 bg-base-100 py-25">
			<div className="container mx-auto max-w-[1080px] px-6">
				<ScrollReveal y={30} className="mb-14 text-center">
					<Eyebrow className="mb-5">{dict['usecases.landing.eyebrow']}</Eyebrow>
					<h2 className="mb-4 text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-0.03em]">
						{dict['usecases.landing.title']}
					</h2>
					<p className="mx-auto max-w-[520px] text-lg leading-relaxed text-base-content/70">
						{dict['usecases.landing.subtitle']}
					</p>
				</ScrollReveal>

				<ScrollReveal y={40} stagger={0.08} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{cards.map((n) => (
						<div key={n} className="rounded-[14px] border border-base-content/12 bg-base-200 p-6">
							<h3 className="mb-2 text-[15px] font-semibold">{dict[`usecases.landing.card${n}.title`]}</h3>
							<p className="text-sm leading-[1.55] text-base-content/70">{dict[`usecases.landing.card${n}.desc`]}</p>
						</div>
					))}
				</ScrollReveal>

				<ScrollReveal y={20} className="mt-10 text-center">
					<Link
						href={localizedPath('/use-cases', locale)}
						className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
					>
						{dict['usecases.landing.explore']}
						<span aria-hidden="true">→</span>
					</Link>
				</ScrollReveal>
			</div>
		</section>
	)
}
