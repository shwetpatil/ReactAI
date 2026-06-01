import styles from './counter.module.css';

type CounterProps = {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function Counter({
  count,
  onIncrement,
  onDecrement,
}: CounterProps) {
  return (
    <div className={styles.container}>
      <h2>Counter</h2>

      <div className={styles.count}>
        {count}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.button}
          onClick={onDecrement}
        >
          -
        </button>

        <button
          className={styles.button}
          onClick={onIncrement}
        >
          +
        </button>
      </div>
    </div>
  );
}