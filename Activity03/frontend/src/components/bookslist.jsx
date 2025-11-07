// bookslist.jsx
import React, { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../api/books";
import BookForm from "./bookform";

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  const loadBooks = async () => {
    const data = await getBooks();
    setBooks(data);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      await deleteBook(id);
      loadBooks();
    }
  };

  const handleEdit = async (book) => {
    const newTitle = prompt("Enter book title:", book.title);
    if (newTitle === null) return;
    
    const newYear = prompt("Enter published year:", book.publishedYear);
    if (newYear === null) return;
    
    const newDescription = prompt("Enter description:", book.description || "");
    if (newDescription === null) return;

    const payload = {
      title: newTitle,
      publishedYear: Number(newYear),
      description: newDescription,
      authorId: book.author?.id,
      categoryId: book.category?.id
    };

    await fetch(`http://localhost:3001/books/${book.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    loadBooks();
  };

  return (
    <div className="section-card">
      <h2 className="section-title">Bookshelf</h2>

      <BookForm
        onSave={loadBooks}
        editingBook={editingBook}
        clearEdit={() => setEditingBook(null)}
      />
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Year</th>
              <th>Author</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td className="id-cell">{b.id}</td>
                <td className="title-cell">{b.title}</td>
                <td className="year-cell">{b.publishedYear}</td>
                <td className="author-cell">{b.author?.name}</td>
                <td className="category-cell">{b.category?.name}</td>
                <td className="actions-cell">
                  <button 
                    onClick={() => handleEdit(b)}
                    className="btn btn-edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(b.id)}
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