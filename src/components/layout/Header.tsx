import Link from 'next/link'
import Image from 'next/image'
import type { Dictionary } from '@/i18n'
import { localizedPath } from '@/lib/i18n-utils'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'

export function Header({ dict, locale }: { dict: Dictionary; locale: string }) {
	const NAV_LINKS = [
		{ href: localizedPath('/', locale), label: dict['nav.home'] },
		{ href: localizedPath('/blog', locale), label: dict['nav.blog'] },
		{ href: localizedPath('/contact', locale), label: dict['nav.contact'] },
		{ href: `${localizedPath('/', locale)}#install`, label: dict['nav.download'] },
	]

	return (
		<header className="navbar sticky top-0 z-50 border-b border-base-content/10 bg-base-100/85 backdrop-blur-xl">
			<div className="container mx-auto flex items-center justify-between px-4">
				<Link href={localizedPath('/', locale)} className="flex items-center gap-2.5 text-[17px] font-bold tracking-[-0.02em]">
					<Image src="/icon.jpeg" alt="Echo Scribe app icon" width={30} height={30} className="rounded-[7px]" />
					{'Echo Scribe'}
				</Link>

				{/* Desktop nav */}
				<nav className="hidden items-center gap-6 md:flex">
					{NAV_LINKS.slice(0, 3).map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="text-base-content/70 transition-colors hover:text-primary"
						>
							{link.label}
						</Link>
					))}
					<LanguageSwitcher locale={locale} />
					<ThemeToggle />
					<Link href={`${localizedPath('/', locale)}#install`} className="btn btn-primary btn-sm gap-2 rounded-[9px] font-semibold">
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="7 10 12 15 17 10" />
							<line x1="12" y1="15" x2="12" y2="3" />
						</svg>
						{dict['nav.download']}
					</Link>
				</nav>

				{/* Mobile nav — client component handles toggle state */}
				<MobileMenu links={NAV_LINKS} locale={locale} />
			</div>
		</header>
	)
}
