import React from 'react';
import styled from 'styled-components';
import { Confidence, ExchangeLanguage, Loader, SelectLanguage, TextCounter, TextInput } from '../../lib/components';
import { APP_CONFIG } from '../../lib/config';
import { useTranslations } from '../../lib/hooks';
import { Language, LanguageCode } from '../../lib/models';
import { useLibreTranslate } from './useLibreTranslate';

type TranslatorScreenProps = {
	languages: Array<Language>;
};

export const TranslatorScreen: React.FunctionComponent<TranslatorScreenProps> = ({ languages }) => {
	const T = useTranslations();
	const {
		query,
		setQuery,
		autoDetectedLanguage,
		debouncedAction,
		hasErrorDetectingLanguage,
		hasErrorTranslatingText,
		isDectingLanguage,
		isTranslatingText,
		translatedText,
		selectedLanguages,
		setSelectedLanguages,
		setAutoDetectedLanguage,
	} = useLibreTranslate();

	return (
		<Container>
			<TranslatorContainer>
				<InputContainer>
					<SelectLanguage
						languages={languages}
						exclude={[selectedLanguages.target]}
						selectedLanguage={selectedLanguages.source}
						onChange={(newCode) =>
							setSelectedLanguages((prevState) => ({
								...prevState,
								source: newCode,
							}))
						}
					/>
					<TextInput
						autoFocus
						value={query}
						onChangeText={(newQuery) => {
							if (newQuery.length > APP_CONFIG.TEXT_INPUT_LIMIT) {
								return;
							}

							setQuery(newQuery);
							debouncedAction(newQuery);
						}}
						placeholder={T.screens.translator.sourceInputPlaceholder}
					/>
					<LoaderContainer>{isDectingLanguage && <Loader />}</LoaderContainer>
					<InputFooter>
						<Confidence
							hasError={hasErrorDetectingLanguage && selectedLanguages.source === LanguageCode.Auto}
							autoDetectedLanguage={autoDetectedLanguage}
							onClick={() => {
								setSelectedLanguages((prevState) => ({
									...prevState,
									source: autoDetectedLanguage?.language as LanguageCode,
								}));
								setAutoDetectedLanguage(undefined);
								debouncedAction(query);
							}}
						/>
						<TextCounter counter={query.length} limit={APP_CONFIG.TEXT_INPUT_LIMIT} />
					</InputFooter>
				</InputContainer>
				<ExchangeLanguage
					hidden={selectedLanguages.source === LanguageCode.Auto}
					onClick={() =>
						setSelectedLanguages((prevState) => ({
							source: prevState.target,
							target: prevState.source,
						}))
					}
				/>
				<InputContainer>
					<SelectLanguage
						languages={languages}
						exclude={[selectedLanguages.source, LanguageCode.Auto]}
						selectedLanguage={selectedLanguages.target}
						onChange={(newCode) =>
							setSelectedLanguages((prevState) => ({
								...prevState,
								target: newCode,
							}))
						}
					/>
					<TextInput disabled value={translatedText} hasError={hasErrorTranslatingText} />
					<LoaderContainer>{isTranslatingText && <Loader />}</LoaderContainer>
				</InputContainer>
			</TranslatorContainer>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	color: ${({ theme }) => theme.colors.typography};
`;

const TranslatorContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	margin-top: 50px;

	@media (min-width: ${({ theme }) => theme.media.sm}px) {
		justify-content: center;
	}

	@media (max-width: ${({ theme }) => theme.media.sm}px) {
		flex-direction: column;
		align-items: center;
	}
`;

const InputContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 0 5px;
`;

const LoaderContainer = styled.div`
	padding: 5px 10px;
`;

const InputFooter = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;
