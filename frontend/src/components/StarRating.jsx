import React, { useState } from 'react';
import { Star } from 'lucide-react';

const STAR_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

export default function StarRating({ title, subtitle, rating, onChange }) {
  const [hover, setHover] = useState(0);

  const displayRating = hover || rating;

  return (
    <div className="rating-row">
      <div className="rating-label-group">
        <span className="rating-title">{title}</span>
        <span className="rating-subtitle">
          {displayRating > 0 ? `${STAR_LABELS[displayRating]} (${displayRating}/5)` : subtitle || 'Tap to rate'}
        </span>
      </div>

      <div className="stars-group">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= (hover || rating);
          return (
            <button
              key={star}
              type="button"
              className={`star-btn ${isActive ? 'active' : ''}`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => onChange(star)}
              aria-label={`Rate ${star} stars out of 5 for ${title}`}
            >
              <Star
                size={22}
                fill={isActive ? '#fbbf24' : 'transparent'}
                stroke={isActive ? '#fbbf24' : '#475569'}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
