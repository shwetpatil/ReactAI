import styles from './StarRating.module.css';

type StarRatingProps = {
  starCount: number;
  maxStars?: number;
  onRatingChange: (rating: number) => void;
};

export function StarRating({
  starCount,
  maxStars = 5,
  onRatingChange,
}: StarRatingProps) {
  return (
    <div className={styles.container}>
      {Array.from({ length: maxStars }, (_, index) => {
        const value = index + 1;

        return (
          <button
            key={value}
            onClick={() => onRatingChange(value)}
          >
            {value <= starCount ? '★' : '☆'}
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;