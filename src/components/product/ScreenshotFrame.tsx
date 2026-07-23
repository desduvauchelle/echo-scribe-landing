import Image from 'next/image'

export interface Shot {
	src: string
	alt: string
	caption?: string
	width?: number
	height?: number
}

export function ScreenshotFrame({ shot }: { shot: Shot }) {
	return (
		<figure className="overflow-hidden rounded-3xl border border-base-content/18 bg-elevated shadow-[0_32px_80px_rgba(18,59,45,0.14)]">
			<div className="flex items-center gap-2 border-b border-base-content/10 bg-base-200 px-4.5 py-3.5" aria-hidden="true">
				<span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
				<span className="h-3 w-3 rounded-full bg-[#febc2e]" />
				<span className="h-3 w-3 rounded-full bg-[#28c840]" />
			</div>
			<Image src={shot.src} alt={shot.alt} width={shot.width ?? 880} height={shot.height ?? 560} className="h-auto w-full" />
			{shot.caption ? <figcaption className="border-t border-base-content/10 px-5 py-3 text-sm text-base-content/60">{shot.caption}</figcaption> : null}
		</figure>
	)
}
