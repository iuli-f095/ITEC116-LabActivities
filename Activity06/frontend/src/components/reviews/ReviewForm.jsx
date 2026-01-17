import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reviewAPI } from '../../api';
import StarRating from './StarRating';
import { toast } from 'react-toastify';
import '../../App.css';

const ReviewForm = ({ movieId, onReviewAdded, editReview = null, onCancelEdit = null }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(editReview ? editReview.rating : 0);
  const [comment, setComment] = useState(editReview ? editReview.comment || '' : '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      if (editReview) {
        await reviewAPI.updateReview(editReview.id, {
          rating,
          comment,
        });
        toast.success('Review updated successfully!');
        onCancelEdit();
      } else {
        await reviewAPI.createReview({
          movie_id: movieId,
          rating,
          comment,
        });
        toast.success('Review submitted successfully!');
        setRating(0);
        setComment('');
      }
      onReviewAdded();
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div style={{
        backgroundColor: '#fef3c7',
        borderLeft: '4px solid #d97706',
        padding: '1rem',
        marginBottom: '1.5rem',
      }}>
        <p style={{ color: '#92400e' }}>
          Please <a href="/login" style={{ fontWeight: 'bold', color: '#92400e' }}>login</a> or{' '}
          <a href="/register" style={{ fontWeight: 'bold', color: '#92400e' }}>register</a> to submit a review.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '1rem',
      }}>Write a Review</h3>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          color: '#374151',
          fontWeight: '600',
          marginBottom: '0.5rem',
        }}>Your Rating</label>
        <StarRating 
          rating={rating} 
          onRatingChange={setRating}
          editable={true}
        />
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          color: '#374151',
          fontWeight: '600',
          marginBottom: '0.5rem',
        }}>Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            minHeight: '100px',
            resize: 'vertical',
          }}
          rows="4"
          placeholder="Share your thoughts about the movie..."
          maxLength="500"
        />
        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
          {comment.length}/500 characters
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        {editReview && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            style={{
              background: '#6b7280',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || rating === 0}
          style={{
            background: 'linear-gradient(to right, #667eea, #764ba2)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.375rem',
            fontWeight: '600',
            cursor: submitting || rating === 0 ? 'not-allowed' : 'pointer',
            opacity: submitting || rating === 0 ? '0.5' : '1',
            fontSize: '0.875rem',
          }}
        >
          {submitting ? 'Submitting...' : editReview ? 'Update Review' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;