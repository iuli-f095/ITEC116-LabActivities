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

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Bookshelf</h2>

      <BookForm
        onSave={loadBooks}
        editingBook={editingBook}
        clearEdit={() => setEditingBook(null)}
      />
      <hr />

      <table border="1" cellPadding="8" width="100%">
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
              <td>{b.id}</td>
              <td>{b.title}</td>
              <td>{b.publishedYear}</td>
              <td>{b.author?.name}</td>
              <td>{b.category?.name}</td>
              <td>
                <button onClick={() => setEditingBook(b)}>Edit</button>{" "}
                <button onClick={() => handleDelete(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
