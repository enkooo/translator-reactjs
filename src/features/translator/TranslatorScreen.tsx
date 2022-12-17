import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import styled from 'styled-components';
import { Confidence, ExchangeLanguage, Loader, SelectLanguage, TextCounter, TextInput } from '../../lib/components';
import { APP_CONFIG } from '../../lib/config';
import { useTranslations } from '../../lib/hooks';
import { AutoDetectedLanguage, Language, LanguageCode } from '../../lib/models';
import { useAutoDetectLanguage } from './actions';
import { SelectedLanguages } from './types';

type TranslatorScreenProps = {
	languages: Array<Language>;
};

export const TranslatorScreen: React.FunctionComponent<TranslatorScreenProps> = ({ languages }) => {
	const T = useTranslations();
	const [query, setQuery] = useState<string>('');
	const [autoDetectedLanguage, setAutoDetectedLanguage] = useState<AutoDetectedLanguage>();
	const [selectedLanguages, setSelectedLanguages] = useState<SelectedLanguages>({
		source: LanguageCode.Auto,
		target: LanguageCode.English,
	});
	const {
		isLoading: isDectingLanguage,
		hasError: hasErrorDetectingLanguage,
		fetch: autoDetectLanguage,
	} = useAutoDetectLanguage(setAutoDetectedLanguage);
	const debouncedAutoDetectLanguage = useDebouncedCallback((debouncedQuery) => {
		if (debouncedQuery.length < 5) {
			return;
		}

		if (selectedLanguages.source === LanguageCode.Auto) {
			autoDetectLanguage(debouncedQuery);
		}
	}, 1000);

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
							debouncedAutoDetectLanguage(newQuery);
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
					<TextInput disabled />
					<LoaderContainer>
						<Loader />
					</LoaderContainer>
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
