import { useState } from 'react';
import { Counter } from '../Components/Counter/counter';

export function CounterPage() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Counter Demo</h1>

      <Counter
        count={count}
        onIncrement={() => setCount(c => c + 1)}
        onDecrement={() => setCount(c => c - 1)}
      />
    </>
  );
}