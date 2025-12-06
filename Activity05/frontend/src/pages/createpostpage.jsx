import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/header';
import CreatePost from '../components/post/createPost';

const CreatePostPage = () => {
  const navigate = useNavigate();

  const handlePostCreated = () => {
    navigate('/');
  };

  return (
    <div style={{ backgroundColor: '#FFF8DE', minHeight: '100vh' }}>
      <Header />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '25px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <h1 style={{ 
            color: '#8CA9FF', 
            marginBottom: '10px',
            fontSize: '28px'
          }}>
            Create New Post
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Share your thoughts with the community. Write something meaningful!
          </p>
        </div>
        
        <CreatePost onPostCreated={handlePostCreated} />
        
        <div style={{ 
          marginTop: '30px', 
          textAlign: 'center',
          fontSize: '14px',
          color: '#888'
        }}>
          <p>Your post will be visible to all users on the homepage.</p>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;