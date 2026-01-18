// authorlist.jsx
import React, { useEffect, useState } from "react";

export default function AuthorsList() {
  const [authors, setAuthors] = useState([]);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(null);

  const loadAuthors = async () => {
    const res = await fetch("http://localhost:3001/authors");
    setAuthors(await res.json());
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, bio };
    if (editing) {
      await fetch(`http://localhost:3001/authors/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditing(null);
    } else {
      await fetch("http://localhost:3001/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setName("");
    setBio("");
    loadAuthors();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this author?")) {
      await fetch(`http://localhost:3001/authors/${id}`, { method: "DELETE" });
      loadAuthors();
    }
  };

  const handleEdit = async (author) => {
    const newName = prompt("Enter author name:", author.name);
    if (newName === null) return;
    
    const newBio = prompt("Enter author bio:", author.bio || "");
    if (newBio === null) return;

    const payload = { name: newName, bio: newBio };
    await fetch(`http://localhost:3001/authors/${author.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    loadAuthors();
  };

  return (
    <div className="section-card">
      <h2 className="section-title">Authors</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <input 
            className="form-input"
            placeholder="Author name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <input 
            className="form-input"
            placeholder="Bio (optional)" 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            {editing ? "Update" : "Add Author"}
          </button>
          {editing && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Bio</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((a) => (
              <tr key={a.id}>
                <td className="id-cell">{a.id}</td>
                <td className="name-cell">{a.name}</td>
                <td className="bio-cell">{a.bio || "-"}</td>
                <td className="actions-cell">
                  <button 
                    onClick={() => handleEdit(a)}
                    className="btn btn-edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(a.id)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}