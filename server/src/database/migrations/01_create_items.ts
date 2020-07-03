import Knex from 'knex';

export async function up(Knex: Knex) {
	return Knex.schema.createTable('items', table => {
		table.increments('id').primary();
		table.string('image').notNullable();
		table.string('url');
		table.string('title').notNullable();
	});
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('items');
}
