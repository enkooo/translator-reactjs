import { useTranslations, useFetch } from '../../lib/hooks';
import { AutoDetectedLanguage, Language, LanguageCode } from '../../lib/models';
import { HttpMethod } from '../../lib/types';
import { AutoDetectedLanguageRequest, TranslateTextRequest, TranslateTextResponse } from './types';

export const useSupportedLanguages = (onSuccess: (languages: Array<Language>) => void) => {
	const T = useTranslations();

	return useFetch<Array<Language>>(
		{
			url: 'languages',
			method: HttpMethod.GET,
		},
		{
			onSuccess: (languages) => {
				const allLanguages: Array<Language> = [
					{
						code: LanguageCode.Auto,
						name: T.common.autoTranslate,
					},
				].concat(languages);

				onSuccess(allLanguages);
			},
		}
	);
};

export const useAutoDetectLanguage = (onSuccess: (autoDetectedLanguage: AutoDetectedLanguage) => void) =>
	useFetch<Array<AutoDetectedLanguage>, AutoDetectedLanguageRequest>(
		{
			url: 'detect',
			method: HttpMethod.POST,
		},
		{
			onSuccess: ([autoDetectedLanguage]) => onSuccess(autoDetectedLanguage),
		}
	);

export const useTranslateText = (onSuccess: (translatedText: string) => void) =>
	useFetch<TranslateTextResponse, TranslateTextRequest>(
		{
			url: 'translate',
			method: HttpMethod.POST,
		},
		{
			onSuccess: ({ translatedText }) => onSuccess(translatedText),
		}
	);
