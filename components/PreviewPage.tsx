import * as React from "react";

type PreviewPageProps = {
	domain: string | undefined;
	share: () => void;
};

const PreviewPage: React.FC<PreviewPageProps> = ({ domain, share }: PreviewPageProps) => {
	return (
		<div
			className="fixed top-0 right-0 flex flex-col items-center justify-between h-screen bg-white"
			style={{ width: 450, borderLeft: "solid 1px rgba(0,0,0,0.15)" }}
		>
			<div
				className="flex flex-row items-center justify-between w-full px-4 py-6"
				style={{ borderBottom: "solid 1px rgba(0,0,0,0.15)" }}
			>
				<div className="flex flex-row items-center justify-start">
					<svg
						className="w-4 h-4 mr-3"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					<div>Page preview:</div>
				</div>
				<select className="p-2 px-4 rounded-lg">
					<option>iPhone 12</option>
				</select>
			</div>
			<div
				className="flex items-center justify-center"
				style={{
					width: 375,
					height: 950,
					transform: "scale(.8)",
					borderRadius: 65,
					backgroundColor: "#000",
				}}
			>
				<div style={{ width: 347, height: 680, borderRadius: 50, overflow: "hidden" }}>
					{domain && <iframe id="singlelink-preview" width={347} height={680} src={domain + "?demo=true"}></iframe>}
				</div>
			</div>
			<div
				className="flex flex-row items-center justify-center w-full p-4 text-center"
				style={{ borderTop: "solid 1px rgba(0,0,0,.15)" }}
			>
				Share your JubelioLink:
				<a href={domain} className="ml-2 mr-6 font-semibold text-indigo-600">
					{domain}
				</a>
				<svg
					onClick={() => share()}
					className="w-4 h-4 cursor-pointer"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
					></path>
				</svg>
			</div>
		</div>
	);
};

export default PreviewPage;
