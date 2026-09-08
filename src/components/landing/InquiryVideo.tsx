const MEDIA = '/videos/tucky-inquiry'

export function InquiryVideo({ labels }: {
	labels: { title: string; language: string; download: string }
}) {
	return (
		<div className="mx-auto mt-16 max-w-[980px]">
			<div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
				<p id="inquiry-video-title" className="font-semibold">{labels.title}</p>
				<p className="text-sm text-base-content/65">{labels.language}</p>
			</div>
			<video
				controls
				playsInline
				preload="none"
				poster={`${MEDIA}/poster.jpg`}
				width={1920}
				height={1080}
				tabIndex={0}
				aria-labelledby="inquiry-video-title"
				className="block aspect-video h-auto w-full rounded-2xl border border-base-content/15 bg-black shadow-[0_24px_64px_rgba(18,59,45,0.16)]"
			>
				<source src={`${MEDIA}/film.mp4`} type="video/mp4" />
				<track kind="captions" src={`${MEDIA}/captions.en.vtt`} srcLang="en" label="English" />
				<a href={`${MEDIA}/film.mp4`}>{labels.download}</a>
			</video>
		</div>
	)
}
