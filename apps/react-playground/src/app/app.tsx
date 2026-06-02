import styles from './app.module.css';

import { Link, Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import { CounterPage } from './pages/CounterPage';
import { StarRatingPage } from './pages/StarRatingPage';
import { TodoPage } from './pages/TodoPage';
import { FormPage } from './pages/FormPage';

import { Accordion } from './Components/Accordion/accordion';
import { TrafficLight } from './Components/TrafficLight/TrafficLight';

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
              <Link to="/todo">Todo</Link>
            </li>

            <li>
              <Link to="/form">Form</Link>
            </li>

            <li>
              <Link to="/accordion">Accordion</Link>
            </li>

            <li>
              <Link to="/traffic-light">Traffic Light</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/counter" element={<CounterPage />} />
            <Route path="/star-rating" element={<StarRatingPage />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/accordion" element={<Accordion />} />
            <Route
              path="/traffic-light"
              element={<TrafficLight />}
            />
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