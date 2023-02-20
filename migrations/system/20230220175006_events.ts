import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.raw(`
    CREATE TYPE type_action AS ENUM ('view', 'click');
    CREATE TABLE IF NOT EXISTS events (
      id serial PRIMARY KEY,
      type type_action,
      created_at timestamp with time zone default now(),
      link_id int,
      CONSTRAINT links_events_id_fkey FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("events");
}
