import { useState } from "react";
import { createPost } from "../api/posts";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await createPost(form, token);
    alert("Post created!");
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Post</h2>
      <input placeholder="Title" onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea placeholder="Content" onChange={(e) => setForm({ ...form, content: e.target.value })}></textarea>
      <button type="submit">Create</button>
    </form>
  );
}
