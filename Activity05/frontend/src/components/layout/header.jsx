import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <header style={{
      backgroundColor: '#8CA9FF',
      padding: '15px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link to="/" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          BlogSphere
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            transition: 'background-color 0.3s'
          }} onMouseEnter={(e) => e.target.style.backgroundColor = '#6B8CE8'}
             onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/create-post" style={{
                backgroundColor: '#FFF2C6',
                color: '#333',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: '600',
                transition: 'background-color 0.3s'
              }} onMouseEnter={(e) => e.target.style.backgroundColor = '#E6D9B2'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = '#FFF2C6'}>
                + Create Post
              </Link>

              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowMenu(!showMenu)} style={{
                  backgroundColor: '#FFF2C6',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </button>

                {showMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '50px',
                    right: 0,
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    minWidth: '150px',
                    zIndex: 1000
                  }}>
                    <div style={{
                      padding: '10px 15px',
                      color: '#333',
                      fontWeight: '600',
                      borderBottom: '1px solid #EEE'
                    }}>
                      {user?.username}
                    </div>
                    <Link to="/profile" onClick={() => setShowMenu(false)} style={{
                      display: 'block',
                      padding: '10px 15px',
                      color: '#333',
                      textDecoration: 'none',
                      borderBottom: '1px solid #EEE'
                    }} onMouseEnter={(e) => e.target.style.backgroundColor = '#FFF8DE'}
                       onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                      Profile
                    </Link>
                    <button onClick={handleLogout} style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 15px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#D32F2F',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }} onMouseEnter={(e) => e.target.style.backgroundColor = '#FFE5E5'}
                       onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'background-color 0.3s'
              }} onMouseEnter={(e) => e.target.style.backgroundColor = '#6B8CE8'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                Login
              </Link>
              <Link to="/register" style={{
                backgroundColor: '#FFF2C6',
                color: '#333',
                textDecoration: 'none',
                padding: '8px 20px',
                borderRadius: '6px',
                fontWeight: '600',
                transition: 'background-color 0.3s'
              }} onMouseEnter={(e) => e.target.style.backgroundColor = '#E6D9B2'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = '#FFF2C6'}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;