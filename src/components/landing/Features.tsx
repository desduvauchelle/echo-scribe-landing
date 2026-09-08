import { Fragment, type ReactNode } from 'react'
import Link from 'next/link'
import type { Dictionary } from '@/i18n'
import { localizedPath } from '@/lib/i18n-utils'
import { cn } from '@/lib/utils'
import { Eyebrow } from './Eyebrow'
import { ScreenshotFrame } from '@/components/product/ScreenshotFrame'
import { ScrollReveal } from './ScrollReveal'
import { TranscriptionDemo, EchoDemo, StatusDemo } from './FeatureMockups'
import { shotFor } from '@/components/product/features.config'
import { Mascot } from './Mascot'
import { MeetingPreview } from './MeetingPreview'

type SlabKey = 'voice' | 'echo' | 'meetings' | 'screen' | 'memory' | 'insights'

interface Slab {
	id: string
	key: SlabKey
	visual: (dict: Dictionary) => ReactNode
	reverse?: boolean
	tinted?: boolean
	mascot: {
		pose: 'listen' | 'collect' | 'wave'
		entrance: 'left' | 'right'
		motion: 'float' | 'nod' | 'sway'
	}
	/**
	 * Contextual link from this slab down to the feature page that covers it in
	 * depth. The homepage is the only page on this site Google reliably reads,
	 * so it is the one place an internal link actually carries weight to
	 * /features/*. Anchor text is the destination's own nav label, never
	 * "learn more". Each destination is linked from exactly one slab.
	 */
	to?: { path: string; nameKey: keyof Dictionary }
}

const SLABS: Slab[] = [
	{
		id: 'voice',
		key: 'voice',
		visual: (dict) => <TranscriptionDemo dict={dict} />,
		mascot: { pose: 'listen', entrance: 'right', motion: 'nod' },
		to: { path: '/features/capture', nameKey: 'nav.features.capture' },
	},
	{
		id: 'echo',
		key: 'echo',
		visual: (dict) => <EchoDemo dict={dict} />,
		mascot: { pose: 'wave', entrance: 'left', motion: 'sway' },
		reverse: true,
		tinted: true,
		to: { path: '/features/editor', nameKey: 'nav.features.editor' },
	},
	{ id: 'meetings', key: 'meetings', visual: (dict) => <MeetingPreview dict={dict} />, mascot: { pose: 'listen', entrance: 'right', motion: 'float' } },
	{ id: 'screen', key: 'screen', visual: (dict) => <ScreenshotFrame shot={shotFor('recorded/recording-preview', dict['shot.recorded.recording.alt'])} />, mascot: { pose: 'wave', entrance: 'left', motion: 'sway' }, reverse: true, tinted: true },
	{
		id: 'memory',
		key: 'memory',
		visual: (dict) => <ScreenshotFrame shot={shotFor('recorded/chat-answer', dict['shot.recorded.answer.alt'])} />,
		mascot: { pose: 'collect', entrance: 'right', motion: 'nod' },
		to: { path: '/features/organize', nameKey: 'nav.features.organize' },
	},
	{
		id: 'insights',
		key: 'insights',
		visual: (dict) => <StatusDemo dict={dict} />,
		mascot: { pose: 'wave', entrance: 'left', motion: 'float' },
		reverse: true,
		tinted: true,
		to: { path: '/features/platform', nameKey: 'nav.features.platform' },
	},
]

export function Features({ dict, locale }: { dict: Dictionary; locale: string }) {
	return (
		<>
			{SLABS.map((slab) => (
				<Fragment key={slab.id}>
					{slab.key === 'meetings' && (
						<div className="border-t border-base-content/10 bg-base-200 px-6 py-14 sm:py-18">
							<div className="mx-auto max-w-[1080px]">
								<h2 className="max-w-[760px] text-[clamp(28px,3.8vw,46px)] font-extrabold leading-[1.15] tracking-[-0.03em]">{dict['home.story.saved.title']}</h2>
								<p className="mt-5 max-w-[680px] text-lg leading-relaxed text-base-content/70">{dict['home.story.saved.desc']}</p>
							</div>
						</div>
					)}
					<section
						id={slab.id}
						className={cn('scroll-mt-20 border-t border-base-content/10 py-25', slab.tinted ? 'bg-base-200' : 'bg-base-100')}
					>
						<div className="container mx-auto max-w-[1080px] px-6">
							<ScrollReveal y={30} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-18">
								<div className={cn(slab.reverse && 'lg:order-last')}>
									<Eyebrow className="mb-5">{dict[`features.${slab.key}.eyebrow`]}</Eyebrow>
									<h2 className="mb-5 text-[clamp(28px,3.8vw,46px)] font-extrabold leading-[1.1] tracking-[-0.03em]">
										{slab.key === 'voice' || slab.key === 'echo' || slab.key === 'memory' ? dict[`home.story.${slab.key}.title`] : dict[`features.${slab.key}.title`]}
									</h2>
									<p className="mb-8 text-[17px] leading-[1.7] text-base-content/70">{slab.key === 'voice' || slab.key === 'echo' || slab.key === 'memory' ? dict[`home.story.${slab.key}.desc`] : dict[`features.${slab.key}.desc`]}</p>

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

									{slab.to && (
										<Link
											href={localizedPath(slab.to.path, locale)}
											className="mt-8 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
										>
											{dict['product.slab.explore'].replace('{name}', dict[slab.to.nameKey])}
											<span aria-hidden="true">→</span>
										</Link>
									)}
								</div>

								<div className={cn('relative', slab.key !== 'meetings' && 'pt-14 sm:pt-16')}>
									{slab.key !== 'meetings' && <Mascot
										pose={slab.mascot.pose}
										entrance={slab.mascot.entrance}
										motion={slab.mascot.motion}
										dict={dict}
										className={cn('absolute top-0 z-10 max-w-24 sm:max-w-28 lg:max-w-32', slab.reverse ? 'left-4 -rotate-2' : 'right-4 rotate-2')}
									/>}
									{slab.visual(dict)}
								</div>
							</ScrollReveal>
						</div>
					</section>
				</Fragment>
			))}

			<section className="border-t border-base-content/10 bg-base-100 py-12">
				<div className="container mx-auto max-w-[1080px] px-6 text-center">
					<Link
						href={localizedPath('/features', locale)}
						className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
					>
						{dict['home.features.all']}
						<span aria-hidden="true">→</span>
					</Link>
				</div>
			</section>
		</>
	)
}
