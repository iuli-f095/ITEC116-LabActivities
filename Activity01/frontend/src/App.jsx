import React, { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api";
import "./index.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [search, setSearch] = useState("");

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

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    await updateTask(id, { title: editTitle });
    setEditingId(null);
    setEditTitle("");
    load();
  };

  // Filtered list based on search input
  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  // STYLES
  const styles = {
     container: {
      display: "flex",
      flexDirection: "row",
      alignItems: "stretch",
      justifyContent: "center",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#FDF4F5",
      overflow: "hidden", 
      margin: 0,
      padding: 0,
    },

    card: {
      background: "linear-gradient(135deg, #e8d4eeff 0%, #BA90C6 45%, #9365a0ff 100%)",
      flex: 1,
      padding: "3rem",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },

    title: {
      textAlign: "center",
      fontSize: "clamp(1.8rem, 3vw, 3rem)",
      marginBottom: "1.5rem",
      fontWeight: "700",
      letterSpacing: "1px",
    },

    inputRow: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "10px",
      width: "100%",
      maxWidth: "400px",
    },

    input: {
      flex: "2",
      padding: "12px 14px",
      borderRadius: "8px",
      border: "none",
      outline: "none",
      fontSize: "1rem",
      backgroundColor: "#FDF4F5",
      color: "#333",
    },

    addBtn: {
      backgroundColor: "#E8A0BF",
      border: "none",
      borderRadius: "8px",
      padding: "12px 20px",
      cursor: "pointer",
      color: "white",
      fontWeight: "bold",
      fontSize: "1rem",
      transition: "0.2s",
    },

    taskList: {
      backgroundColor: "#C0DBEA",
      flex: 1,
      padding: "3rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      height: "100%",
      overflowY: "auto", 
    },

    searchBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      maxWidth: "600px",
      marginBottom: "20px",
      flexWrap: "wrap",
      gap: "10px",
    },

    searchInput: {
      flex: 1,
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #E8A0BF",
      outline: "none",
      fontSize: "1rem",
    },

    countText: {
      fontWeight: "bold",
      color: "#444",
    },

    taskItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#FDF4F5",
      border: "1px solid #E8A0BF",
      borderRadius: "10px",
      padding: "12px",
      marginBottom: "12px",
      width: "100%",
      maxWidth: "600px",
      flexWrap: "wrap",
      gap: "10px",
      wordBreak: "break-word", 
    },


    editBtn: {
      backgroundColor: "#BA90C6",
      border: "none",
      borderRadius: "8px",
      color: "white",
      cursor: "pointer",
      padding: "8px 14px",
      fontWeight: "bold",
      transition: "0.2s",
    },

    deleteBtn: {
      backgroundColor: "#E8A0BF",
      border: "none",
      borderRadius: "8px",
      color: "white",
      cursor: "pointer",
      padding: "8px 14px",
      fontWeight: "bold",
      transition: "0.2s",
    },

    checkbox: {
      transform: "scale(1.6)",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>
        <h1 style={styles.title}>To-Do List</h1>
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter a new task..."
          />
          <button style={styles.addBtn} onClick={add}>
            Add
          </button>
        </div>
      </div>

      <div style={styles.taskList}>
        <div style={styles.searchBar}>
          <input
            style={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
          />
          <span style={styles.countText}>
            Tasks: {filteredTasks.length}
          </span>
        </div>

        <ul style={{ listStyleType: "none", padding: 0, margin: 0, width: "100%" }}>
          {filteredTasks.map((t) => (
            <li key={t.id} style={styles.taskItem}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flex: 1,
                overflow: "hidden",
                wordBreak: "break-word",
                flexWrap: "wrap",
              }}
            >
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggle(t)}
                style={styles.checkbox}
              />
              {editingId === t.id ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              ) : (
                <span
                  style={{
                    textDecoration: t.completed ? "line-through" : "none",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                    flex: 1,
                  }}
                >
                  {t.title}
                </span>
              )}
            </label>


              {editingId === t.id ? (
                <button
                  onClick={() => saveEdit(t.id)}
                  style={styles.editBtn}
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => startEdit(t)}
                  style={styles.editBtn}
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => remove(t.id)}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;