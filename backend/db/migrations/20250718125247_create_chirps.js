/**
 * @param {import('knex')} knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('chirps', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.text('content').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param {import('knex')} knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('chirps');
};
