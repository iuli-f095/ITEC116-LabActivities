import { useEffect, useState } from "react";
import { getPosts, deletePost } from "../api/posts";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const limit = 5;

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await getPosts(page, limit);
      setPosts(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setDeletingId(postId);
    try {
      const token = localStorage.getItem("token");
      await deletePost(postId, token);
      // Refresh the posts list after deletion
      fetchPosts();
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditPost = (postId) => {
    navigate(`/edit_post/${postId}`);
  };

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
        {user && (
          <Link to="/create_post" className="btn btn-primary">
            Create New Post
          </Link>
        )}
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
              <span className="post-author">By {post.author?.username || post.author?.name || 'Unknown'}</span>
              <span className="post-date">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              {post.comments && (
                <span className="comment-count">
                  {post.comments.length} comments
                </span>
              )}
            </div>
            <div className="post-actions">
              <Link to={`/posts/${post.id}`} className="read-more">Read More →</Link>
              {user && user.id === post.author?.id && (
                <div className="author-actions">
                  <button 
                    onClick={() => handleEditPost(post.id)}
                    className="btn-edit"
                    disabled={deletingId === post.id}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="btn-delete"
                    disabled={deletingId === post.id}
                  >
                    {deletingId === post.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>Be the first to create a post!</p>
          {user && (
            <Link to="/create_post" className="btn btn-primary">
              Create Your First Post
            </Link>
          )}
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