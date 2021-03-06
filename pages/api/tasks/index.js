import { setup as databaseSetup } from "../../../lib/db/knex";
import { listAllTasks } from "../../../lib/db/listTasks";
import { createTask } from "../../../lib/db/manageTasks";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await createTask(req, res);
    return;
  }

  if (req.method === "GET") {
    try {
      await databaseSetup();
    } catch (error) {
      console.error("Unexpected error when setting up database", error);
    }

    const result = await listAllTasks();
    return res.json(result);
  }

  res.status(404).end();
}
