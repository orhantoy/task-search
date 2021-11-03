import knex from "./knex";

export async function listAllTasks() {
  const tasksQuery = knex.select("*").from("tasks").orderBy("id", "desc");

  return await listTasks(tasksQuery);
}

export async function getTaskById(id) {
  const tasksQuery = knex.select("*").from("tasks").where({ id });
  const tasks = await listTasks(tasksQuery);
  return tasks[0];
}

export async function listTasks(tasksQuery) {
  const tasks = await tasksQuery;

  const allTaskLabels = await knex
    .select("task_labels.task_id", "labels.value")
    .from("task_labels")
    .join("labels", "labels.id", "=", "task_labels.label_id")
    .whereIn(
      "task_labels.task_id",
      tasks.map((task) => task.id)
    )
    .orderBy(["labels.value"]);

  const results = tasks.map((task) => {
    const taskLabels = allTaskLabels.reduce((acc, labelRecord) => {
      if (labelRecord.task_id === task.id) {
        return [...acc, labelRecord.value];
      }

      return acc;
    }, []);

    return {
      id: task.id,
      title: task.title,
      assignee: task.assignee,
      points: task.points,
      completed: !!task.completed_at,
      labels: taskLabels,
    };
  });

  return results;
}
