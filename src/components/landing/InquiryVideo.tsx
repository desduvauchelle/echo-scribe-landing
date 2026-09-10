'use client'

import { useState } from 'react'

const MEDIA = '/videos/tucky-inquiry'

export function InquiryVideo({ labels }: {
	labels: { title: string; language: string; download: string }
}) {
	const [playing, setPlaying] = useState(false)

	return (
		<div className="mx-auto mt-16 max-w-[980px]">
			<div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
				<p id="inquiry-video-title" className="font-semibold">{labels.title}</p>
				<p className="text-sm text-base-content/65">{labels.language}</p>
			</div>
			<div className="overflow-hidden rounded-2xl border border-base-content/15 bg-black shadow-[0_24px_64px_rgba(18,59,45,0.16)]">
				{playing ? (
					<iframe
						src="https://www.youtube-nocookie.com/embed/h4L-NuEiydU?autoplay=1&playsinline=1&rel=0&iv_load_policy=3"
						title={labels.title}
						width={1920}
						height={1080}
						className="block aspect-video h-auto min-h-[200px] w-full border-0"
						allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
						referrerPolicy="strict-origin-when-cross-origin"
						allowFullScreen
					/>
				) : (
					<button
						type="button"
						onClick={() => setPlaying(true)}
						aria-label={labels.title}
						className="group relative block aspect-video min-h-[200px] w-full cursor-pointer bg-cover bg-center focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-primary"
						style={{ backgroundImage: `url(${MEDIA}/poster.jpg)` }}
					>
						<span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
							<span className="flex size-16 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform group-hover:scale-110">
								<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m9 5 11 7-11 7V5Z" /></svg>
							</span>
						</span>
					</button>
				)}
			</div>
		</div>
	)
}
