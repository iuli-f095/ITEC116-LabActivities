import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StarRating from './StarRating';
import { FaEdit, FaTrash, FaUser, FaCalendarAlt } from 'react-icons/fa';
import '../../App.css';

const ReviewCard = ({ review, onDelete, onEdit, showMovie = false, currentUserId }) => {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canEdit = user && (user.id === review.user_id || user.id === currentUserId);

  return (
    <div className="card-dark" style={{ marginBottom: '1rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaUser style={{ color: '#764ba2' }} />
            <span style={{ color: 'white', fontWeight: '500' }}>{review.user?.username || 'Unknown User'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af' }}>
            <FaCalendarAlt />
            <span style={{ fontSize: '0.875rem' }}>{formatDate(review.created_at)}</span>
          </div>
        </div>

        {canEdit && (onDelete || onEdit) && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onEdit && (
              <button
                onClick={() => onEdit(review)}
                style={{
                  color: '#2563eb',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
                title="Edit review"
                onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
                onMouseLeave={(e) => e.target.style.color = '#2563eb'}
              >
                <FaEdit />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(review.id)}
                style={{
                  color: '#dc2626',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
                title="Delete review"
                onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                onMouseLeave={(e) => e.target.style.color = '#dc2626'}
              >
                <FaTrash />
              </button>
            )}
          </div>
        )}
      </div>

      {showMovie && review.movie && (
        <div style={{ marginBottom: '1rem' }}>
          <Link
            to={`/movie/${review.movie.id}`}
            style={{
              color: '#a78bfa',
              fontWeight: '500',
            }}
            onMouseEnter={(e) => e.target.style.color = '#c4b5fd'}
            onMouseLeave={(e) => e.target.style.color = '#a78bfa'}
          >
            {review.movie.title}
          </Link>
        </div>
      )}

      <div style={{ marginBottom: '0.75rem' }}>
        <StarRating rating={review.rating} editable={false} />
      </div>

      {review.comment && (
        <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>{review.comment}</p>
      )}
    </div>
  );
};

export default ReviewCard;