import React from "react";
import BooksList from "./components/bookslist";
import AuthorsList from "./components/authorslist";
import CategoriesList from "./components/categorieslist";

export default function App() {
  return (
    <div style={{ backgroundColor: "#362c40ff", color: "#fff", minHeight: "100vh", padding: "2rem" }}>
      <h1>Reading Nook Organizer</h1>
      <BooksList />
      <AuthorsList />
      <CategoriesList />
    </div>
  );
}
