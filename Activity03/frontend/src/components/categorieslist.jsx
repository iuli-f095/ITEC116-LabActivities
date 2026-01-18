// categorieslist.jsx
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

  const handleEdit = async (cat) => {
    const newName = prompt("Enter category name:", cat.name);
    if (newName === null) return;

    const payload = { name: newName };
    await fetch(`http://localhost:3001/categories/${cat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    loadCategories();
  };

  return (
    <div className="section-card">
      <h2 className="section-title">Categories</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <input 
            className="form-input"
            placeholder="Category name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            {editing ? "Update" : "Add Category"}
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="id-cell">{c.id}</td>
                <td className="name-cell">{c.name}</td>
                <td className="actions-cell">
                  <button 
                    onClick={() => handleEdit(c)}
                    className="btn btn-edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(c.id)}
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