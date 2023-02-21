import Head from 'next/head';
import { useState } from 'react';

import { FetchOverviewQuery, Overview, useFetchOverviewQuery } from '@/hooks-generated';

import CardBase from '@/components/card/CardBase';
import Dashboard from '@/components/dashboard';

const Analytics = () => {
	const [todayViews, setTodayViews] = useState<number>(0);
	const [todayClicks, setTodayClicks] = useState<number>(0);
	const [weeklyViews, setWeeklyViews] = useState<number>(0);
	const [weeklyClicks, setWeeklyClicks] = useState<number>(0);

	const overview = useFetchOverviewQuery({
		onCompleted: (data: FetchOverviewQuery) => {
			const weekly = {
				views: 0,
				clicks: 0,
			};
			if (!data.fetchOverview) throw Error('Fetch Overview not found');
			data.fetchOverview.map((analytics) => {
				weekly.views += analytics ? analytics.views : 0;
				weekly.clicks += analytics ? analytics.clicks : 0;
			});
			if (data.fetchOverview.length > 0) {
				setTodayViews((data.fetchOverview[data.fetchOverview.length - 1] as Overview).views);
				setTodayClicks((data.fetchOverview[data.fetchOverview.length - 1] as Overview).clicks);
			}
			setWeeklyViews(weekly.views);
			setWeeklyClicks(weekly.clicks);
		},
	});

	return (
		<Dashboard>
			<Head>
				<title>Analytics - Singlelink</title>
			</Head>
			<h1 className='h1'>Analytics</h1>
			{overview.data ? (
				<div>
					<CardBase className='mb-6'>
						<div className='font-medium text-gray-600'>Click-through rate (CTR)</div>
						<div className='mt-2 text-3xl font-semibold text-indigo-600'>
							{weeklyViews > 1 ? `${((weeklyClicks / weeklyViews) * 100).toFixed(2)} %` : '0%'}
						</div>
					</CardBase>
					<div className='grid w-full grid-cols-1 gap-5 2xl:grid-cols-2'>
						<CardBase className='mb-6'>
							<div className='font-medium text-gray-600'>Today&#39;s views</div>
							<div className='mt-2 text-3xl font-semibold text-indigo-600'>
								{(todayViews ?? 0).toLocaleString('en-US')}
							</div>
						</CardBase>
						<CardBase className='mb-6'>
							<div className='font-medium text-gray-600'>Today&#39;s clicks</div>
							<div className='mt-2 text-3xl font-semibold text-indigo-600'>
								{(todayClicks ?? 0).toLocaleString('en-US')}
							</div>
						</CardBase>
					</div>
					<div className='grid w-full grid-cols-1 gap-5 2xl:grid-cols-2'>
						<CardBase>
							<div className='font-medium text-gray-600'>Weekly views</div>
							<div className='mt-2 text-3xl font-semibold text-indigo-600'>
								{(weeklyViews ?? 0).toLocaleString('en-US')}
							</div>
						</CardBase>
						<CardBase>
							<div className='font-medium text-gray-600'>Weekly clicks</div>
							<div className='mt-2 text-3xl font-semibold text-indigo-600'>
								{(weeklyClicks ?? 0).toLocaleString('en-US')}
							</div>
						</CardBase>
					</div>
				</div>
			) : (
				<div className='p-3 text-gray-600'>Loading, please wait...</div>
			)}
		</Dashboard>
	);
};

export default Analytics;
