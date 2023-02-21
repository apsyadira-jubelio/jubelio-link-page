import Promise from "bluebird";
import pgPromise from "pg-promise";
import pg, { IClient } from "pg-promise/typescript/pg-subset";

/**
 * Params for connection
 */
const systemDb: pg.IConnectionParameters<IClient> = {
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	idleTimeoutMillis: 60000,
	max: 50,
};

/**
 * Create a connection pool
 */
const dbSysConnection = pgPromise({
	promiseLib: Promise,
});

export const dbSystem = dbSysConnection(systemDb);
export const PgHelpers = dbSysConnection.helpers;
