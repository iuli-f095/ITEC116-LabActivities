import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaUserPlus, FaUser, FaEnvelope, FaLock } from 'react-icons/fa'
import '../../App.css'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    const success = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    })

    if (success) {
      navigate('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <FaUserPlus style={{ color: '#764ba2', fontSize: '3rem', marginBottom: '1rem' }} />
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '0.5rem',
          }}>
            Create your account
          </h2>
          <p style={{ color: '#d1d5db' }}>
            Or{' '}
            <Link to="/login" style={{
              color: '#764ba2',
              fontWeight: '500',
            }}>
              sign in to existing account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '0.75rem',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                }}>
                  <FaUser />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem',
                    border: `1px solid ${errors.username ? '#dc2626' : '#4b5563'}`,
                    backgroundColor: '#1f2937',
                    color: 'white',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                  }}
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              {errors.username && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.username}</p>
              )}
            </div>

            <div>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '0.75rem',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                }}>
                  <FaEnvelope />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem',
                    border: `1px solid ${errors.email ? '#dc2626' : '#4b5563'}`,
                    backgroundColor: '#1f2937',
                    color: 'white',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                  }}
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</p>
              )}
            </div>

            <div>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '0.75rem',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                }}>
                  <FaLock />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem',
                    border: `1px solid ${errors.password ? '#dc2626' : '#4b5563'}`,
                    backgroundColor: '#1f2937',
                    color: 'white',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                  }}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</p>
              )}
            </div>

            <div>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '0.75rem',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                }}>
                  <FaLock />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem',
                    border: `1px solid ${errors.confirmPassword ? '#dc2626' : '#4b5563'}`,
                    backgroundColor: '#1f2937',
                    color: 'white',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                  }}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#764ba2',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '500',
              fontSize: '0.875rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? '0.5' : '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {loading ? (
              <div style={{
                width: '1.25rem',
                height: '1.25rem',
                border: '2px solid white',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}></div>
            ) : (
              <>
                <FaUserPlus />
                Create Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register