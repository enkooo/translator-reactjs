import { Dictionary } from '../types';

export const en_GB: Dictionary = {
	common: {
		autoTranslate: 'Auto translate',
		companyName: 'Codemask Academy',
	},
	components: {
		app: {
			loading: 'Fetching supported languages...',
			empty: 'No supported language',
			error: 'Something went wrong...',
		},
		header: {
			github: 'GitHub',
			discord: 'Discord',
			title: 'Translator ReactJS',
		},
		footer: {
			flatIcon: 'FlatIcons',
			libreTranslate: 'LibreTranslate',
		},
		message: {
			tryAgain: 'Try again',
		},
		confidence: {
			error: `We couldn't detect the language`,
		},
	},
	screens: {
		translator: {
			sourceInputPlaceholder: 'Type text here...',
		},
	},
};
