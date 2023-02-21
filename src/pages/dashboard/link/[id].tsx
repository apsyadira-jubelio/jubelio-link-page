import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Dashboard from '../../../components/dashboard';
import { useDeleteLinkByIdMutation, useFindLinkByIdQuery, useUpdateLinkByIdMutation } from '../../../hooks-generated';

const LinkDetail = () => {
	const router = useRouter();
	const { id } = router.query;
	const [label, setLabel] = useState<string>();
	const [content, setContent] = useState<string>();
	const [type, setType] = useState<string>();
	const [position, setPosition] = useState<number>();
	const [loading, setLoading] = useState<boolean>(true);

	useFindLinkByIdQuery({
		variables: {
			id: Number.parseInt((id as string) ?? ''),
		},
		onCompleted: (data) => {
			if (!data.findLinkById?.id || !data.findLinkById?.type) throw Error('Singlelink: DB model invalid.');
			setLoading(false);
			setLabel(data.findLinkById.label ?? '');
			setContent(data.findLinkById.content ?? '');
			setType(data.findLinkById.type ?? 'link');
			setPosition(data.findLinkById.position);
		},
	});

	const updateLinkById = useUpdateLinkByIdMutation({
		onCompleted: () => {
			setLoading(false);
			if (!document.getElementById('singlelink-preview')) return;
			const iframe: HTMLIFrameElement = document.getElementById('singlelink-preview') as HTMLIFrameElement;
			// eslint-disable-next-line no-self-assign
			iframe.src = iframe.src;
		},
	});

	const deleteLinkById = useDeleteLinkByIdMutation({
		onCompleted: () => {
			router.push('/dashboard');
		},
	});

	const attemptSave = async () => {
		if (position === undefined || position < 0 || !type || !id)
			throw Error('Cannot save without position, type, or id.');
		setLoading(true);
		updateLinkById[0]({
			variables: {
				label,
				content,
				position,
				type,
				id: Number.parseInt(id as string),
			},
		});
	};

	const attemptDelete = async () => {
		setLoading(true);
		deleteLinkById[0]({
			variables: {
				id: Number.parseInt(id as string),
			},
		});
	};

	return (
		<Dashboard>
			<Head>
				<title>Edit link | Singlelink</title>
			</Head>
			<h1 className='h1'>Edit link</h1>
			{!loading ? (
				<>
					<div className='mb-6 flex flex-col space-y-2'>
						<label className='text-lg font-semibold text-gray-800'>Label</label>
						<input
							onChange={(e) => setLabel(e.target.value)}
							value={label ?? ''}
							className='focus:border-gray-1 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 outline-0 ring-offset-2 focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-50'
							type='text'
							placeholder='e.g. My Instagram profile'
						/>
					</div>
					<div className='mb-6 flex flex-col space-y-2'>
						<label className='text-lg font-semibold text-gray-800'>Type</label>
						<select
							onChange={(e) => setType(e.target.value)}
							value={type}
							className='focus:border-gray-1 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 outline-0 ring-offset-2 focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-50'
						>
							<option value='link'>Link</option>
							<option value='image'>Image</option>
							<option value='youtube'>Youtube</option>
							<option value='text'>Text</option>
							<option value='avatar'>Avatar</option>
							<option value='html'>HTML/Code embed</option>
						</select>
					</div>
					<div className='mb-6 flex flex-col space-y-2'>
						<label className='text-lg font-semibold text-gray-800'>Content URL</label>
						<input
							onChange={(e) => setContent(e.target.value)}
							value={content ?? ''}
							className='focus:border-gray-1 w-full rounded-lg border border-gray-200 bg-white px-5 py-3 outline-0 ring-offset-2 focus:ring-4 focus:ring-indigo-600 focus:ring-opacity-50'
							type='text'
							placeholder='e.g. https://instagram.com/neutroncreative'
						/>
					</div>
					<button
						onClick={() => attemptSave()}
						className='mb-4 w-full rounded-xl bg-indigo-600 px-8 py-4 font-semibold text-white hover:bg-indigo-700'
					>
						Save changes
					</button>
					<button
						onClick={() => attemptDelete()}
						className='w-full rounded-xl border border-red-600 bg-red-100 px-8 py-4 font-semibold text-red-600 hover:bg-red-600 hover:text-white'
					>
						Delete link
					</button>
				</>
			) : (
				<div className='p-3 text-gray-600'>Loading, please wait...</div>
			)}
		</Dashboard>
	);
};

export default LinkDetail;
