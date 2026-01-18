import { Link } from 'react-router-dom'
import { FaStar, FaClock, FaCalendarAlt } from 'react-icons/fa'
import '../../App.css'

const MovieCard = ({ movie }) => {
  // Use placeholder images if TMDB images are not available
  const getImageUrl = (path) => {
    if (!path) {
      return `https://via.placeholder.com/300x450/1f2937/ffffff?text=${encodeURIComponent(movie.title.slice(0, 20))}`
    }
    if (path.startsWith('http')) {
      return path
    }
    return `${import.meta.env.VITE_TMDB_IMAGE_URL}${path}`
  }

  const imageUrl = getImageUrl(movie.poster_path)

  return (
    <div className="card-dark" style={{
      borderRadius: '0.5rem',
      overflow: 'hidden',
      transition: 'transform 0.3s, box-shadow 0.3s',
      height: '100%',
    }}>
      <div style={{ position: 'relative' }}>
        <img 
          src={imageUrl} 
          alt={movie.title}
          style={{
            width: '100%',
            height: '250px',
            objectFit: 'cover',
          }}
        />
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          backgroundColor: '#fbbf24',
          color: '#1f2937',
          padding: '0.25rem 0.5rem',
          borderRadius: '9999px',
          fontWeight: 'bold',
          fontSize: '0.875rem',
        }}>
          {((parseFloat(movie.vote_average) || 0) || 0).toFixed(1)}/10
        </div>
      </div>
      
      <div style={{ padding: '1rem' }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '0.5rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>{movie.title}</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', color: '#9ca3af', marginBottom: '0.5rem' }}>
          <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
          <span>{new Date(movie.release_date).getFullYear()}</span>
        </div>
        
        {movie.runtime && (
          <div style={{ display: 'flex', alignItems: 'center', color: '#9ca3af', marginBottom: '0.75rem' }}>
            <FaClock style={{ marginRight: '0.5rem' }} />
            <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
          </div>
        )}
        
        <p style={{
          color: '#d1d5db',
          fontSize: '0.875rem',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.4',
        }}>{movie.overview}</p>
        
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {movie.genres?.split(',').slice(0, 3).map((genre, index) => (
              <span 
                key={index}
                style={{
                  backgroundColor: '#764ba2',
                  color: 'white',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                }}
              >
                {genre.trim()}
              </span>
            ))}
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            backgroundColor: '#dc2626',
            color: 'white',
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
          }}>
            {movie.age_rating || 'PG-13'}
          </span>
          
          <Link 
            to={`/movie/${movie.id}`}
            style={{
              background: 'linear-gradient(to right, #667eea, #764ba2)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'opacity 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MovieCard