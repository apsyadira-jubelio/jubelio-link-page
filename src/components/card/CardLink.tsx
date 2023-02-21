import { ChartBarIcon } from '@heroicons/react/24/outline';
import * as React from 'react';

import clsxm from '@/lib/clsxm';
import { Link as LinkType } from '@/hooks-generated';

import CardBase from '@/components/card/CardBase';

type CardLinkProps = {
	link: LinkType;
} & React.ComponentPropsWithoutRef<'div'>;

const CardLink: React.FC<CardLinkProps> = ({ className, link, ...rest }: CardLinkProps) => {
	return (
		<CardBase className={clsxm('flex items-center', className)} {...rest}>
			<svg
				width='16'
				height='16'
				viewBox='0 0 16 16'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				className=''
				role='img'
				aria-hidden='false'
				aria-labelledby='ltclid31_title '
			>
				<path
					fill-rule='evenodd'
					clip-rule='evenodd'
					d='M5 4C5.55228 4 6 3.55228 6 3C6 2.44772 5.55228 2 5 2C4.44772 2 4 2.44772 4 3C4 3.55228 4.44772 4 5 4ZM6 8C6 8.55228 5.55228 9 5 9C4.44772 9 4 8.55228 4 8C4 7.44772 4.44772 7 5 7C5.55228 7 6 7.44772 6 8ZM6 13C6 13.5523 5.55228 14 5 14C4.44772 14 4 13.5523 4 13C4 12.4477 4.44772 12 5 12C5.55228 12 6 12.4477 6 13ZM12 8C12 8.55228 11.5523 9 11 9C10.4477 9 10 8.55228 10 8C10 7.44772 10.4477 7 11 7C11.5523 7 12 7.44772 12 8ZM11 14C11.5523 14 12 13.5523 12 13C12 12.4477 11.5523 12 11 12C10.4477 12 10 12.4477 10 13C10 13.5523 10.4477 14 11 14ZM12 3C12 3.55228 11.5523 4 11 4C10.4477 4 10 3.55228 10 3C10 2.44772 10.4477 2 11 2C11.5523 2 12 2.44772 12 3Z'
					fill='currentColor'
				></path>
			</svg>
			<div className=''>
				{link?.label && <div className='mb-2 text-xl font-medium'>{link?.label}</div>}
				<div className='flex flex-row items-center justify-start space-x-4'>
					{/* <span className='capitalize'>{link?.type}</span> */}
					<a className='hover:text-indigo-600 hover:no-underline' href={link?.content ?? '#'}>
						{link?.content?.substring(0, 32) + '...' ?? 'N/A'}
					</a>
				</div>
				<div className='mt-9 flex text-gray-500'>
					<div className='flex gap-3'>
						<ChartBarIcon className='h-5 w-5' />
						<span>{Number(link.total_click)} Clicks</span>
					</div>
				</div>
			</div>
		</CardBase>
	);
};

export default CardLink;
