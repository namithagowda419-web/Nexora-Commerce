import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, reviewsCount, size = 'sm', interactive = false, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5];
  const starSizeClass = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars.map((star) => {
          const isFilled = star <= Math.floor(rating);
          const isHalf = star === Math.ceil(rating) && rating % 1 !== 0;

          return (
            <button
              key={star}
              type={interactive ? 'button' : 'button'}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(star)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            >
              <Star
                className={`${starSizeClass} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-200 text-amber-400'
                    : 'fill-gray-200 text-gray-300 dark:fill-gray-700 dark:text-gray-600'
                }`}
              />
            </button>
          );
        })}
      </div>
      {reviewsCount !== undefined && (
        <span className="text-xs text-charcoal-muted dark:text-gray-400 font-medium ml-1">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
