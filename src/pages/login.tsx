import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useLoginMutation } from '../hooks-generated';

const Home: NextPage = () => {
	const router = useRouter();
	const [password, setPassword] = useState<string>('');

	const login = useLoginMutation({
		fetchPolicy: 'network-only',
		onCompleted: async (data) => {
			if (data?.login) {
				localStorage.setItem('jwt', data.login);
				return router.push('/dashboard');
			}
		},
	});

	useEffect(() => {
		const jwt = localStorage.getItem('jwt');
		if (jwt) router.push('/dashboard');
	});

	return (
		<div className='flex min-h-screen w-full flex-col items-center justify-center bg-gray-100'>
			<Head>
				<title>Login - Singlelink</title>
				<meta name='description' content='Login to your Singlelink dashboard.' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='flex w-full max-w-md flex-col items-center justify-center rounded-xl bg-white p-8 shadow'>
				<h1 className='mb-4 text-2xl font-semibold'>Login to your Singlelink</h1>
				<p className='mb-6 text-gray-600 '>Enter your credentials to access your account</p>
				<input
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className='focus:border-gray-1 mb-4 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 outline-0 ring-offset-2 focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-50'
					type='password'
					placeholder='Password'
				/>
				<button
					onClick={() =>
						login[0]({
							variables: {
								password,
							},
						})
					}
					className='w-full rounded-xl bg-indigo-600 px-8 py-4 text-xl font-semibold text-white hover:bg-indigo-700'
				>
					Log in
				</button>
			</div>
			<div
				onClick={() => {
					alert(
						'To reset your password, change the environment variable for PASSWORD in your SSH or terminal and restart your application.'
					);
				}}
				className='mt-12 text-gray-600'
			>
				Forgot your password?
				<a className='ml-2 cursor-pointer font-semibold text-indigo-600 hover:text-indigo-700 hover:underline'>
					Reset password
				</a>
			</div>
			<div className='mt-4 text-xs text-gray-600'>
				Copyright ©{new Date().getFullYear()} Neutron Creative Inc. All rights reserved.
			</div>
		</div>
	);
};

export default Home;
