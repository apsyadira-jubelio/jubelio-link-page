/* eslint-disable @next/next/no-img-element */
import absoluteUrl from "next-absolute-url";
import Head from "next/head";
import Image from "next/image";
import { Link as LinkType } from "../hooks-generated";
const parse = require("html-react-parser");

const Home = ({ links }: { links: LinkType[] }) => {
	if (!links || links.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100">
				<Head>
					<title>Jubelio Link</title>
					<meta name="description" content="Jubelio Link" />
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<div className="flex flex-col items-center justify-center w-full max-w-md p-8 text-center rounded-xl">
					<h1 className="mb-4 text-2xl font-semibold">Welcome</h1>
				</div>
			</div>
		);
	}

	return (
		<>
			<Head>
				<title>{process.env.META_TITLE}</title>
				<meta name="title" content={process.env.META_TITLE} />
				<meta name="description" content={process.env.META_DESC} />

				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://jubelio.com/" />
				<meta property="og:title" content={process.env.META_TITLE} />
				<meta property="og:description" content={process.env.META_DESC} />
				<meta property="og:image" content={process.env.META_IMG} />

				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://jubelio.com/" />
				<meta property="twitter:title" content={process.env.META_TITLE} />
				<meta property="twitter:description" content={process.env.META_DESC} />
				<meta property="twitter:image" content={process.env.META_IMG} />
			</Head>
			<div className="flex flex-col items-center justify-center w-full max-w-md px-4 py-16 mx-auto">
				{[...links].map((link) => {
					if (link?.type === "text")
						return (
							<div
								id={`link-${link.id}`}
								className="flex flex-col items-center justify-center mb-4 text-center"
								key={link?.id}
							>
								<h1 className="mb-4 text-3xl font-semibold">{link?.label}</h1>
								<h2 className="text-xl text-gray-600">{link?.content}</h2>
							</div>
						);
					if (link?.type === "vanilla")
						return (
							<a
								id={`link-${link.id}`}
								href={`/api/link/${link?.id}` ?? "#"}
								className="flex flex-col w-full px-3 py-5 mb-3 text-lg font-medium text-center text-black duration-300 ease-in-out bg-white rounded-lg shadow hover:scale-105"
								key={link?.id}
							>
								{link?.label}
							</a>
						);
					if (link?.type === "avatar")
						return (
							<div
								id={`link-${link.id}`}
								className="flex items-center justify-center w-24 h-24 mb-6 overflow-hidden rounded-full"
								key={link?.id}
							>
								<img alt="User" src={link.content ?? "#"} width="100%" height="auto" />
							</div>
						);
					if (link?.type === "youtube")
						return (
							<div id={`link-${link.id}`} key={link.id} className="rounded-lg embed-container">
								<iframe src={link.content ?? "#"} frameBorder="0" allowFullScreen></iframe>
							</div>
						);
					if (link?.type === "image")
						return (
							<img
								id={`link-${link.id}`}
								key={link.id}
								src={link.content ?? "#"}
								alt={link.label ?? ""}
								style={{ width: "100%", height: "auto", marginBottom: 6 }}
							/>
						);
					if (link?.type === "html")
						return (
							<div id={`link-${link.id}`} key={link.id}>
								{parse(link.content)}
							</div>
						);
				})}
				{process.env.BRANDING && (
					<div className="mt-10 text-center text-gray-600">
						<a href="https://jubelio.com" className="font-medium text-indigo-600 hover:underline hover:text-indigo-700">
							Jubelio
						</a>
					</div>
				)}
			</div>
		</>
	);
};

export async function getServerSideProps({ req }: { req: any }) {
	const { origin } = absoluteUrl(req);
	const res = await fetch(`${origin}/api/graphql`, {
		headers: {
			accept: "application/json",
			"content-type": "application/json",
		},
		body: '{"operationName":"listLinks","variables":{},"query":"query listLinks {\\n  listLinks {\\n    id\\n    label\\n    content\\n    type\\n    position\\n    __typename\\n  }\\n}\\n"}',
		method: "POST",
	});
	const data = await res.json();
	const links: LinkType[] = data.data.listLinks;
	if (req.url.substr(req.url.length - 9) != "demo=true") {
		// Create view if viewed by guest
		await fetch(`${origin}/api/graphql`, {
			headers: {
				accept: "application/json",
				"accept-language": "en-US,en;q=0.9",
				"content-type": "application/json",
				"sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Windows"',
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				Referer: "http://localhost:3000/",
				"Referrer-Policy": "strict-origin-when-cross-origin",
			},
			body: '{"operationName":"createEvent","variables":{"type":"view"},"query":"mutation createEvent($type: EVENT_TYPE) {\\n  createEvent(type: $type) {\\n    id\\n    type\\n    created_at\\n    __typename\\n  }\\n}\\n"}',
			method: "POST",
		});
	}
	return { props: { links } };
}

export default Home;
