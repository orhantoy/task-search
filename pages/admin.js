import { useCallback, useEffect, useState } from "react";
import EditTask from "../components/EditTask";

export default function Admin() {
  const [tasks, refreshTasks] = useTasks([]);
  const [editingTasks, startEditing, stopEditing] = useEditingTasks({});
  const [newTask, setNewTask] = useState({});

  const newTaskOnChange = useCallback(
    (field, value) => {
      setNewTask((prevState) => ({ ...prevState, [field]: value }));
    },
    [setNewTask]
  );

  const newTaskOnSubmit = useCallback(() => {
    fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(normalizeRequestBody(newTask)),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 201) {
        return refreshTasks().then(() => setNewTask({}));
      }
    });
  }, [newTask, setNewTask, refreshTasks]);

  const updateTaskRequest = useCallback(
    (taskId, payload) => {
      return fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          return refreshTasks().then(() => stopEditing(taskId));
        }
      });
    },
    [refreshTasks, stopEditing]
  );

  return (
    <div>
      <h1>Tasks</h1>

      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        <li style={{ borderBottom: "2px solid #888", paddingBottom: "12px" }}>
          <EditTask
            task={newTask}
            buttonText="Create"
            onChange={newTaskOnChange}
            onButtonClick={newTaskOnSubmit}
          />
        </li>
        {tasks.map((task) => {
          const editingTask = editingTasks[task.id];

          return (
            <li key={task.id} style={{ marginTop: "12px" }}>
              {task.id in editingTasks ? (
                <EditTask
                  task={editingTask}
                  onChange={(field, value) => {
                    startEditing(task.id, { ...editingTask, [field]: value });
                  }}
                  onButtonClick={() => {
                    const payload = normalizeRequestBody(editingTask);
                    updateTaskRequest(task.id, payload);
                  }}
                />
              ) : (
                <EditTask
                  task={task}
                  buttonText="Edit"
                  onChange={() => {}}
                  onButtonClick={() => startEditing(task.id, { ...task })}
                  onCompletedChange={(value) =>
                    updateTaskRequest(task.id, { completed: value })
                  }
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function useTasks(initialValue) {
  const [tasks, setTasks] = useState(initialValue);

  useEffect(async () => {
    await refreshTasks();
  }, []);

  const refreshTasks = useCallback(async () => {
    const res = await fetch("/api/tasks");
    const json = await res.json();
    setTasks(json);
  }, [setTasks]);

  return [tasks, refreshTasks];
}

function useEditingTasks(initialValue) {
  const [editingTasks, setEditingTasks] = useState(initialValue);

  const startEditing = useCallback(
    (taskId, task) => {
      setEditingTasks((prevState) => ({ ...prevState, [taskId]: task }));
    },
    [setEditingTasks]
  );

  const stopEditing = useCallback(
    (taskId) => {
      setEditingTasks((prevState) => {
        const newState = { ...prevState };
        delete newState[taskId];
        return newState;
      });
    },
    [setEditingTasks]
  );

  return [editingTasks, startEditing, stopEditing];
}

function normalizeRequestBody(task) {
  const copy = { ...task };

  if (Array.isArray(copy.labels)) {
    copy.labels = copy.labels.filter((label) => label.toString().trim() !== "");
  }

  return copy;
}
