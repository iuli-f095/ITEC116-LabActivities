import { useState } from "react";
import { createPost } from "../api/posts";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      await createPost(form, token);
      alert("Post created successfully!");
      navigate("/");
    } catch (error) {
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Create New Post</h2>
          <p>Share your thoughts with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Post Title</label>
            <input 
              placeholder="Enter a compelling title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Post Content</label>
            <textarea 
              placeholder="Write your post content here..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows="12"
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate("/")}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}