import { Mascot } from './Mascot'
import Link from 'next/link'
import type { Dictionary } from '@/i18n'
import { cn } from '@/lib/utils'
import { localizedPath } from '@/lib/i18n-utils'
import { Eyebrow } from './Eyebrow'
import { ScrollReveal } from './ScrollReveal'

// Borders per step for the 1 / 2 / 4-column layouts (mobile / sm / lg)
const STEP_CLASSES = [
	'sm:pr-6 sm:border-r',
	'border-t sm:border-t-0 sm:pl-6 lg:border-r lg:pr-6',
	'border-t sm:border-t lg:border-t-0 sm:pr-6 sm:border-r lg:px-6',
	'border-t sm:border-t lg:border-t-0 sm:pl-6',
]

export function WorkMemoryLoop({ dict, locale }: { dict: Dictionary; locale: string }) {
	const steps = [1, 2, 3, 4] as const

	return (
		<section id="how-it-works" className="scroll-mt-20 bg-base-200 pt-23 pb-25">
			<div className="container mx-auto max-w-[1080px] px-6">
				<div className="mb-14 grid items-center gap-6 md:grid-cols-[1fr_240px] lg:grid-cols-[1fr_280px]">
				<ScrollReveal y={30} className="max-w-[680px]">
					<Eyebrow className="mb-5">{dict['loop.eyebrow']}</Eyebrow>
					<h2 className="mb-4.5 text-[clamp(30px,4.5vw,54px)] font-extrabold leading-[1.08] tracking-[-0.035em]">
						{dict['loop.title']}
					</h2>
					<p className="text-lg leading-[1.65] text-base-content/70">{dict['loop.subtitle']}</p>
					<Link href={localizedPath('/loops', locale)} className="mt-6 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
						{dict['loop.learn.more']}
						<span aria-hidden="true">→</span>
					</Link>
				</ScrollReveal>
				<Mascot pose="collect" dict={dict} className="mx-auto max-w-[200px] md:max-w-none" />
				</div>

				<ScrollReveal y={30} stagger={0.1} className="grid grid-cols-1 border-y border-base-content/15 sm:grid-cols-2 lg:grid-cols-4">
					{steps.map((n, i) => (
						<div key={n} className={cn('border-base-content/15 py-7', STEP_CLASSES[i])}>
							<div className="mb-6 font-mono text-[13px] text-primary">{dict[`loop.step${n}.label`]}</div>
							<h3 className="mb-2 text-[19px] font-bold">{dict[`loop.step${n}.title`]}</h3>
							<p className="text-sm leading-relaxed text-base-content/70">{dict[`loop.step${n}.desc`]}</p>
						</div>
					))}
				</ScrollReveal>
			</div>
		</section>
	)
}
