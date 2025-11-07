import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../api/posts";
import { getComments, addComment } from "../api/comments";

export default function PostInfos() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [postData, commentsData] = await Promise.all([
          getPost(id),
          getComments(id)
        ]);
        setPost(postData);
        setComments(commentsData);
      } catch (error) {
        console.error("Failed to load post:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await addComment(id, { content: commentText }, token);
      setCommentText("");
      setComments(await getComments(id));
    } catch (error) {
      alert("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="post-detail-container">
        <div className="loading-spinner">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail-container">
        <div className="error-state">Post not found</div>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <article className="post-detail">
        <header className="post-header">
          <h1 className="post-title-large">{post.title}</h1>
          <div className="post-meta-detail">
            <span className="post-author">By {post.author?.name || 'Unknown'}</span>
            <span className="post-date">
              Published on {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </header>

        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="comments-section">
        <h3 className="comments-title">
          Comments ({comments.length})
        </h3>

        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div className="comment-content">
                {comment.content}
              </div>
              <div className="comment-meta">
                <span className="comment-author">
                  By {comment.author?.name || 'Anonymous'}
                </span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="empty-comments">
            No comments yet. Be the first to comment!
          </div>
        )}

        <form onSubmit={handleComment} className="comment-form">
          <div className="form-group">
            <label>Add a Comment</label>
            <textarea 
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows="3"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={submitting || !commentText.trim()}
            className="btn-primary"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      </section>
    </div>
  );
}