import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import '../../App.css';

const StarRating = ({ rating, onRatingChange, editable = false, size = 24 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        
        return (
          <label key={index} style={{ cursor: editable ? 'pointer' : 'default' }}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => editable && onRatingChange(ratingValue)}
              style={{ display: 'none' }}
            />
            <FaStar
              style={{
                fontSize: `${size}px`,
                color: ratingValue <= (hover || rating) ? '#fbbf24' : '#d1d5db',
                transition: 'color 0.2s',
              }}
              onMouseEnter={() => editable && setHover(ratingValue)}
              onMouseLeave={() => editable && setHover(0)}
            />
          </label>
        );
      })}
      {rating !== undefined && (
        <span style={{ marginLeft: '0.5rem', color: '#6b7280', fontSize: `${size}px` }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;