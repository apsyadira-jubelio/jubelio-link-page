import Event from '../../../../lib/models/Event';
import Link from '../../../../lib/models/Link';

export const Query = {
	hello: async () => {
		return 'hello';
	},
	listLinks: async (_: unknown, _params: unknown, context: { isAuthorized: boolean }) => {
		if (context.isAuthorized === false) throw Error('Must be authorized to use the Dashboard.');
		const links = await Link.list();
		return links;
	},
	findLinkById: async (_: unknown, { id }: { id: number }, context: { isAuthorized: boolean }) => {
		if (!context.isAuthorized) throw Error('Must be authorized to use the Dashboard.');
		const link = await Link.findById(id);
		return link;
	},
	fetchOverview: async (_: unknown, _params: unknown, context: { isAuthorized: boolean }) => {
		if (!context.isAuthorized) throw Error('Must be authorized to use the Dashboard.');
		const overview = await Event.fetchOverview();
		return overview;
	},
};
