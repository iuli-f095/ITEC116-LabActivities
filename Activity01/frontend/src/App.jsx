import React, { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const t = await getTasks();
    setTasks(t);
  };

  const add = async () => {
    if (!newTitle.trim()) return;
    await createTask({ title: newTitle });
    setNewTitle("");
    load();
  };

  const toggle = async (task) => {
    await updateTask(task.id, { completed: !task.completed });
    load();
  };

  const remove = async (id) => {
    await deleteTask(id);
    load();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>To-Do</h1>
      <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New task" />
      <button onClick={add}>Add</button>

      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            <input type="checkbox" checked={t.completed} onChange={() => toggle(t)} />
            {t.title}
            <button onClick={() => remove(t.id)} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
