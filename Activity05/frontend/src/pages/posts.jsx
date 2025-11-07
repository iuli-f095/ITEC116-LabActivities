import { useEffect, useState } from "react";
import { getPosts } from "../api/posts";
import { Link } from "react-router-dom";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 5;

  useEffect(() => {
    setLoading(true);
    getPosts(page).then((res) => {
      setPosts(res.data);
      setTotal(res.total);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="posts-container">
        <div className="loading-spinner">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="posts-container">
      <div className="page-header">
        <h1>Blog Posts</h1>
        <p>Discover the latest articles from our community</p>
      </div>

      <div className="posts-grid">
        {posts.map((post) => (
          <article key={post.id} className="post-card">
            <h2 className="post-title">
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h2>
            <p className="post-content-preview">
              {post.content.slice(0, 150)}...
            </p>
            <div className="post-meta">
              <span className="post-author">By {post.author?.name || 'Unknown'}</span>
              <span className="post-date">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Link to={`/posts/${post.id}`} className="read-more">Read More →</Link>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>Be the first to create a post!</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setPage(page - 1)} 
            disabled={page === 1}
            className="pagination-btn"
          >
            ← Previous
          </button>
          
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          
          <button 
            onClick={() => setPage(page + 1)} 
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}