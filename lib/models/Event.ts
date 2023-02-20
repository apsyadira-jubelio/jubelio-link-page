import { dbSystem } from "../connection";

const Event = {
	create: async (type: "click" | "view", link_id?: string) => {
		const insert = !link_id
			? await dbSystem.one(`insert into events (type) values($1) returning id`, [type])
			: await dbSystem.one(`insert into events (type, link_id) values($1, $2) returning id;`, ["click", link_id]);
		if (!insert || insert.id < 1) throw Error("Failed to create link");
		const event = await dbSystem.query(`select * from events where id=$1`, [insert.id]);
		return event[0];
	},
	fetchOverview: async () => {
		const overview = await dbSystem.query(`
        SELECT
            COUNT(CASE WHEN type = 'view' THEN 1 ELSE NULL END) AS views,
            COUNT(CASE WHEN type = 'click' THEN 1 ELSE NULL END) AS clicks,
            DATE_TRUNC('day', created_at) AS date
        FROM events
        WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE_TRUNC('day', created_at);
        `);

		if (!overview) throw Error("Failed to fetch overview");
		return overview;
	},
};

export default Event;
