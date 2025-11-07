// bookform.jsx
import React, { useEffect, useState } from "react";
import { createBook, updateBook } from "../api/books";

export default function BookForm({ onSave, editingBook, clearEdit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    publishedYear: "",
    authorId: "",
    categoryId: "",
  });
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  async function loadRefs() {
    const a = await fetch("http://localhost:3001/authors").then((res) => res.json());
    const c = await fetch("http://localhost:3001/categories").then((res) => res.json());
    setAuthors(a);
    setCategories(c);
  }

  useEffect(() => {
    loadRefs();
  }, []);

  useEffect(() => {
    if (editingBook) {
      setForm({
        title: editingBook.title || "",
        description: editingBook.description || "",
        publishedYear: editingBook.publishedYear || "",
        authorId: editingBook.author?.id || "",
        categoryId: editingBook.category?.id || "",
      });
    } else {
      setForm({ title: "", description: "", publishedYear: "", authorId: "", categoryId: "" });
    }
  }, [editingBook]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      publishedYear: Number(form.publishedYear),
      authorId: Number(form.authorId),
      categoryId: Number(form.categoryId),
    };

    if (editingBook) {
      await updateBook(editingBook.id, payload);
      clearEdit();
    } else {
      await createBook(payload);
    }

    setForm({ title: "", description: "", publishedYear: "", authorId: "", categoryId: "" });
    onSave();
  };

  return (
    <div className="section-card">
      <form onSubmit={handleSubmit} className="form">
        <h3 className="form-title">{editingBook ? "Edit Book" : "Add New Book"}</h3>
        
        <div className="form-group">
          <input
            className="form-input"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Book Title"
            required
          />
          <input
            className="form-input"
            name="publishedYear"
            value={form.publishedYear}
            onChange={handleChange}
            placeholder="Published Year"
            required
          />
        </div>

        <div className="form-group">
          <textarea
            className="form-textarea"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Book Description"
            rows="3"
          />
        </div>

        <div className="form-group">
          <select className="form-select" name="authorId" value={form.authorId} onChange={handleChange} required>
            <option value="">Select Author</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <select className="form-select" name="categoryId" value={form.categoryId} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            {editingBook ? "Update Book" : "Add Book"}
          </button>
          {editingBook && (
            <button type="button" className="btn btn-secondary" onClick={clearEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}