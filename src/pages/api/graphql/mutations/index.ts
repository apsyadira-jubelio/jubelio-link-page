import jwt from 'jsonwebtoken';

import { MutationLoginArgs } from '../../src/generated-types';
import Event from '../../../../lib/models/Event';
import Link from '../../../../lib/models/Link';

export const Mutation = {
	login: async (_: unknown, { password }: MutationLoginArgs, _context: unknown) => {
		if (password === process.env.PASSWORD) {
			const token = jwt.sign({}, process.env.SECRET as string, {
				expiresIn: '24h',
			});
			// Return jwt
			return token;
		} else {
			throw Error(`Incorrect password provided, please try again.`);
		}
	},
	verify: async (_: unknown, params: { jwt: any }, _context: unknown) => {
		const decoded = jwt.verify(params.jwt, process.env.SECRET as string);
		return params.jwt;
	},
	createLink: async (
		_: unknown,
		params: { label: string; content: string; type: string },
		{ isAuthorized }: { isAuthorized: boolean }
	) => {
		if (!isAuthorized) throw Error('Must be authorized to use the Dashboard.');
		const link = await Link.create(params);
		return link;
	},
	updateLinkById: async (
		_: unknown,
		params: {
			label: string;
			content: string;
			id: number;
			position: number;
			type: string;
		},
		{ isAuthorized }: { isAuthorized: boolean }
	) => {
		if (!isAuthorized) throw Error('Must be authorized to use the Dashboard.');
		const updatedLink = Link.updateById(params);
		return updatedLink;
	},
	deleteLinkById: async (_: unknown, { id }: { id: number }, { isAuthorized }: { isAuthorized: boolean }) => {
		if (!isAuthorized) throw Error('Must be authorized to use the Dashboard.');
		Link.deleteById(id);
		return;
	},
	reorderLink: async (
		_: unknown,
		{ id, newIndex, oldIndex }: { id: number; newIndex: number; oldIndex: number },
		{ isAuthorized }: { isAuthorized: boolean }
	) => {
		if (!isAuthorized) throw Error('Must be authorized to use the Dashboard.');
		const links = await Link.reorder(id, newIndex, oldIndex);
		return links;
	},
	createEvent: async (_: unknown, { type }: { type: 'view' | 'click' }, context: { isAuthorized: boolean }) => {
		const event = await Event.create(type);
		return event;
	},
};
