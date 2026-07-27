'use client'

import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

/**
 * Conversion events, most valuable first. Mark `install_copy` and `app_download`
 * as key events in GA4 — those are the two ways a visitor actually installs.
 * `install_cta_click` is intent only (it just scrolls to the install section).
 *
 * GA4 groups by event name, not by parameter, so each action gets its own name.
 */
type EventName =
	| 'install_copy'
	| 'app_download'
	| 'install_cta_click'
	| 'cta_click'
	| 'contact_view'
	| 'form_submit'
	| (string & {})

/** Where on the page the event fired — reported as the `location` param. */
export type EventLocation = 'header' | 'hero' | 'cta_section' | 'product_hero' | 'loops_hero'

export function trackEvent(name: EventName, params?: Record<string, string>) {
	if (typeof window !== 'undefined' && 'gtag' in window) {
		 
		;(window as any).gtag('event', name, params)
	}
}

export function GoogleAnalytics() {
	if (!GA_ID) return null

	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
				strategy="afterInteractive"
			/>
			<Script id="ga-init" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', '${GA_ID}');
				`}
			</Script>
		</>
	)
}
