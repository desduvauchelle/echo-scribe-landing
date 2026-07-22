import Link from 'next/link'
import Image from 'next/image'
import type { Dictionary } from '@/i18n'
import { localizedPath } from '@/lib/i18n-utils'

const GITHUB_URL = 'https://github.com/denisduvauchelle/echo-scribe'

export function Footer({ dict, locale }: { dict: Dictionary; locale: string }) {
	const year = new Date().getFullYear()

	return (
		<footer className="border-t border-base-content/10 bg-base-200">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					<div>
						<Link href={localizedPath('/', locale)} className="mb-2 flex items-center gap-2.5 font-bold">
							<Image src="/icon.jpeg" alt="Echo Scribe" width={26} height={26} className="rounded-md" />
							{'Echo Scribe'}
						</Link>
						<p className="text-sm text-base-content/60">{dict['footer.tagline']}</p>
					</div>

					<div>
						<h4 className="mb-2 font-semibold">{dict['footer.navigation']}</h4>
						<nav className="flex flex-col gap-1">
							<Link href={localizedPath('/', locale)} className="text-sm text-base-content/60 hover:text-primary">{dict['nav.home']}</Link>
							<Link href={localizedPath('/blog', locale)} className="text-sm text-base-content/60 hover:text-primary">{dict['nav.blog']}</Link>
							<Link href={localizedPath('/contact', locale)} className="text-sm text-base-content/60 hover:text-primary">{dict['nav.contact']}</Link>
						</nav>
					</div>

					<div>
						<h4 className="mb-2 font-semibold">{dict['footer.project']}</h4>
						<nav className="flex flex-col gap-1">
							<a href={GITHUB_URL} className="text-sm text-base-content/60 hover:text-primary">{dict['footer.github']}</a>
							<a href={`${GITHUB_URL}/releases`} className="text-sm text-base-content/60 hover:text-primary">{dict['footer.releases']}</a>
							<a href={`${GITHUB_URL}/issues`} className="text-sm text-base-content/60 hover:text-primary">{dict['footer.issues']}</a>
						</nav>
					</div>

					<div>
						<h4 className="mb-2 font-semibold">{dict['footer.legal']}</h4>
						<nav className="flex flex-col gap-1">
							<Link href={localizedPath('/legal', locale)} className="text-sm text-base-content/60 hover:text-primary">{dict['footer.legal.notice']}</Link>
							<Link href={localizedPath('/privacy', locale)} className="text-sm text-base-content/60 hover:text-primary">{dict['footer.privacy.policy']}</Link>
							<Link href={localizedPath('/cookies', locale)} className="text-sm text-base-content/60 hover:text-primary">{dict['footer.cookie.policy']}</Link>
						</nav>
					</div>
				</div>

				<div className="divider" />

				<div className="flex flex-col items-center justify-between gap-2 text-sm text-base-content/50 sm:flex-row">
					<p>{dict['footer.copyright'].replace('{year}', String(year))}</p>
					<p>{dict['footer.powered.by']}</p>
				</div>
			</div>
		</footer>
	)
}
