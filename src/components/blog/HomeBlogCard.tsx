import Image from 'next/image'
import Link from 'next/link'
import { localePrefix as getLocalePrefix } from '@/lib/i18n-utils'
import type { ComponentProps } from 'react'
import type { BlogCard } from '@growth-engine/sdk-client/components'

// Keep the SDK card's presentation, but render homepage cards on the server
// and serve responsive thumbnails instead of eagerly downloading CMS originals.
export function HomeBlogCard({ slug, title, content, heroImageUrl, seoDesc, createdAt, locale, localePrefix }: Omit<ComponentProps<typeof BlogCard>, 'author'>) {
	const date = new Date(createdAt)
	const preview = seoDesc ?? content.replace(/<[^>]*>/g, '').slice(0, 160) + '...'
	const prefix = localePrefix ?? getLocalePrefix(locale)
	// Preserve arbitrary editorial URLs; only our public CMS bucket is optimized.
	const optimizable = heroImageUrl?.startsWith('https://storage.googleapis.com/rs-bucket-prod/tenants/echo-scribe-ai-juicing/public/')

	return (
		<article itemScope itemType="https://schema.org/BlogPosting">
			<Link href={`${prefix}/blog/${slug}`} className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow group">
				{heroImageUrl && (
					<figure className="relative aspect-video overflow-hidden">
						<Image
							src={heroImageUrl}
							alt={title}
							fill
							loading="lazy"
							unoptimized={!optimizable}
							sizes="(min-width: 768px) 33vw, 100vw"
							className="object-cover group-hover:scale-105 transition-transform duration-300"
						/>
					</figure>
				)}
				<div className="card-body">
					<time className="text-xs text-base-content/50" dateTime={date.toISOString()}>
						{date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
					</time>
					<h2 className="card-title text-lg group-hover:text-primary transition-colors">{title}</h2>
					<p className="text-sm text-base-content/70 line-clamp-3">{preview}</p>
				</div>
			</Link>
		</article>
	)
}
