import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieAPI } from '../../api';
import MovieCard from './MovieCard';
import { FaSearch, FaPlus, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../../App.css';

const MovieList = ({ showAddButton = false, onAddClick }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genres.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchQuery, movies]);

  const fetchMovies = async () => {
    try {
      const data = await movieAPI.getAllMovies();
      setMovies(data);
      setFilteredMovies(data);
    } catch (error) {
      toast.error('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
      }}>
        <FaSpinner style={{
          fontSize: '3rem',
          color: '#764ba2',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: 'white',
          margin: 0,
        }}>
          All Movies ({filteredMovies.length})
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex' }}>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRight: 'none',
                borderRadius: '0.375rem 0 0 0.375rem',
                fontSize: '0.875rem',
                minWidth: '200px',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#764ba2',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0 0.375rem 0.375rem 0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <FaSearch />
            </button>
          </form>
          
          {showAddButton && onAddClick && (
            <button
              onClick={onAddClick}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
              }}
            >
              <FaPlus />
              Add Movie
            </button>
          )}
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 0',
          color: '#d1d5db',
        }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            {searchQuery ? 'No movies found matching your search.' : 'No movies available.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MovieList;