import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaSignInAlt, FaUser, FaLock } from 'react-icons/fa'
import '../../App.css'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const success = await login(formData.username, formData.password)

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
          <FaSignInAlt style={{ color: '#764ba2', fontSize: '3rem', marginBottom: '1rem' }} />
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '0.5rem',
          }}>
            Sign in to your account
          </h2>
          <p style={{ color: '#d1d5db' }}>
            Or{' '}
            <Link to="/register" style={{
              color: '#764ba2',
              fontWeight: '500',
            }}>
              create a new account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
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
                  border: '1px solid #4b5563',
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
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
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
                  border: '1px solid #4b5563',
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
                <FaSignInAlt />
                Sign in
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login