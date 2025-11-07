// App.jsx
import React from "react";
import BooksList from "./components/bookslist";
import AuthorsList from "./components/authorslist";
import CategoriesList from "./components/categorieslist";

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Reading Nook Organizer</h1>
        <p className="app-subtitle">Your trusted bookshelf management system</p>
      </header>
      
      <main className="app-main">
        <BooksList />
        <AuthorsList />
        <CategoriesList />
      </main>
    </div>
  );
}