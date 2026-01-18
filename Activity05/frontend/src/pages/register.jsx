import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import Header from '../components/layout/header';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      // Redirect to login after successful registration
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFF8DE', minHeight: '100vh' }}>
      <Header />
      <div style={{ 
        maxWidth: '450px', 
        margin: '50px auto', 
        padding: '0 20px' 
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(140, 169, 255, 0.1)'
        }}>
          <h2 style={{ 
            color: '#8CA9FF', 
            textAlign: 'center', 
            marginBottom: '10px',
            fontSize: '28px'
          }}>
            Create Account
          </h2>
          <p style={{ 
            textAlign: 'center', 
            color: '#666', 
            marginBottom: '30px',
            fontSize: '16px'
          }}>
            Join our community of bloggers
          </p>

          {error && (
            <div style={{
              backgroundColor: '#FFE5E5',
              color: '#D32F2F',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #AAC4F5',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                placeholder="Enter username (min. 3 characters)"
                onFocus={(e) => e.target.style.borderColor = '#8CA9FF'}
                onBlur={(e) => e.target.style.borderColor = '#AAC4F5'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #AAC4F5',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                placeholder="Enter email address"
                onFocus={(e) => e.target.style.borderColor = '#8CA9FF'}
                onBlur={(e) => e.target.style.borderColor = '#AAC4F5'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #AAC4F5',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                placeholder="Enter password (min. 6 characters)"
                onFocus={(e) => e.target.style.borderColor = '#8CA9FF'}
                onBlur={(e) => e.target.style.borderColor = '#AAC4F5'}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #AAC4F5',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                placeholder="Confirm your password"
                onFocus={(e) => e.target.style.borderColor = '#8CA9FF'}
                onBlur={(e) => e.target.style.borderColor = '#AAC4F5'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#8CA9FF',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: loading ? 0.7 : 1,
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.backgroundColor = '#6B8CE8';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.backgroundColor = '#8CA9FF';
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div style={{ 
            textAlign: 'center', 
            marginTop: '25px', 
            color: '#666',
            fontSize: '14px'
          }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#8CA9FF', 
                textDecoration: 'none',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Login here
            </Link>
          </div>

          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#FFF8DE',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#666',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '5px' }}>Password Requirements:</p>
            <p style={{ margin: 0 }}>• Minimum 6 characters</p>
            <p style={{ margin: 0 }}>• Must match confirmation password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;