import { useState } from 'react';

const step = 10;
export default function ProgressBar() {
  const [progress, setProgress] = useState<number>(0);

  const increment = () => {
    setProgress((value) => Math.min(value + step, 100));
  };
  const decrement = () => {
    setProgress((value) => Math.max(value - step, 0));
  };

  return (
    <>
      <h1>Progress Bar</h1>
      <button onClick={() => increment()}>Increment</button>
      <div
        style={{
          width: '20rem',
          height: '20px',
          border: '1px solid black',
          margin: '1rem 0',
          borderRadius: '10px',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: 'green',
            height: '20px',
          }}
        ></div>
      </div>
      <button onClick={() => decrement()}>Decrement</button>
    </>
  );
}
