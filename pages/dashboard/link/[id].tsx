import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Dashboard from "../../../components/dashboard";
import { useDeleteLinkByIdMutation, useFindLinkByIdQuery, useUpdateLinkByIdMutation } from "../../../hooks-generated";
import { Link } from "../../api/src/generated-types";

const LinkDetail = () => {
	const router = useRouter();
	const { id } = router.query;
	const [label, setLabel] = useState<string>();
	const [content, setContent] = useState<string>();
	const [type, setType] = useState<string>();
	const [position, setPosition] = useState<number>();
	const [loading, setLoading] = useState<boolean>(true);

	const useFindLinkById = useFindLinkByIdQuery({
		variables: {
			id: Number.parseInt((id as string) ?? ""),
		},
		onCompleted: (data) => {
			if (!data.findLinkById?.id || !data.findLinkById?.type) throw Error("Singlelink: DB model invalid.");
			setLoading(false);
			setLabel(data.findLinkById.label ?? "");
			setContent(data.findLinkById.content ?? "");
			setType(data.findLinkById.type ?? "vanilla");
			setPosition(data.findLinkById.position);
		},
	});

	const updateLinkById = useUpdateLinkByIdMutation({
		onCompleted: (data) => {
			setLoading(false);
			if (!document.getElementById("singlelink-preview")) return;
			let iframe: HTMLIFrameElement = document.getElementById("singlelink-preview") as HTMLIFrameElement;
			iframe.src = iframe.src;
		},
	});

	const deleteLinkById = useDeleteLinkByIdMutation({
		onCompleted: () => {
			router.push("/dashboard");
		},
	});

	const attemptSave = async () => {
		if (position === undefined || position < 0 || !type || !id)
			throw Error("Cannot save without position, type, or id.");
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
			<h1 className="h1">Edit link</h1>
			{!loading ? (
				<>
					<div className="flex flex-col mb-6 space-y-2">
						<label className="text-lg font-semibold text-gray-800">Label</label>
						<input
							onChange={(e) => setLabel(e.target.value)}
							value={label ?? ""}
							className="w-full px-5 py-3 bg-white border border-gray-200 rounded-lg focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-1"
							type="text"
							placeholder="e.g. My Instagram profile"
						/>
					</div>
					<div className="flex flex-col mb-6 space-y-2">
						<label className="text-lg font-semibold text-gray-800">Type</label>
						<select
							onChange={(e) => setType(e.target.value)}
							value={type}
							className="w-full px-5 py-3 bg-white border border-gray-200 rounded-lg focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-1"
						>
							<option value="vanilla">Vanilla</option>
							<option value="image">Image</option>
							<option value="youtube">Youtube</option>
							<option value="text">Text</option>
							<option value="avatar">Avatar</option>
							<option value="html">HTML/Code embed</option>
						</select>
					</div>
					<div className="flex flex-col mb-6 space-y-2">
						<label className="text-lg font-semibold text-gray-800">Content URL</label>
						<input
							onChange={(e) => setContent(e.target.value)}
							value={content ?? ""}
							className="w-full px-5 py-3 bg-white border border-gray-200 rounded-lg focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-1"
							type="text"
							placeholder="e.g. https://instagram.com/neutroncreative"
						/>
					</div>
					<button
						onClick={() => attemptSave()}
						className="w-full px-8 py-4 mb-4 font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
					>
						Save changes
					</button>
					<button
						onClick={() => attemptDelete()}
						className="w-full px-8 py-4 font-semibold text-red-600 bg-red-100 border border-red-600 rounded-xl hover:bg-red-600 hover:text-white"
					>
						Delete link
					</button>
				</>
			) : (
				<div className="p-3 text-gray-600">Loading, please wait...</div>
			)}
		</Dashboard>
	);
};

export default LinkDetail;
