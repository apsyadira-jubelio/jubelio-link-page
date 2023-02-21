/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import {
	Link as LinkType,
	ReorderLinkMutation,
	useListLinksQuery,
	useReorderLinkMutation,
	useVerifyMutation,
} from '@/hooks-generated';

import CardLink from '@/components/card/CardLink';
import Dashboard from '@/components/dashboard';

const DashboardLinks = () => {
	const [links, setLinks] = useState<LinkType[]>([]);
	const router = useRouter();

	useListLinksQuery({
		fetchPolicy: 'no-cache',
		onCompleted: (data) => {
			if (!data.listLinks) return;
			setLinks(data.listLinks as LinkType[]);
		},
	});

	useVerifyMutation({
		onCompleted: (data) => {
			if (data?.verify) {
				localStorage.setItem('jwt', data?.verify);
			} else {
				localStorage.setItem('jwt', '');
				return router.push('/login');
			}
		},
	});

	const handleReorderCompleted = (data: ReorderLinkMutation) => {
		if (!data.reorderLink) return;
		setLinks(data.reorderLink as LinkType[]);

		const iframe = document.getElementById('singlelink-preview') as HTMLIFrameElement;
		if (!iframe) return;

		iframe.contentWindow?.postMessage({ type: 'linksUpdated', links: data.reorderLink }, '*');
	};

	const reorder = useReorderLinkMutation({
		onCompleted: handleReorderCompleted,
	});

	const reorderLinks = async (result: DropResult) => {
		const id = Number.parseInt(result.draggableId ?? '');
		const newIndex = result.destination?.index ?? -1;
		const oldIndex = result.source.index;

		const { source, destination } = result;
		// If the user dropped the item outside of a droppable area, or in the same position, do nothing
		if (!destination || (source.index === destination.index && source.droppableId === destination.droppableId)) {
			return;
		}

		// Update the links array directly based on the new order of items
		const newLinks = [...links];
		const [removed] = newLinks.splice(source.index, 1);
		newLinks.splice(destination.index, 0, removed);

		// Update the state with the new links array
		setLinks(newLinks as LinkType[]);

		if (id && newIndex >= 0 && oldIndex >= 0) {
			await attemptReorder(id, newIndex, oldIndex);
		}
	};

	const attemptReorder = async (id: number, newIndex: number, oldIndex: number) => {
		try {
			await reorder[0]({
				variables: {
					id,
					newIndex,
					oldIndex,
				},
			});
		} catch (error) {
			// console.log('Error reordering links:', error);
		}
	};

	useEffect(() => {
		if (!localStorage.getItem('jwt')) {
			router.push('/login');
		}
	}, [router]);

	return (
		<Dashboard>
			<Head>
				<title>Dashboard - Singlelink</title>
			</Head>
			<div className='h1-row mb-8 flex w-full flex-row items-center justify-between'>
				<h1 className='h1'>Links</h1>
				<Link href='/dashboard/link/create' passHref>
					<button className='flex cursor-pointer flex-row items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700'>
						<svg
							className='mr-2 h-4 w-4'
							fill='none'
							stroke='rgba(255,255,255,1)'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6'></path>
						</svg>
						Add new
					</button>
				</Link>
			</div>
			<DragDropContext onDragEnd={reorderLinks}>
				<Droppable droppableId='links'>
					{(provided) => (
						<ul
							className='links flex flex-col gap-5'
							{...provided.droppableProps}
							ref={provided.innerRef}
							style={{ width: '100%' }}
						>
							{(links ?? []).map((link, i) => (
								<Draggable draggableId={(link?.id ?? 0).toString()} key={link?.id} index={i}>
									{(provided) => (
										<li
											{...provided.draggableProps}
											ref={provided.innerRef}
											{...provided.dragHandleProps}
											onClick={() => router.push(`/dashboard/link/${link?.id}`)}
										>
											<CardLink link={link} />
										</li>
									)}
								</Draggable>
							))}
						</ul>
					)}
				</Droppable>
			</DragDropContext>
		</Dashboard>
	);
};

export default DashboardLinks;
