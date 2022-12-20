import { useState } from 'react';
import { APP_CONFIG } from '../config';
import { Language, LanguageCode } from '../models';
import { HttpMethod, OnError, OnSuccess } from '../types';

type FetchProps = {
	url: string;
	method: HttpMethod;
};

type FetchActions<Response> = {
	onSuccess: OnSuccess<Response>;
	onError?: OnError;
};

export const useFetch = <Response, Request = {}>(config: FetchProps, actions: FetchActions<Response>) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasError, setHasError] = useState<boolean>(false);

	return {
		isLoading,
		hasError,
		fetch: (params: Request) => {
			setIsLoading(true);
			setHasError(false);

			const fetchConfig = {
				...(config.method === HttpMethod.POST && {
					method: config.method,
					body: JSON.stringify({
						...params,
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				}),
			};

			fetch(`${APP_CONFIG.API_URL}/${config.url}`, fetchConfig)
				.then((response) => {
					if (response.ok) {
						return response;
					}
					throw response;
				})
				.then((response) => response.json())
				.then(actions.onSuccess)
				.catch(() => {
					setHasError(true);
					if (actions.onError) {
						actions.onError();
					}
				})
				.finally(() => setIsLoading(false));
		},
	};
};
