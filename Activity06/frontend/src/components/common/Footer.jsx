import { FaFilm, FaGithub, FaHeart } from 'react-icons/fa'
import '../../App.css'

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="app-container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaFilm style={{ color: '#764ba2' }} />
            <span style={{ color: 'white', fontWeight: 'bold' }}>MovieReviews</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#d1d5db', transition: 'color 0.3s' }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = '#d1d5db'}
            >
              <FaGithub style={{ fontSize: '1.25rem' }} />
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>Made with</span>
              <FaHeart style={{ color: '#ef4444' }} />
              <span>for movie lovers</span>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '1.5rem',
          textAlign: 'center',
        }}>
          <p>&copy; 2024 MovieReviews. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer