import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState } from 'react';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/ko';
import 'moment/locale/uz-latn'; // @ts-ignore
import '../scss/app.scss'; // @ts-ignore
import '../scss/pc/main.scss'; // @ts-ignore
import '../scss/mobile/main.scss';

const App = ({ Component, pageProps }: AppProps) => {
	// @ts-ignore
	const [theme, setTheme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);
	const { locale } = useRouter();

	// dates (moment / react-moment) follow the page language; our 'kr' is moment's 'ko', 'uz' is 'uz-latn'.
	// Set during render so the server and the browser format dates the same way.
	moment.locale(({ kr: 'ko', ru: 'ru', uz: 'uz-latn' } as Record<string, string>)[locale ?? 'en'] ?? 'en');

	// Socket.io, Redux, Mui, Apolo Client ...
	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
