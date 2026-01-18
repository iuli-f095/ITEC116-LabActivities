import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { postsAPI, usersAPI } from '../services/api';
import Header from '../components/layout/header';

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [usernameError, setUsernameError] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchUserPosts();
    }
  }, [user, page, isAuthenticated]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getUserPosts(user.id, page, 10);
      setUserPosts(data.data);
      setTotalPosts(data.meta.total);
      setTotalPages(data.meta.last_page);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (newUsername.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return;
    }

    if (newUsername === user.username) {
      setEditingUsername(false);
      return;
    }

    try {
      setUsernameLoading(true);
      setUsernameError('');
      
      const updatedUser = await usersAPI.updateUsername(user.id, newUsername);
      
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const updatedUserData = { ...storedUser, username: updatedUser.username };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      window.location.reload();
      
    } catch (error) {
      setUsernameError(error.message || 'Failed to update username. Please try again.');
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  if (!user || !isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#FFF8DE', minHeight: '100vh' }}>
        <Header />
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{ color: '#8CA9FF', marginBottom: '20px' }}>
            Please login to view profile
          </h2>
          <Link to="/login" style={{
            backgroundColor: '#8CA9FF',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-block',
            fontWeight: '600'
          }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFF8DE', minHeight: '100vh' }}>
      <Header />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Profile Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 15px rgba(140, 169, 255, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#8CA9FF',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '32px',
              flexShrink: 0
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
              {editingUsername ? (
                <div style={{ marginBottom: '15px' }}>
                  {usernameError && (
                    <div style={{
                      backgroundColor: '#FFE5E5',
                      color: '#D32F2F',
                      padding: '8px',
                      borderRadius: '6px',
                      marginBottom: '10px',
                      fontSize: '13px'
                    }}>
                      {usernameError}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '2px solid #AAC4F5',
                        borderRadius: '6px',
                        fontSize: '16px',
                        outline: 'none',
                        minWidth: '200px'
                      }}
                      placeholder="Enter new username"
                      disabled={usernameLoading}
                    />
                    <button
                      onClick={handleUsernameUpdate}
                      disabled={usernameLoading}
                      style={{
                        backgroundColor: usernameLoading ? '#CCC' : '#8CA9FF',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        cursor: usernameLoading ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        flexShrink: 0,
                        opacity: usernameLoading ? 0.7 : 1
                      }}
                    >
                      {usernameLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingUsername(false);
                        setNewUsername(user.username);
                        setUsernameError('');
                      }}
                      disabled={usernameLoading}
                      style={{
                        backgroundColor: '#FFF2C6',
                        color: '#333',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        cursor: usernameLoading ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        flexShrink: 0,
                        opacity: usernameLoading ? 0.7 : 1
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 style={{ 
                    color: '#6B8CE8', 
                    marginBottom: '5px',
                    fontSize: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap'
                  }}>
                    {user.username}
                    <button
                      onClick={() => setEditingUsername(true)}
                      style={{
                        backgroundColor: '#FFF2C6',
                        color: '#333',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      ✎ Edit Username
                    </button>
                  </h2>
                  <p style={{ color: '#666', marginBottom: '10px', fontSize: '16px' }}>
                    {user.email}
                  </p>
                  <p style={{ color: '#888', fontSize: '14px' }}>
                    Member since: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '30px',
            borderTop: '2px solid #FFF8DE',
            paddingTop: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: 'bold',
                color: '#8CA9FF'
              }}>
                {totalPosts}
              </div>
              <div style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Total Posts</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: 'bold',
                color: '#8CA9FF'
              }}>
                {userPosts.reduce((total, post) => total + (post.comments?.length || 0), 0)}
              </div>
              <div style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Comments Received</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#FFE5E5',
                  color: '#D32F2F',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  marginTop: '10px'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Rest of the Profile component remains the same */}
        {/* User's Posts Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <h2 style={{ 
              color: '#8CA9FF', 
              fontSize: '22px',
              margin: 0
            }}>
              My Posts ({totalPosts})
            </h2>
            <Link to="/create-post" style={{
              backgroundColor: '#8CA9FF',
              color: 'white',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              display: 'inline-block'
            }}>
              + Create New Post
            </Link>
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#8CA9FF',
            backgroundColor: 'white',
            borderRadius: '12px',
            fontSize: '18px'
          }}>
            Loading your posts...
          </div>
        ) : userPosts.length === 0 ? (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '40px', 
            borderRadius: '15px',
            textAlign: 'center',
            color: '#666',
            fontSize: '16px'
          }}>
            <p style={{ marginBottom: '20px' }}>You haven't created any posts yet.</p>
            <Link 
              to="/create-post"
              style={{
                backgroundColor: '#8CA9FF',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: '600'
              }}
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <>
            <div>
              {userPosts.map((post) => (
                <div 
                  key={post.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '15px',
                    border: '1px solid #F0F0F0',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '15px',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <h3 style={{ 
                      color: '#6B8CE8', 
                      margin: 0,
                      fontSize: '18px',
                      flex: 1
                    }}>
                      {post.title}
                    </h3>
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#888',
                      flexShrink: 0
                    }}>
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                  
                  <p style={{ 
                    color: '#333', 
                    marginBottom: '15px',
                    fontSize: '15px',
                    lineHeight: '1.6'
                  }}>
                    {post.content.length > 200 
                      ? post.content.substring(0, 200) + '...' 
                      : post.content}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: '#888',
                    borderTop: '1px solid #F0F0F0',
                    paddingTop: '15px',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <span>
                      {post.comments?.length || 0} comments
                    </span>
                    <Link 
                      to={`/`}
                      style={{
                        color: '#8CA9FF',
                        textDecoration: 'none',
                        fontWeight: '600'
                      }}
                    >
                      View Post →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination for user posts */}
            {totalPages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '10px', 
                marginTop: '30px',
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '12px'
              }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    backgroundColor: page === 1 ? '#E0E0E0' : '#8CA9FF',
                    color: page === 1 ? '#999' : 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  Previous
                </button>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '5px' 
                }}>
                  <span style={{ color: '#666', margin: '0 10px' }}>
                    Page {page} of {totalPages}
                  </span>
                </div>
                
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    backgroundColor: page === totalPages ? '#E0E0E0' : '#8CA9FF',
                    color: page === totalPages ? '#999' : 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;