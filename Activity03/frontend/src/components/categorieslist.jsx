import React, { useEffect, useState } from "react";

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  const loadCategories = async () => {
    const res = await fetch("http://localhost:3001/categories");
    setCategories(await res.json());
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name };
    if (editing) {
      await fetch(`http://localhost:3001/categories/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditing(null);
    } else {
      await fetch("http://localhost:3001/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setName("");
    loadCategories();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      await fetch(`http://localhost:3001/categories/${id}`, { method: "DELETE" });
      loadCategories();
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setName(cat.name);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Categories</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} required />{" "}
        <button type="submit">{editing ? "Update" : "Add"}</button>{" "}
        {editing && <button onClick={() => setEditing(null)}>Cancel</button>}
      </form>
      <hr />
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>{" "}
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
