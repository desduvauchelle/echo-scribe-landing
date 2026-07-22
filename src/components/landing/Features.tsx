import type { ReactNode } from 'react'
import type { Dictionary } from '@/i18n'
import { cn } from '@/lib/utils'
import { Eyebrow } from './Eyebrow'
import { ScrollReveal } from './ScrollReveal'
import { TranscriptionDemo, MeetingDemo, CaptureDemo, StatusDemo } from './FeatureMockups'

type SlabKey = 'transcription' | 'guided' | 'context' | 'status'

interface Slab {
	id: string
	key: SlabKey
	visual: (dict: Dictionary) => ReactNode
	reverse?: boolean
	tinted?: boolean
}

const SLABS: Slab[] = [
	{ id: 'transcription', key: 'transcription', visual: (dict) => <TranscriptionDemo dict={dict} /> },
	{ id: 'guided', key: 'guided', visual: (dict) => <MeetingDemo dict={dict} />, reverse: true, tinted: true },
	{ id: 'capture', key: 'context', visual: (dict) => <CaptureDemo dict={dict} />, reverse: true },
	{ id: 'status', key: 'status', visual: (dict) => <StatusDemo dict={dict} />, tinted: true },
]

export function Features({ dict }: { dict: Dictionary }) {
	return (
		<>
			{SLABS.map((slab) => (
				<section
					key={slab.id}
					id={slab.id}
					className={cn('scroll-mt-20 border-t border-base-content/10 py-25', slab.tinted ? 'bg-base-200' : 'bg-base-100')}
				>
					<div className="container mx-auto max-w-[1080px] px-6">
						<ScrollReveal y={30} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-18">
							<div className={cn(slab.reverse && 'lg:order-last')}>
								<Eyebrow className="mb-5">{dict[`features.${slab.key}.eyebrow`]}</Eyebrow>
								<h2 className="mb-5 text-[clamp(28px,3.8vw,46px)] font-extrabold leading-[1.1] tracking-[-0.03em]">
									{dict[`features.${slab.key}.title`]}
								</h2>
								<p className="mb-8 text-[17px] leading-[1.7] text-base-content/70">{dict[`features.${slab.key}.desc`]}</p>

								<div className="flex flex-col gap-4">
									{([1, 2, 3] as const).map((n) => (
										<div key={n} className="flex items-start gap-4">
											<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-[13px] font-bold text-primary">
												{n}
											</div>
											<div>
												<strong className="mb-0.5 block text-[15px] font-semibold">
													{dict[`features.${slab.key}.step${n}.title`]}
												</strong>
												<span className="text-sm text-base-content/70">{dict[`features.${slab.key}.step${n}.desc`]}</span>
											</div>
										</div>
									))}
								</div>
							</div>

							<div>{slab.visual(dict)}</div>
						</ScrollReveal>
					</div>
				</section>
			))}
		</>
	)
}
