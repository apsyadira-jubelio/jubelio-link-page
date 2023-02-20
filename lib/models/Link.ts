import { Link as LinkType } from "../../hooks-generated";
import { dbSystem } from "../connection";

const Link = {
	list: async (): Promise<LinkType[]> => {
		const links = await dbSystem.query("select * from links order by position;");
		if (!links) throw Error("Failed to fetch links");
		return links;
	},
	findById: async (id: number): Promise<LinkType> => {
		const link = await dbSystem.query("select * from links where id=$1;", [id]);
		if (!link || !link[0]) throw Error("Failed to fetch link");
		return link[0];
	},
	updateById: async (params: {
		label: string;
		content: string;
		id: number;
		position: number;
		type: string;
	}): Promise<LinkType> => {
		const update = await dbSystem.query(`update links set label=$1, content=$2, position=$3, type=$4 where id=$5;`, [
			params.label,
			params.content,
			params.position,
			params.type,
			params.id,
		]);
		if (!update || update.affectedRows < 1) throw Error("Failed to update link");
		const link = await Link.findById(params.id);
		return link;
	},
	deleteById: async (id: number): Promise<void> => {
		const link = await Link.findById(id);
		if (!link) throw Error("Failed to find link for deletion");
		await dbSystem.one(`delete from links where id=$1;`, [id]);
	},
	findNextPosition: async (): Promise<number> => {
		const links = await Link.list();
		let highestPosition = 0;
		for (let i = 0; i < links.length; i++) {
			if (links[i].position > highestPosition) highestPosition = links[i].position;
		}
		return highestPosition + 1;
	},
	create: async (params: { label: string; content: string; type: string }): Promise<LinkType> => {
		const nextPosition = await Link.findNextPosition();
		console.log(`Inserting new link at position ${nextPosition}`);
		const inserted = await dbSystem.one(
			`insert into links (label, content, type, position) values($1, $2, $3, $4) returning id`,
			[params.label, params.content, params.type, nextPosition]
		);
		if (!inserted || inserted.id < 1) throw Error("Failed to create link");
		console.log(inserted);
		const link = Link.findById(inserted.id);
		if (!link) throw Error("Failed to find new link.");
		return link;
	},
	reorder: async (id: number, newIndex: number, oldIndex: number): Promise<LinkType[]> => {
		let queryResult = await dbSystem.query("select * from links order by position");

		if (queryResult.length < 1) throw Error("Links not found to reorder");

		let linkRows: LinkType[] = queryResult;
		let linkRow: LinkType | undefined;

		if (oldIndex >= 0 && oldIndex < linkRows.length && newIndex >= 0 && newIndex < linkRows.length) {
			if (oldIndex < linkRows.length) {
				linkRow = linkRows[oldIndex];
			}

			if (linkRow) {
				// Delete old index
				linkRows.splice(oldIndex, 1);

				// Insert at new index
				linkRows.splice(newIndex, 0, linkRow);
			}

			for (let i = 0; i < linkRows.length; i++) {
				linkRows[i].position = i;

				await dbSystem.query("update links set position=$1 where id=$2", [i, linkRows[i].id]);
			}
			let queryResult = await dbSystem.query("select * from links order by position");
			return queryResult;
		}
		return queryResult.rows;
	},
};

export default Link;
