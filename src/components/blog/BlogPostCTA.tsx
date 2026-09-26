import Link from 'next/link'
import type { Dictionary } from '@/i18n'
import { localizedPath } from '@/lib/i18n-utils'
import { InstallBox } from '@/components/landing/InstallBox'

/**
 * End-of-article call to action on every blog post.
 *
 * The install command is the conversion (`install_copy`, `location: 'blog_post'`),
 * so it leads. The homepage + /features + /use-cases links give readers who are
 * not ready to install somewhere to go next — and give those commercial pages a
 * server-rendered inbound link from every post.
 */
export function BlogPostCTA({ dict, locale }: { dict: Dictionary; locale: string }) {
	const explore = [
		{ href: localizedPath('/features', locale), label: dict['nav.features'] },
		{ href: localizedPath('/use-cases', locale), label: dict['nav.usecases'] },
	]

	return (
		<aside
			aria-labelledby="blog-post-cta-heading"
			className="mt-14 rounded-2xl border border-base-content/10 bg-base-200 px-6 py-10 text-center sm:px-10"
		>
			<p className="mb-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase">{dict['blog.cta.eyebrow']}</p>
			<h2 id="blog-post-cta-heading" className="mb-3 text-[clamp(24px,3vw,32px)] font-extrabold tracking-[-0.02em]">
				{dict['blog.cta.heading']}
			</h2>
			<p className="mx-auto mb-7 max-w-xl text-base-content/70">{dict['blog.cta.subtitle']}</p>

			<InstallBox dict={dict} location="blog_post" />

			<p className="mt-4 text-[13px] text-base-content/50">
				{dict['cta.meta.macos']} · {dict['cta.meta.chips']}
			</p>

			<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
				<Link href={localizedPath('/', locale)} className="btn btn-outline btn-sm rounded-lg">
					{dict['blog.cta.home']}
				</Link>
				{explore.map((l) => (
					<Link key={l.href} href={l.href} className="btn btn-ghost btn-sm rounded-lg text-primary">
						{l.label} →
					</Link>
				))}
			</div>
		</aside>
	)
}
