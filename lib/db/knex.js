let knex = null;
let setupDone = false;

export async function setup() {
  if (setupDone) {
    return;
  }

  const exists = await knex.schema.hasTable("tasks");

  if (!exists) {
    await knex.schema.createTable("tags", function (t) {
      t.increments("id").primary();
      t.string("value", 255);
    });

    await knex.schema.createTable("tasks", function (t) {
      t.increments("id").primary();
      t.string("title", 255);
      t.string("assignee", 255);
      t.datetime("completed_at");
      t.integer("points").unsigned();
    });

    await knex.schema.createTable("task_tags", function (t) {
      t.integer("task_id").unsigned().notNullable();
      t.foreign("task_id").references("id").inTable("tasks");
      t.integer("tag_id").unsigned().notNullable();
      t.foreign("tag_id").references("id").inTable("tags");
    });
  }

  setupDone = true;
}

if (knex === null) {
  knex = require("knex")({
    client: "sqlite3",
    connection: () => ({
      filename: process.env.SQLITE_FILENAME || "tasks.db",
    }),
    useNullAsDefault: true,
  });
}

export default knex;
