export interface Comparison {
	slug: string
	name: string
	category: 'Dictation' | 'Meetings'
	headline: string
	intro: string
	bestFor: string
	rows: [feature: string, tucky: string, competitor: string][]
	sources: { label: string; url: string }[]
	note?: string
}

export const comparisons: Comparison[] = [
	{
		slug: 'superwhisper', name: 'Superwhisper', category: 'Dictation',
		headline: 'Local dictation. And everything after it.',
		intro: 'Both apps can turn speech into text on your device. Choose Tucky when you also want meeting recordings, notes, tasks, and local AI chat in one free Mac app.',
		bestFor: 'You want a choice of local and cloud voice models, custom dictation modes, or support beyond the Mac.',
		rows: [
			['Voice to text', 'Hotkey dictation into Mac apps', 'Dictation with configurable modes'],
			['Local processing', 'On-device transcription and AI', 'Local models available; cloud models optional'],
			['Offline use', 'Core features after model downloads', 'Yes, when using local models'],
			['Cost', 'Core features free; no subscription', 'Free tier plus paid Pro plans'],
			['Custom words', 'Included', 'Available; check current plan'],
			['Meeting workflow', 'Recording, live transcript, summaries and guidance', 'Dedicated Meeting mode'],
			['Beyond dictation', 'Notes, tasks, screen recording and local chat', 'Custom modes and model selection'],
			['Devices', 'Apple Silicon Mac, macOS 14+', 'Mac, Windows, iPhone and iPad'],
		],
		sources: [
			{ label: 'Superwhisper offline transcription', url: 'https://superwhisper.com/offline-transcription' },
			{ label: 'Superwhisper plans and features', url: 'https://superwhisper.com/docs/get-started/sw-pro' },
		],
		note: 'Superwhisper’s offline page and Pro documentation differ on which local models are free. We credit its offline support without claiming that it requires a subscription.',
	},
	{
		slug: 'wispr-flow', name: 'Wispr Flow', category: 'Dictation',
		headline: 'Your voice to text. On your Mac.',
		intro: 'Want to dictate without sending your speech to a cloud service? Tucky transcribes and processes text locally, with free core features and no account required.',
		bestFor: 'You want cloud-powered dictation across desktop and mobile, with shared vocabulary and team controls.',
		rows: [
			['Voice to text', 'Hotkey dictation into Mac apps', 'Dictation across supported desktop and mobile apps'],
			['Processing', 'On your Mac', 'Cloud processing'],
			['Privacy approach', 'Core audio and text stay local', 'Privacy Mode and cloud-storage controls'],
			['Free dictation', 'No weekly word allowance', 'Desktop free plan: 2,000 words per week'],
			['Paid plan', 'No subscription for core features', 'Paid plans unlock unlimited dictation'],
			['Custom words', 'Included locally', 'Dictionary with device sync'],
			['AI workflow', 'Local formatting, notes, tasks and chat', 'Cloud-powered text formatting and dictation tools'],
		],
		sources: [
			{ label: 'Wispr Flow plans and limits', url: 'https://wisprflow.ai/pricing' },
			{ label: 'Wispr Flow data handling', url: 'https://docs.wisprflow.ai/articles/3467817258-security-and-compliance-faq' },
		],
		note: 'Privacy Mode controls training and retention. It does not turn cloud processing into on-device processing.',
	},
	{
		slug: 'granola', name: 'Granola', category: 'Meetings',
		headline: 'Meeting notes that stay with you.',
		intro: 'Capture the conversation, get a summary, and ask questions later. Tucky keeps that workflow on your Mac and includes it free, alongside dictation and screen recording.',
		bestFor: 'You want shared meeting folders, cloud AI chat, and business integrations for a team.',
		rows: [
			['Meeting capture', 'System audio and microphone; no meeting bot', 'Device audio; no meeting bot'],
			['Speech and AI', 'Local models on your Mac', 'External transcription and AI providers'],
			['Meeting history', 'Saved on your Mac', 'Notes and transcripts stored in the cloud'],
			['Audio playback', 'Saved meeting recordings', 'Meeting audio is not stored for playback'],
			['Notes and chat', 'Local summaries and chat across saved history', 'AI notes and chat within and across meetings'],
			['Free plan', 'Core features free; storage uses your disk', 'Basic includes limited meeting history'],
			['Sharing', 'Deliberate exports and optional sharing', 'Shared folders; advanced integrations on paid plans'],
			['More ways to capture', 'Dictation, voice notes and screen recording', 'Meeting notes on desktop and mobile'],
		],
		sources: [
			{ label: 'Granola plans and features', url: 'https://www.granola.ai/pricing' },
			{ label: 'How Granola handles recordings and data', url: 'https://www.granola.ai/security' },
		],
	},
	{
		slug: 'otter', name: 'Otter', category: 'Meetings',
		headline: 'Keep the conversation. Skip the minute budget.',
		intro: 'Tucky records and transcribes meetings locally, with no monthly transcription allowance. Your Mac supplies the processing and storage.',
		bestFor: 'You want a shared meeting workspace, speaker identification, and access through mobile apps.',
		rows: [
			['Data location', 'Local core processing and history', 'Cloud service processes meeting content'],
			['Free minutes', 'No monthly minute allowance', 'Basic: 300 minutes per month'],
			['Free meeting length', 'No plan-based duration cap', 'Basic: 30 minutes per conversation'],
			['Live transcript', 'Included', 'Included'],
			['Audio playback', 'Local recordings', 'Recording playback'],
			['Ask about meetings', 'Local chat across saved history', 'AI chat within and across meetings'],
			['Sharing workflow', 'Exports and optional connected services', 'Shared cloud meeting workflows'],
		],
		sources: [
			{ label: 'Otter plans and limits', url: 'https://otter.ai/pricing' },
			{ label: 'Otter data handling', url: 'https://otter.ai/privacy-policy' },
		],
	},
	{
		slug: 'fireflies', name: 'Fireflies', category: 'Meetings',
		headline: 'Your meeting memory. Your own storage.',
		intro: 'Tucky brings meeting recordings, transcripts, summaries, and local chat together on your Mac. Core features are free, without a cloud storage subscription.',
		bestFor: 'You want a cloud meeting workspace with integrations, team analytics, and managed sharing.',
		rows: [
			['Processing', 'On-device transcription and AI', 'Cloud meeting service'],
			['Free offering', 'Free core recording, transcription and AI', 'Free tier with limited AI summaries'],
			['Storage', 'Uses your Mac’s available disk space', 'Free: 400 minutes of storage per team'],
			['Live text', 'Included', 'Available'],
			['Ask about meetings', 'Local chat with source references', 'AskFred AI assistant'],
			['Recording methods', 'System audio and microphone; no meeting bot', 'Meeting integrations, uploads and bot-free options'],
			['Team workflow', 'Exports and optional sharing', 'Integrations; team analytics on higher plans'],
		],
		sources: [
			{ label: 'Fireflies plans and features', url: 'https://fireflies.ai/pricing' },
			{ label: 'Fireflies security and storage', url: 'https://fireflies.ai/security' },
		],
	},
]

export const comparisonPaths = ['/compare', ...comparisons.map(({ slug }) => `/compare/${slug}`)]
export const reviewedAt = '2026-09-04'
export function getComparison(slug: string) {
	return comparisons.find((comparison) => comparison.slug === slug)
}
