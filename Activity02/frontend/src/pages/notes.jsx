import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setAuthToken(token);
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;
    await api.post("/notes", newNote);
    setNewNote({ title: "", content: "" });
    fetchNotes();
  };

  const handleDelete = async (id) => {
    await api.delete(`/notes/${id}`);
    fetchNotes();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Notes</h2>
      <button onClick={logout}>Logout</button>

      <form onSubmit={handleAddNote} style={{ marginTop: 20 }}>
        <input
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          required
        />
        <button type="submit">Add Note</button>
      </form>

      <div style={{ marginTop: 30 }}>
        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 5,
              marginBottom: 10,
              padding: 10,
            }}
          >
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => handleDelete(note.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
