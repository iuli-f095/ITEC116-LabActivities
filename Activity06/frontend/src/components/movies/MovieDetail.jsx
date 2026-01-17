import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { movieAPI, reviewAPI } from '../../api';
import ReviewForm from '../reviews/ReviewForm';
import ReviewCard from '../reviews/ReviewCard';
import StarRating from '../reviews/StarRating';
import { 
  FaArrowLeft, FaClock, FaCalendarAlt, FaUser, 
  FaFilm, FaStar, FaEdit, FaTrash 
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../../App.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      let movieRes;
      try {
        movieRes = await movieAPI.getMovieById(id);
      } catch (error) {
        if (error.message.includes('404')) {
          // Assume it's a TMDB ID, seed and get details
          movieRes = await movieAPI.getTMDBDetails(id);
        } else {
          throw error;
        }
      }
      
      const reviewsRes = await reviewAPI.getMovieReviews(movieRes.id);
      
      setMovie(movieRes);
      setReviews(reviewsRes);
      
      if (reviewsRes.length > 0) {
        const avg = reviewsRes.reduce((sum, review) => sum + review.rating, 0) / reviewsRes.length;
        setAverageRating(avg);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch movie details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async () => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    
    try {
      await movieAPI.deleteMovie(id);
      toast.success('Movie deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete movie');
    }
  };

  const handleReviewAdded = () => {
    fetchMovieDetails();
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewAPI.deleteReview(reviewId);
      toast.success('Review deleted');
      fetchMovieDetails();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

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
    );
  }

  if (!movie) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <p style={{ color: '#d1d5db', fontSize: '1.25rem' }}>Movie not found</p>
      </div>
    );
  }

  const imageUrl = movie.backdrop_path 
    ? `${import.meta.env.VITE_TMDB_IMAGE_URL}${movie.backdrop_path}`
    : 'https://via.placeholder.com/1200x400?text=No+Image';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          marginBottom: '1.5rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
        onMouseEnter={(e) => e.target.style.color = '#d1d5db'}
        onMouseLeave={(e) => e.target.style.color = 'white'}
      >
        <FaArrowLeft style={{ marginRight: '0.5rem' }} />
        Back
      </button>

      {/* Movie Hero Section */}
      <div style={{ position: 'relative', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, black, transparent)',
        }}></div>
        <img 
          src={imageUrl} 
          alt={movie.title}
          style={{
            width: '100%',
            height: '400px',
            objectFit: 'cover',
          }}
        />
        
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <img 
              src={movie.poster_path ? `${import.meta.env.VITE_TMDB_IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/200x300'}
              alt={movie.title}
              style={{
                width: '200px',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '0.5rem',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                marginRight: '1.5rem',
                display: 'none',
              }}
              className="hidden-md"
            />
            
            <div>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '0.5rem',
              }}>{movie.title}</h1>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <FaStar style={{ color: '#fbbf24', marginRight: '0.5rem' }} />
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{averageRating.toFixed(1)}</span>
                  <span style={{ marginLeft: '0.25rem', color: '#d1d5db' }}>/5 ({reviews.length} reviews)</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                  <span>{new Date(movie.release_date).toLocaleDateString()}</span>
                </div>
                
                {movie.runtime && (
                  <div style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                    <FaClock style={{ marginRight: '0.5rem' }} />
                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                  </div>
                )}
                
                <span style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                }}>
                  {movie.age_rating}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {movie.genres?.split(',').map((genre, index) => (
                  <span 
                    key={index}
                    style={{
                      backgroundColor: '#764ba2',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                    }}
                  >
                    {genre.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Controls */}
      {user && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setEditing(!editing)}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fbbf24',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              gap: '0.5rem',
            }}
          >
            <FaEdit />
            {editing ? 'Cancel Edit' : 'Edit Movie'}
          </button>
          <button
            onClick={handleDeleteMovie}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              gap: '0.5rem',
            }}
          >
            <FaTrash />
            Delete Movie
          </button>
        </div>
      )}

      {/* Movie Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2rem',
      }}>
        {/* Left Column - Movie Info */}
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem',
            }}>Synopsis</h2>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{movie.overview}</p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}>
            <div className="card">
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <FaUser />
                Cast & Crew
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontWeight: '600', color: '#374151' }}>Director:</span>
                  <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>{movie.director || 'Unknown'}</p>
                </div>
                <div>
                  <span style={{ fontWeight: '600', color: '#374151' }}>Actors:</span>
                  <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>{movie.actors || 'Unknown'}</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <FaFilm />
                Movie Details
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontWeight: '600', color: '#374151' }}>Release Date:</span>
                  <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>{new Date(movie.release_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span style={{ fontWeight: '600', color: '#374151' }}>Runtime:</span>
                  <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>{movie.runtime} minutes</p>
                </div>
                <div>
                  <span style={{ fontWeight: '600', color: '#374151' }}>Age Rating:</span>
                  <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>{movie.age_rating}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Review Form */}
          <ReviewForm 
            movieId={movie.id} 
            onReviewAdded={handleReviewAdded} 
            editReview={editingReview}
            onCancelEdit={handleCancelEdit}
          />
          
          {/* Reviews List */}
          <div className="card">
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1.5rem',
            }}>Reviews ({reviews.length})</h2>
            
            {reviews.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>
                No reviews yet. Be the first to review!
              </p>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {reviews.map((review) => (
                  <ReviewCard 
                    key={review.id} 
                    review={review} 
                    onDelete={handleDeleteReview}
                    onEdit={handleEditReview}
                    currentUserId={user?.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .hidden-md {
          display: none;
        }
        @media (min-width: 768px) {
          .hidden-md {
            display: block;
          }
          div[style*="grid-template-columns: 1fr"] {
            grid-template-columns: 2fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MovieDetail;