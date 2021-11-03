import knex from "./knex";
import appSearch from "../appSearch";
import { getTaskById } from "./listTasks";

export async function createTask(req, res) {
  if (!req.body || typeof req.body === "string") {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { title, assignee, points, labels } = req.body;

  let completed_at;
  if ("completed" in req.body) {
    if (req.body.completed === true) {
      completed_at = new Date();
    } else if (req.body.completed === false) {
      completed_at = null;
    }
  }

  const [taskId] = await knex
    .insert({ title, assignee, points, completed_at })
    .into("tasks");

  if (Array.isArray(labels)) {
    await setTaskLabels({ taskId, labels });
  }

  const taskDocument = await getTaskById(taskId);
  const appSearchResult = await appSearch.indexDocuments("tasks", [
    taskDocument,
  ]);

  res.status(201).end();
}

export async function updateTask(req, res) {
  if (!req.body || typeof req.body === "string") {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { title, assignee, points, labels } = req.body;

  let completed_at;
  if ("completed" in req.body) {
    if (req.body.completed === true) {
      completed_at = new Date();
    } else if (req.body.completed === false) {
      completed_at = null;
    }
  }

  const taskId = req.query.id;
  const updateResult = await knex("tasks")
    .where({ id: taskId })
    .update({ title, assignee, points, completed_at });

  if (updateResult === 0) {
    return res.status(404).end();
  }

  if (Array.isArray(labels)) {
    await setTaskLabels({ taskId, labels });
  }

  const taskDocument = await getTaskById(taskId);
  const appSearchResult = await appSearch.indexDocuments("tasks", [
    taskDocument,
  ]);

  res.status(200).end();
}

async function setTaskLabels({ taskId, labels }) {
  const existingLabelRecords = await knex
    .select("*")
    .from("labels")
    .whereIn("value", labels);
  const existingLabels = existingLabelRecords.map((record) => record.value);
  const newLabels = labels.filter((label) => !existingLabels.includes(label));

  // Create new labels, if any
  if (newLabels.length > 0) {
    await knex("labels").insert(newLabels.map((label) => ({ value: label })));
  }

  // Delete removed labels
  const taskLabelRecordsToDeleteQuery = knex
    .select("task_labels.label_id")
    .from("task_labels")
    .join("labels", "labels.id", "=", "task_labels.label_id")
    .where("task_labels.task_id", "=", taskId)
    .whereNotIn("labels.value", labels);

  await knex("task_labels")
    .where("task_id", "=", taskId)
    .whereIn("label_id", taskLabelRecordsToDeleteQuery)
    .delete();

  // Assign new task labels, if any
  const existingTaskLabelRecords = await knex
    .select("labels.value")
    .from("task_labels")
    .join("labels", "labels.id", "=", "task_labels.label_id")
    .where("task_labels.task_id", "=", taskId)
    .whereIn("labels.value", labels);
  const existingTaskLabels = existingTaskLabelRecords.map(
    (record) => record.value
  );
  const newTaskLabels = labels.filter(
    (label) => !existingTaskLabels.includes(label)
  );
  const newTaskLabelRecords = await knex
    .select("*")
    .from("labels")
    .whereIn("value", newTaskLabels);

  if (newTaskLabelRecords.length > 0) {
    await knex("task_labels").insert(
      newTaskLabelRecords.map((labelRecord) => ({
        task_id: taskId,
        label_id: labelRecord.id,
      }))
    );
  }
}
