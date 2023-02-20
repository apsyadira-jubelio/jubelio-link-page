import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LinkIcon, ChartBarIcon, Cog8ToothIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import PreviewPage from "./PreviewPage";
const Dashboard = ({ children }: { children: any }) => {
	const [domain, setDomain] = useState<string>();

	const share = () => {
		navigator.clipboard.writeText(domain ?? "#");
		alert("URL copied to your clipboard!");
	};

	useEffect(() => {
		if (location.hostname === "localhost") return setDomain(`http://${window.location.host}`);
		setDomain(`https://${window.location.host}`);
	}, []);

	return (
		<div className="flex flex-row w-screen min-h-screen">
			<div className="fixed top-0 left-0 flex flex-col h-screen bg-white w-[350px] text-black">
				<div className="flex flex-col">
					<div className="flex flex-row items-center justify-start w-full px-8 py-2 bg-white">
						<div style={{ width: 170 }}>
							<Image height="100" width="200" src="/jubelio.png" alt="" />
						</div>
					</div>
					<ul className="p-8 m-0 space-y-2">
						<Link href="/dashboard/" passHref>
							<div className="flex flex-row items-center justify-start p-4 rounded-lg cursor-pointer hover:ring-4 hover:ring-opacity-50 hover:ring-indigo-600 hover:bg-indigo-600">
								<LinkIcon className="w-6 h-6" />
								<span className="ml-4 text-lg text-black">Links</span>
							</div>
						</Link>
						<Link href="/dashboard/analytics" passHref>
							<div className="flex flex-row items-center justify-start p-4 rounded-lg cursor-pointer hover:ring-4 hover:ring-opacity-50 hover:ring-indigo-600 hover:bg-indigo-600">
								<ChartBarIcon className="w-6 h-6" />
								<span className="ml-4 text-lg text-black">Analytics</span>
							</div>
						</Link>

						<Link href="/dashboard/settings" passHref>
							<div className="flex flex-row items-center justify-start p-4 rounded-lg cursor-pointer hover:ring-4 hover:ring-opacity-50 hover:ring-indigo-600 hover:bg-indigo-600">
								<Cog8ToothIcon className="w-6 h-6" />
								<span className="ml-4 text-lg text-black">Settings</span>
							</div>
						</Link>

						<Link href="/logout" passHref>
							<div className="flex flex-row items-center justify-start p-4 rounded-lg cursor-pointer hover:ring-4 hover:ring-opacity-50 hover:ring-indigo-600 hover:bg-indigo-600">
								<ArrowRightOnRectangleIcon className="w-6 h-6" />
								<span className="ml-4 text-lg text-black">Logout</span>
							</div>
						</Link>
					</ul>
				</div>
			</div>
			<div className="flex flex-col min-h-screen px-12 py-16" style={{ width: "calc(100% - 800px)", marginLeft: 350 }}>
				{children}
			</div>
			<PreviewPage domain={domain} share={share} />
		</div>
	);
};

export default Dashboard;
