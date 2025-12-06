import React, { useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { postsAPI, commentsAPI } from '../../services/api';

const PostCard = ({ post, onUpdate }) => {
  const { user, isAuthenticated } = useAuth();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !isAuthenticated) return;

    try {
      setCommentLoading(true);
      const response = await commentsAPI.createComment(post.id, comment);
      setComments([...comments, response.data]);
      setComment('');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleUpdatePost = async () => {
    try {
      setLoading(true);
      await postsAPI.updatePost(post.id, editTitle, editContent);
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(post.id);
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await commentsAPI.updateComment(commentId, editCommentContent);
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, content: editCommentContent } : c
      ));
      setEditingCommentId(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentsAPI.deleteComment(commentId);
        setComments(comments.filter(c => c.id !== commentId));
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const isPostOwner = user?.id === post.userId;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      border: '1px solid #F0F0F0',
      marginBottom: '20px'
    }}>
      {/* Post Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '15px' 
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#AAC4F5',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px',
          marginRight: '12px'
        }}>
          {post.user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <div style={{ 
            fontWeight: '600', 
            color: '#333',
            fontSize: '16px'
          }}>
            {post.user?.username || 'Unknown User'}
          </div>
          <div style={{ 
            fontSize: '13px', 
            color: '#888' 
          }}>
            {formatDate(post.createdAt)}
          </div>
        </div>
        
        {/* Post Actions */}
        {isPostOwner && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                backgroundColor: '#FFF2C6',
                color: '#333',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              ✎ Edit
            </button>
            <button
              onClick={handleDeletePost}
              style={{
                backgroundColor: '#FFE5E5',
                color: '#D32F2F',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              🗑 Delete
            </button>
          </div>
        )}
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #AAC4F5',
              borderRadius: '6px',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #AAC4F5',
              borderRadius: '6px',
              fontSize: '15px',
              resize: 'vertical'
            }}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={handleUpdatePost}
              disabled={loading}
              style={{
                backgroundColor: '#8CA9FF',
                color: 'white',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                backgroundColor: '#FFF2C6',
                color: '#333',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 style={{ 
            color: '#6B8CE8', 
            marginBottom: '15px',
            fontSize: '20px'
          }}>
            {post.title}
          </h3>
          <div style={{ 
            color: '#333', 
            lineHeight: '1.6',
            marginBottom: '20px',
            fontSize: '15px',
            whiteSpace: 'pre-wrap'
          }}>
            {post.content}
          </div>
        </>
      )}

      {/* Comments Section */}
      <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: '20px' }}>
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#8CA9FF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '15px'
          }}
        >
          <span style={{ fontSize: '18px' }}>
            {showComments ? '▼' : '▶'}
          </span>
          Comments ({comments.length})
        </button>

        {showComments && (
          <>
            {/* Comment Input - Only for logged in users */}
            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '2px solid #AAC4F5',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    disabled={commentLoading}
                  />
                  <button
                    type="submit"
                    disabled={commentLoading || !comment.trim()}
                    style={{
                      backgroundColor: '#8CA9FF',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      opacity: (!comment.trim() || commentLoading) ? 0.6 : 1
                    }}
                  >
                    {commentLoading ? '...' : 'Post'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{
                backgroundColor: '#FFF8DE',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '15px',
                textAlign: 'center',
                color: '#666',
                fontSize: '14px'
              }}>
                Please login to comment on this post
              </div>
            )}

            {/* Comments List */}
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {comments.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#888', 
                  padding: '20px',
                  fontSize: '14px'
                }}>
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                comments.map((commentItem) => (
                  <div 
                    key={commentItem.id}
                    style={{
                      backgroundColor: '#FFF8DE',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '10px',
                      borderLeft: '3px solid #AAC4F5'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: '8px' 
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        backgroundColor: '#8CA9FF',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        marginRight: '8px'
                      }}>
                        {commentItem.user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: '600', 
                          fontSize: '14px',
                          color: '#333'
                        }}>
                          {commentItem.user?.username || 'Unknown'}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#888' 
                        }}>
                          {formatDate(commentItem.createdAt)}
                        </div>
                      </div>
                      
                      {/* Comment Actions - Only for comment owner */}
                      {user?.id === commentItem.userId && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {editingCommentId === commentItem.id ? (
                            <>
                              <button
                                onClick={() => handleUpdateComment(commentItem.id)}
                                style={{
                                  backgroundColor: '#8CA9FF',
                                  color: 'white',
                                  border: 'none',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditCommentContent('');
                                }}
                                style={{
                                  backgroundColor: '#FFF2C6',
                                  color: '#333',
                                  border: 'none',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingCommentId(commentItem.id);
                                  setEditCommentContent(commentItem.content);
                                }}
                                style={{
                                  backgroundColor: 'transparent',
                                  color: '#8CA9FF',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(commentItem.id)}
                                style={{
                                  backgroundColor: 'transparent',
                                  color: '#FF6B6B',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Comment Content */}
                    {editingCommentId === commentItem.id ? (
                      <input
                        type="text"
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '2px solid #AAC4F5',
                          borderRadius: '4px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    ) : (
                      <div style={{ 
                        color: '#333', 
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}>
                        {commentItem.content}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;