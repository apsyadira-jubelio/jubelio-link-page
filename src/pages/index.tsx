/* eslint-disable @next/next/no-img-element */
import parse from 'html-react-parser';
import { NextPageContext } from 'next';
import Head from 'next/head';
import absoluteUrl from 'next-absolute-url';
import * as React from 'react';

import { createEvent, fetchLinks } from '@/service/http/graphql';

import { Link as LinkType } from '../hooks-generated';

const Home = ({ links }: { links: LinkType[] }) => {
	const [dataLinks, setDataLinks] = React.useState<LinkType[]>(links);

	React.useEffect(() => {
		window.addEventListener('message', (event) => {
			if (event.data.type === 'linksUpdated') {
				// Update the contents of the iframe with the new links data
				setDataLinks(event.data.links);
			}
		});
	}, []);

	if (!links || links.length === 0) {
		return (
			<div className='flex min-h-screen w-full flex-col items-center justify-center bg-gray-100'>
				<Head>
					<title>Jubelio Link</title>
					<meta name='description' content='Jubelio Link' />
					<link rel='icon' href='/favicon.ico' />
				</Head>

				<div className='flex w-full max-w-md flex-col items-center justify-center rounded-xl p-8 text-center'>
					<h1 className='mb-4 text-2xl font-semibold'>Welcome</h1>
				</div>
			</div>
		);
	}

	return (
		<>
			<Head>
				<title>{process.env.META_TITLE}</title>
				<meta name='title' content={process.env.META_TITLE} />
				<meta name='description' content={process.env.META_DESC} />

				<meta property='og:type' content='website' />
				<meta property='og:url' content='https://jubelio.com/' />
				<meta property='og:title' content={process.env.META_TITLE} />
				<meta property='og:description' content={process.env.META_DESC} />
				<meta property='og:image' content={process.env.META_IMG} />

				<meta property='twitter:card' content='summary_large_image' />
				<meta property='twitter:url' content='https://jubelio.com/' />
				<meta property='twitter:title' content={process.env.META_TITLE} />
				<meta property='twitter:description' content={process.env.META_DESC} />
				<meta property='twitter:image' content={process.env.META_IMG} />
			</Head>
			<div className='mx-auto flex w-full max-w-md flex-col items-center justify-center px-4 py-16'>
				{[...dataLinks].map((link) => {
					if (link?.type === 'text')
						return (
							<div
								id={`link-${link.id}`}
								className='mb-4 flex flex-col items-center justify-center text-center'
								key={link?.id}
							>
								<h1 className='mb-4 text-3xl font-semibold'>{link?.label}</h1>
								<h2 className='text-xl text-gray-600'>{link?.content}</h2>
							</div>
						);
					if (link?.type === 'link')
						return (
							<a
								id={`link-${link.id}`}
								href={`/api/link/${link?.id}` ?? '#'}
								className='mb-3 flex w-full flex-col rounded-lg bg-white px-3 py-5 text-center text-lg font-medium text-black shadow duration-300 ease-in-out hover:scale-105'
								key={link?.id}
							>
								{link?.label}
							</a>
						);
					if (link?.type === 'avatar')
						return (
							<div
								id={`link-${link.id}`}
								className='mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full'
								key={link?.id}
							>
								<img alt='User' src={link.content ?? '#'} width='100%' height='auto' />
							</div>
						);
					if (link?.type === 'youtube')
						return (
							<div id={`link-${link.id}`} key={link.id} className='embed-container rounded-lg'>
								<iframe src={link.content ?? '#'} frameBorder='0' allowFullScreen></iframe>
							</div>
						);
					if (link?.type === 'image')
						return (
							<img
								id={`link-${link.id}`}
								key={link.id}
								src={link.content ?? '#'}
								alt={link.label ?? ''}
								style={{ width: '100%', height: 'auto', marginBottom: 6 }}
							/>
						);
					if (link?.type === 'html')
						return (
							<div id={`link-${link.id}`} key={link.id}>
								{parse(link.content ?? '')}
							</div>
						);
				})}
				{process.env.BRANDING && (
					<div className='mt-10 text-center text-gray-600'>
						<a href='https://jubelio.com' className='font-medium text-indigo-600 hover:text-indigo-700 hover:underline'>
							Jubelio
						</a>
					</div>
				)}
			</div>
		</>
	);
};

export async function getServerSideProps(context: NextPageContext) {
	const { origin } = absoluteUrl(context.req);
	const links = await fetchLinks(origin);
	const isDemo = context.req?.url?.substr(context.req.url.length - 9) === 'demo=true';
	if (!isDemo) {
		await createEvent(origin, 'view');
	}
	return { props: { links } };
}

export default Home;
