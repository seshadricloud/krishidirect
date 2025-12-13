import React from 'react';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  size = 'medium',
  interactive = false,
  onRatingChange
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-2xl';
      default:
        return 'text-xl';
    }
  };

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${getSizeClass()}`}>
      {Array.from({ length: totalStars }, (_, index) => {
        const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;
        const isFilled = index < Math.floor(displayRating);
        const isPartial = index === Math.floor(displayRating) && displayRating % 1 !== 0;
        const partialPercent = isPartial ? (displayRating % 1) * 100 : 0;

        return (
          <div
            key={index}
            className={`relative ${interactive ? 'cursor-pointer' : ''}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Background (empty) star */}
            <svg
              className="text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{ width: '1em', height: '1em' }}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

            {/* Foreground (filled) star */}
            {(isFilled || isPartial) && (
              <svg
                className="absolute top-0 left-0 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                style={{
                  width: '1em',
                  height: '1em',
                  clipPath: isPartial
                    ? `inset(0 ${100 - partialPercent}% 0 0)`
                    : undefined
                }}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};
