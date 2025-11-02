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

  const handleEdit = (author) => {
    setEditing(author);
    setName(author.name);
    setBio(author.bio || "");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Authors</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Author name" value={name} onChange={(e) => setName(e.target.value)} required />{" "}
        <input placeholder="Bio (optional)" value={bio} onChange={(e) => setBio(e.target.value)} />{" "}
        <button type="submit">{editing ? "Update" : "Add"}</button>{" "}
        {editing && <button onClick={() => setEditing(null)}>Cancel</button>}
      </form>
      <hr />
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Bio</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.name}</td>
              <td>{a.bio}</td>
              <td>
                <button onClick={() => handleEdit(a)}>Edit</button>{" "}
                <button onClick={() => handleDelete(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
