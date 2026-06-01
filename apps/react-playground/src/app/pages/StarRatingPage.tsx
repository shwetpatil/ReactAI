import { useState } from 'react';
import { StarRating } from '../Components/StartRating/StarRating';

export function StarRatingPage() {
  const [count, setStarCount] = useState(0);

  return (
    <>
      <h1>Star Rating Demo</h1>

      <StarRating
        starCount={count}
        maxStars={5}
        onRatingChange={setStarCount}
      />

      <p>Selected Rating: {count}</p>
    </>
  );
}
