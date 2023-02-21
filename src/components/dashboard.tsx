import { useEffect, useState } from 'react';

import Sidebar from './layouts/Sidebar';
import PreviewPage from './PreviewPage';

const Dashboard = ({ children }: { children: React.ReactNode }) => {
	const [domain, setDomain] = useState<string>();

	const share = () => {
		navigator.clipboard.writeText(domain ?? '#');
		alert('URL copied to your clipboard!');
	};

	useEffect(() => {
		if (location.hostname === 'localhost')
			return setDomain(`http://${window.location.host}`);
		setDomain(`https://${window.location.host}`);
	}, []);

	return (
		<div className='flex min-h-screen w-screen flex-row'>
			<Sidebar />
			<div
				className='flex min-h-screen flex-col px-12 py-16'
				style={{ width: 'calc(100% - 800px)', marginLeft: 350 }}
			>
				{children}
			</div>
			<PreviewPage domain={domain} share={share} />
		</div>
	);
};

export default Dashboard;
