import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MovieCard from '../components/movies/MovieCard'
import { movieAPI } from '../api'
import { FaSearch, FaStar, FaFire } from 'react-icons/fa'
import { toast } from 'react-toastify'

const Home = () => {
  const [movies, setMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchMovies()
    fetchPopularMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      const data = await movieAPI.getAllMovies()
      // Sort by release date (newest first)
      const sortedMovies = data.sort((a, b) => 
        new Date(b.release_date) - new Date(a.release_date)
      )
      setMovies(sortedMovies)
    } catch (error) {
      console.error('Failed to fetch movies:', error)
      toast.error('Failed to fetch movies. Using sample data.')
      // Use sample data if API fails
      setMovies(getSampleMovies())
    } finally {
      setLoading(false)
    }
  }

  const fetchPopularMovies = async () => {
    try {
      const data = await movieAPI.getPopularMovies()
      setPopularMovies(data)
    } catch (error) {
      console.error('Failed to fetch popular movies:', error)
      // Use sample popular movies
      const sampleMovies = getSampleMovies()
      setPopularMovies(sampleMovies)
    }
  }

  const getSampleMovies = () => {
    return [
      {
        id: 1,
        tmdb_id: 1234567,
        title: 'KPOP Demon Hunters',
        overview: 'In a world where K-pop idols are secretly demon hunters, a rookie idol group must balance their fame with their duty to protect humanity from supernatural threats.',
        poster_path: 'https://image.tmdb.org/t/p/w500/kpop-demons.jpg',
        backdrop_path: 'https://image.tmdb.org/t/p/w1280/kpop-demons-bg.jpg',
        release_date: '2024-12-15',
        runtime: 138,
        director: 'Kim Jong-un',
        actors: 'Kim Ji-hyun, Park Min-woo, Lee Soo-bin',
        genres: 'Action, Comedy, Fantasy',
        age_rating: 'PG-13',
        vote_average: 8.7,
      },
      {
        id: 2,
        tmdb_id: 1234568,
        title: 'Avatar: Fire and Ash',
        overview: 'Years after the events of The Way of Water, the Sully family faces new threats as they defend Pandora from an even greater danger that emerges from within.',
        poster_path: 'https://image.tmdb.org/t/p/w500/avatar-fire.jpg',
        backdrop_path: 'https://image.tmdb.org/t/p/w1280/avatar-fire-bg.jpg',
        release_date: '2024-12-20',
        runtime: 192,
        director: 'James Cameron',
        actors: 'Sam Worthington, Zoe Saldana, Sigourney Weaver',
        genres: 'Science Fiction, Adventure, Action',
        age_rating: 'PG-13',
        vote_average: 8.9,
      },
      {
        id: 3,
        tmdb_id: 1234569,
        title: 'The Last Ronin',
        overview: 'The final surviving member of a legendary warrior clan must protect a village from a ruthless warlord and his army in feudal Japan.',
        poster_path: 'https://image.tmdb.org/t/p/w500/last-ronin.jpg',
        backdrop_path: 'https://image.tmdb.org/t/p/w1280/last-ronin-bg.jpg',
        release_date: '2024-11-10',
        runtime: 145,
        director: 'Akira Kurosawa',
        actors: 'Ken Watanabe, Hiroyuki Sanada, Rinko Kikuchi',
        genres: 'Action, Drama, Historical',
        age_rating: 'R',
        vote_average: 8.2,
      },
      {
        id: 4,
        tmdb_id: 1234570,
        title: 'Cyberpunk: Neon Dreams',
        overview: 'A rogue netrunner in a dystopian future must navigate the dangerous world of corporate espionage and cybernetic enhancements.',
        poster_path: 'https://image.tmdb.org/t/p/w500/cyberpunk-neon.jpg',
        backdrop_path: 'https://image.tmdb.org/t/p/w1280/cyberpunk-neon-bg.jpg',
        release_date: '2024-11-25',
        runtime: 127,
        director: 'Denis Villeneuve',
        actors: 'Ryan Gosling, Ana de Armas, Michael B. Jordan',
        genres: 'Science Fiction, Thriller, Action',
        age_rating: 'R',
        vote_average: 7.9,
      },
      {
        id: 5,
        tmdb_id: 1234571,
        title: 'The Timekeeper\'s Daughter',
        overview: 'A young woman discovers she has the ability to manipulate time and must use her powers to prevent a temporal catastrophe.',
        poster_path: 'https://image.tmdb.org/t/p/w500/timekeeper.jpg',
        backdrop_path: 'https://image.tmdb.org/t/p/w1280/timekeeper-bg.jpg',
        release_date: '2024-10-30',
        runtime: 135,
        director: 'Christopher Nolan',
        actors: 'Florence Pugh, Timothée Chalamet, Cate Blanchett',
        genres: 'Science Fiction, Drama, Mystery',
        age_rating: 'PG-13',
        vote_average: 8.1,
      }
    ]
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '2px solid #764ba2',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
          Discover & Review Movies
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#d1d5db', marginBottom: '2rem' }}>
          Share your thoughts and ratings for your favorite movies
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              style={{
                flexGrow: 1,
                padding: '0.75rem 1rem',
                border: 'none',
                borderTopLeftRadius: '0.375rem',
                borderBottomLeftRadius: '0.375rem',
                fontSize: '1rem',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#764ba2',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderTopRightRadius: '0.375rem',
                borderBottomRightRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              <FaSearch />
            </button>
          </div>
        </form>
      </div>

      {/* Popular Movies Section */}
      {/*{popularMovies.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <FaFire style={{ color: '#ef4444', fontSize: '1.5rem', marginRight: '0.5rem' }} />
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white' }}>Popular Now</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {popularMovies.map((movie) => (
              <div 
                key={movie.id || movie.tmdb_id}
                style={{ 
                  backgroundColor: '#1f2937', 
                  borderRadius: '0.5rem', 
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/movie/${movie.id || movie.tmdb_id}`)}
              >
                <img 
                  src={movie.poster_path || `https://via.placeholder.com/150x225?text=${encodeURIComponent(movie.title)}`}
                  alt={movie.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ padding: '0.5rem' }}>
                  <h3 style={{ color: 'white', fontWeight: '600', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{movie.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}*/}

      {/* Movies Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaStar style={{ color: '#fbbf24', fontSize: '1.5rem', marginRight: '0.5rem' }} />
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white' }}>Latest Releases</h2>
          </div>
          <span style={{ color: '#d1d5db' }}>
            {movies.length} movies
          </span>
        </div>
        
        {movies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: '#d1d5db', fontSize: '1.25rem' }}>No movies available. Add some movies to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home