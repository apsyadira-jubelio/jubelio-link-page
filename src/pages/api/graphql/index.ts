/* eslint-disable @typescript-eslint/no-var-requires */
// Import third-party dependencies
import { ApolloServer } from 'apollo-server-micro';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';
const cors = require('micro-cors')(); // highlight-line

// Import first-party dependencies
import jwt from 'jsonwebtoken';

import { Mutation } from './mutations';
import { Query } from './queries';
import { typeDefs } from './type-defs';

export const resolvers = {
	Mutation,
	Query,
	//...Resolvers
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => {
		if (req.headers.authorization) {
			const token = req.headers.authorization.substr(7, req.headers.authorization.length - 7) || '';
			try {
				const decoded = jwt.verify(token, process.env.SECRET || '');
				return { isAuthorized: true, data: decoded };
			} catch {
				return { isAuthorized: false };
			}
		} else return {};
	},
});

const startServer = server.start();

export const config = {
	api: {
		bodyParser: false,
	},
};

export default cors(async (req: MicroRequest, res: ServerResponse) => {
	if (req.method === 'OPTIONS') {
		res.end();
		return false;
	}

	await startServer;
	await server.createHandler({ path: '/api/graphql' })(req, res);
});
