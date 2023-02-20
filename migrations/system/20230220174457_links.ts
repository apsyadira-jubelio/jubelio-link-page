import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.raw(`
  CREATE TABLE IF NOT EXISTS links (
    id serial PRIMARY KEY,
    label TEXT,
    content TEXT,
    type TEXT NOT NULL,
    position INT NOT NULL
);`);
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("users");
}
