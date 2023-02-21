import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Dashboard from '../../../components/dashboard';
import { useCreateLinkMutation } from '../../../hooks-generated';

const LinkDetail = () => {
	const router = useRouter();
	const [label, setLabel] = useState<string>();
	const [content, setContent] = useState<string>();
	const [type, setType] = useState<string>();
	const [loading, setLoading] = useState<boolean>(false);

	const createLink = useCreateLinkMutation({
		onCompleted: () => {
			router.push('/dashboard/');
		},
	});

	const create = async () => {
		setLoading(true);
		createLink[0]({
			variables: {
				label,
				content,
				type: type ?? 'link',
			},
		});
	};

	return (
		<Dashboard>
			<Head>
				<title>Create link | Singlelink</title>
			</Head>
			<h1 className='h1'>Create new link</h1>
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
						onClick={() => create()}
						className='mb-4 w-full rounded-xl bg-indigo-600 px-8 py-4 font-semibold text-white hover:bg-indigo-700'
					>
						Create link
					</button>
				</>
			) : (
				<div className='p-3 text-gray-600'>Creating link, please wait...</div>
			)}
		</Dashboard>
	);
};

export default LinkDetail;
