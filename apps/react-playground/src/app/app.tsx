import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';
import { CounterPage } from './pages/CounterPage';
import HomePage from './pages/HomePage';
import { StarRatingPage } from './pages/StarRatingPage';
import { TodoPage } from './pages/TodoPage';

export function App() {
  return (
    <div className={styles.app}>
      <header>
        <h1>React Playground</h1>
      </header>

      <main>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/counter">Counter</Link>
            </li>
            <li>
              <Link to="/star-rating">Star Rating</Link>
            </li>
            <li>
              <Link to="/todo">ToDo</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/counter" element={<CounterPage />} />
            <Route path="/star-rating" element={<StarRatingPage />} />
            <Route path="/todo" element={<TodoPage />} />
          </Routes>
        </div>
      </main>
      <footer>
        <p>&copy; 2026 React Playground</p>
      </footer>
    </div>
  );
}

export default App;
