import { useEffect, useState } from 'react';
import styles from './TrafficLight.module.css';

type Light = 'red' | 'yellow' | 'green';

const colorTimeMap: Record<Light, number> = {
  red: 4000,
  yellow: 500,
  green: 3000,
};

export function TrafficLight() {
  const [color, setColor] = useState<Light>('red');

  useEffect(() => {
    const timer = setTimeout(() => {
      switch (color) {
        case 'red':
          setColor('green');
          break;

        case 'green':
          setColor('yellow');
          break;

        case 'yellow':
          setColor('red');
          break;
      }
    }, colorTimeMap[color]);

    return () => clearTimeout(timer);
  }, [color]);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.light} ${
          color === 'red' ? styles.red : ''
        }`}
      />

      <div
        className={`${styles.light} ${
          color === 'yellow' ? styles.yellow : ''
        }`}
      />

      <div
        className={`${styles.light} ${
          color === 'green' ? styles.green : ''
        }`}
      />
    </div>
  );
}

export default TrafficLight;