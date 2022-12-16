import React from 'react';
import styled from 'styled-components';
import { Images } from '../../assets';

type ExchangeLanguageProps = {
	onClick(): void;
	hidden: boolean;
};

export const ExchangeLanguage: React.FunctionComponent<ExchangeLanguageProps> = ({ onClick, hidden }) => (
	<ExchangeContainer>
		{!hidden && <Exchange src={Images.Exchange} alt='exchange icon' onClick={onClick} />}
	</ExchangeContainer>
);

const Exchange = styled.img`
	cursor: pointer;
	width: 22px;
	height: 22px;
`;

const ExchangeContainer = styled.div`
	width: 22px;
	height: 22px;
`;
