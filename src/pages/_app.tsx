import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';

import '@/styles/globals.css';

import { client } from '../lib/graphql';

function Singlelink({ Component, pageProps }: AppProps) {
	return (
		<ApolloProvider client={client}>
			<Component {...pageProps} />
		</ApolloProvider>
	);
}

export default Singlelink;
