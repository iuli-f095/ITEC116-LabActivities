import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieAPI } from '../../api';
import { toast } from 'react-toastify';
import '../../App.css';

const MovieForm = ({ movie = null, onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tmdb_id: movie?.tmdb_id || '',
    title: movie?.title || '',
    overview: movie?.overview || '',
    poster_path: movie?.poster_path || '',
    backdrop_path: movie?.backdrop_path || '',
    release_date: movie?.release_date?.split('T')[0] || '',
    runtime: movie?.runtime || '',
    director: movie?.director || '',
    actors: movie?.actors || '',
    genres: movie?.genres || '',
    age_rating: movie?.age_rating || 'PG-13',
    vote_average: movie?.vote_average || 0,
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.overview.trim()) newErrors.overview = 'Overview is required';
    if (!formData.release_date) newErrors.release_date = 'Release date is required';
    if (!formData.runtime || formData.runtime < 1) newErrors.runtime = 'Runtime must be positive';
    if (!formData.genres.trim()) newErrors.genres = 'Genres are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const movieData = {
        ...formData,
        tmdb_id: parseInt(formData.tmdb_id),
        runtime: parseInt(formData.runtime),
        vote_average: parseFloat(formData.vote_average),
      };
      
      if (movie) {
        // Update existing movie
        await movieAPI.updateMovie(movie.id, movieData);
        toast.success('Movie updated successfully!');
      } else {
        // Create new movie
        await movieAPI.createMovie(movieData);
        toast.success('Movie created successfully!');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save movie');
    } finally {
      setLoading(false);
    }
  };

  const handleTMDBSearch = async () => {
    if (!formData.tmdb_id) {
      toast.error('Please enter a TMDB ID');
      return;
    }
    
    try {
      const result = await movieAPI.seedFromTMDB(formData.tmdb_id);
      setFormData({
        ...formData,
        title: result.title || formData.title,
        overview: result.overview || formData.overview,
        poster_path: result.poster_path || formData.poster_path,
        backdrop_path: result.backdrop_path || formData.backdrop_path,
        release_date: result.release_date?.split('T')[0] || formData.release_date,
        runtime: result.runtime || formData.runtime,
        director: result.director || formData.director,
        actors: result.actors || formData.actors,
        genres: result.genres || formData.genres,
        age_rating: result.age_rating || formData.age_rating,
        vote_average: result.vote_average || formData.vote_average,
      });
      toast.success('Movie data loaded from TMDB!');
    } catch (error) {
      toast.error('Failed to load from TMDB');
    }
  };

  return (
    <div className="card">
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '1.5rem',
      }}>
        {movie ? 'Edit Movie' : 'Add New Movie'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="number"
              name="tmdb_id"
              placeholder="TMDB ID (optional)"
              value={formData.tmdb_id}
              onChange={handleChange}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            />
            <button
              type="button"
              onClick={handleTMDBSearch}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Load from TMDB
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${errors.title ? '#dc2626' : '#d1d5db'}`,
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            />
            {errors.title && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.title}</p>}
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Release Date *
            </label>
            <input
              type="date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${errors.release_date ? '#dc2626' : '#d1d5db'}`,
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            />
            {errors.release_date && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.release_date}</p>}
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
            Overview *
          </label>
          <textarea
            name="overview"
            value={formData.overview}
            onChange={handleChange}
            required
            rows="4"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: `1px solid ${errors.overview ? '#dc2626' : '#d1d5db'}`,
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              resize: 'vertical',
            }}
          />
          {errors.overview && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.overview}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Poster Path
            </label>
            <input
              type="text"
              name="poster_path"
              value={formData.poster_path}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Backdrop Path
            </label>
            <input
              type="text"
              name="backdrop_path"
              value={formData.backdrop_path}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Runtime (minutes) *
            </label>
            <input
              type="number"
              name="runtime"
              value={formData.runtime}
              onChange={handleChange}
              required
              min="1"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${errors.runtime ? '#dc2626' : '#d1d5db'}`,
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            />
            {errors.runtime && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.runtime}</p>}
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Director
            </label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
            Actors (comma separated)
          </label>
          <input
            type="text"
            name="actors"
            value={formData.actors}
            onChange={handleChange}
            placeholder="Actor 1, Actor 2, Actor 3"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Genres (comma separated) *
            </label>
            <input
              type="text"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              required
              placeholder="Action, Adventure, Sci-Fi"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${errors.genres ? '#dc2626' : '#d1d5db'}`,
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            />
            {errors.genres && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.genres}</p>}
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Age Rating
            </label>
            <select
              name="age_rating"
              value={formData.age_rating}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            >
              <option value="G">G</option>
              <option value="PG">PG</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
              <option value="NC-17">NC-17</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: '500' }}>
            Vote Average (0-10)
          </label>
          <input
            type="number"
            name="vote_average"
            value={formData.vote_average}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.1"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#764ba2',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? '0.5' : '1',
              fontSize: '0.875rem',
            }}
          >
            {loading ? 'Saving...' : (movie ? 'Update Movie' : 'Add Movie')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieForm;