import { ArrowRightOnRectangleIcon, ChartBarIcon, Cog8ToothIcon, LinkIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

type SidebarProps = React.ComponentPropsWithoutRef<'div'>;

const Sidebar: React.FC<SidebarProps> = ({ className, ...rest }: SidebarProps) => {
	const router = useRouter();

	return (
		<div className={clsxm('', className)} {...rest}>
			<div className='fixed top-0 left-0 flex h-screen w-[350px] flex-col bg-white text-black'>
				<div className='flex flex-col'>
					<div className='flex w-full flex-row items-center justify-start bg-white px-8 py-2'>
						<div style={{ width: 170 }}>
							<Image height='100' width='200' src='/jubelio.png' alt='' />
						</div>
					</div>
					<ul className='m-0 space-y-2 p-8'>
						<Link href='/dashboard/' passHref>
							<div
								className={clsxm(
									'flex cursor-pointer flex-row',
									'items-center justify-start',
									'rounded-lg p-4',
									'hover:bg-indigo-600 hover:text-white hover:ring-opacity-50',
									router.pathname === '/dashboard' ? 'bg-indigo-600 text-white' : null
								)}
							>
								<LinkIcon className='h-6 w-6' />
								<span className='ml-4 text-lg '>Links</span>
							</div>
						</Link>
						<Link href='/dashboard/analytics' passHref>
							<div
								className={clsxm(
									'flex cursor-pointer flex-row',
									'items-center justify-start',
									'rounded-lg p-4',
									'hover:bg-indigo-600 hover:text-white hover:ring-opacity-50',
									router.pathname === '/dashboard/analytics' ? 'bg-indigo-600 text-white' : null
								)}
							>
								<ChartBarIcon className='h-6 w-6' />
								<span className='ml-4 text-lg '>Analytics</span>
							</div>
						</Link>

						<Link href='/dashboard/settings' passHref>
							<div className='flex cursor-pointer flex-row items-center justify-start rounded-lg p-4 hover:bg-indigo-600 hover:text-white hover:ring-opacity-50'>
								<Cog8ToothIcon className='h-6 w-6' />
								<span className='ml-4 text-lg '>Settings</span>
							</div>
						</Link>

						<Link href='/logout' passHref>
							<div className='flex cursor-pointer flex-row items-center justify-start rounded-lg p-4 hover:bg-indigo-600 hover:text-white hover:ring-opacity-50'>
								<ArrowRightOnRectangleIcon className='h-6 w-6' />
								<span className='ml-4 text-lg '>Logout</span>
							</div>
						</Link>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
