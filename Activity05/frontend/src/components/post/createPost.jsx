import React, { useState } from 'react';
import { postsAPI } from '../../services/api';

const CreatePost = ({ onPostCreated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!content.trim() || content.length < 10) {
      setError('Content must be at least 10 characters');
      return;
    }

    try {
      setLoading(true);
      await postsAPI.createPost(title, content);
      setTitle('');
      setContent('');
      setIsExpanded(false);
      if (onPostCreated) onPostCreated();
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <div 
        onClick={() => setIsExpanded(true)}
        style={{
          backgroundColor: 'white',
          border: '2px dashed #AAC4F5',
          borderRadius: '12px',
          padding: '20px',
          cursor: 'pointer',
          marginBottom: '25px',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = '#8CA9FF';
          e.target.style.backgroundColor = '#FFF8DE';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = '#AAC4F5';
          e.target.style.backgroundColor = 'white';
        }}
      >
        <div style={{ 
          color: '#8CA9FF', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px' 
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#FFF2C6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            +
          </div>
          <span style={{ fontSize: '16px' }}>
            What's on your mind? Create a new post...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '25px',
      marginBottom: '25px',
      boxShadow: '0 4px 12px rgba(140, 169, 255, 0.15)'
    }}>
      <h3 style={{ 
        color: '#8CA9FF', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '20px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#FFF2C6',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          ✎
        </div>
        Create New Post
      </h3>

      {error && (
        <div style={{
          backgroundColor: '#FFE5E5',
          color: '#D32F2F',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #AAC4F5',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              marginBottom: '15px',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#8CA9FF'}
            onBlur={(e) => e.target.style.borderColor = '#AAC4F5'}
          />
          <textarea
            placeholder="What would you like to share? (Minimum 10 characters)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #AAC4F5',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              resize: 'vertical',
              minHeight: '120px',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#8CA9FF'}
            onBlur={(e) => e.target.style.borderColor = '#AAC4F5'}
          />
          <div style={{ 
            fontSize: '14px', 
            color: content.length < 10 ? '#D32F2F' : '#666',
            marginTop: '5px',
            textAlign: 'right'
          }}>
            {content.length} characters
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          justifyContent: 'flex-end' 
        }}>
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              setTitle('');
              setContent('');
              setError('');
            }}
            style={{
              backgroundColor: '#FFF2C6',
              color: '#333',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E6D9B2'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#FFF2C6'}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || content.length < 10}
            style={{
              backgroundColor: loading || content.length < 10 ? '#CCC' : '#8CA9FF',
              color: 'white',
              border: 'none',
              padding: '10px 30px',
              borderRadius: '8px',
              cursor: loading || content.length < 10 ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => {
              if (!loading && content.length >= 10) e.target.style.backgroundColor = '#6B8CE8';
            }}
            onMouseLeave={(e) => {
              if (!loading && content.length >= 10) e.target.style.backgroundColor = '#8CA9FF';
            }}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;