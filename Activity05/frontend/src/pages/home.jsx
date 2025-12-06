import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { postsAPI } from '../services/api';
import Header from '../components/layout/header';
import PostCard from '../components/post/postCard';
import CreatePost from '../components/post/createPost';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getPosts(page, 10);
      setPosts(data.data);
      setTotalPages(data.meta.last_page);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handlePostUpdated = () => {
    fetchPosts();
  };

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#FFF8DE', minHeight: '100vh' }}>
        <Header />
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            color: '#8CA9FF', 
            marginBottom: '30px', 
            textAlign: 'center',
            fontSize: '36px'
          }}>
            Welcome to BlogSphere
          </h1>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '40px', 
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(140, 169, 255, 0.1)',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <h2 style={{ color: '#6B8CE8', marginBottom: '20px', fontSize: '24px' }}>
              Please login to view and interact with posts
            </h2>
            <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px', lineHeight: '1.6' }}>
              You need to be logged in to see blog posts, create posts, and comment on posts.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  backgroundColor: '#8CA9FF',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#6B8CE8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#8CA9FF'}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                style={{
                  backgroundColor: '#FFF2C6',
                  color: '#333',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E6D9B2'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FFF2C6'}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Show public posts preview for non-logged in users */}
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ color: '#8CA9FF', marginBottom: '20px', textAlign: 'center' }}>
              Recent Blog Posts (Preview)
            </h3>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center',
              color: '#666'
            }}>
              <p>Login to see all blog posts and join the conversation!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFF8DE', minHeight: '100vh' }}>
      <Header />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <h1 style={{ 
            color: '#8CA9FF', 
            marginBottom: '10px',
            fontSize: '28px'
          }}>
            Welcome back, {user?.username}!
          </h1>
          <p style={{ color: '#666' }}>
            Share your thoughts, read posts from others, and join the discussion.
          </p>
        </div>
        
        {/* Create Post Section */}
        <CreatePost onPostCreated={handlePostCreated} />
        
        {/* Posts List */}
        <h2 style={{ 
          color: '#8CA9FF', 
          marginBottom: '20px',
          fontSize: '24px'
        }}>
          Recent Posts
        </h2>
        
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#8CA9FF',
            fontSize: '18px'
          }}>
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '40px', 
            borderRadius: '15px',
            textAlign: 'center',
            color: '#666',
            fontSize: '16px'
          }}>
            No posts yet. Be the first to create one!
          </div>
        ) : (
          <div style={{ marginTop: '20px' }}>
            {posts.map((post) => (
              <PostCard 
                key={post.id}
                post={post} 
                onUpdate={handlePostUpdated}
              />
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: '15px', 
            marginTop: '40px',
            padding: '20px'
          }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                backgroundColor: page === 1 ? '#E0E0E0' : '#8CA9FF',
                color: page === 1 ? '#999' : 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => {
                if (page !== 1) e.target.style.backgroundColor = '#6B8CE8';
              }}
              onMouseLeave={(e) => {
                if (page !== 1) e.target.style.backgroundColor = '#8CA9FF';
              }}
            >
              ← Previous
            </button>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '10px' 
            }}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    style={{
                      backgroundColor: page === pageNum ? '#6B8CE8' : '#AAC4F5',
                      color: 'white',
                      border: 'none',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '16px',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      if (page !== pageNum) e.target.style.backgroundColor = '#8CA9FF';
                    }}
                    onMouseLeave={(e) => {
                      if (page !== pageNum) e.target.style.backgroundColor = '#AAC4F5';
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                backgroundColor: page === totalPages ? '#E0E0E0' : '#8CA9FF',
                color: page === totalPages ? '#999' : 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => {
                if (page !== totalPages) e.target.style.backgroundColor = '#6B8CE8';
              }}
              onMouseLeave={(e) => {
                if (page !== totalPages) e.target.style.backgroundColor = '#8CA9FF';
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;