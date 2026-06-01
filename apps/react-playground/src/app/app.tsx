// Uncomment this line to use CSS modules
import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  return (
    <div className={styles.app}>
      <header>
        <h1 className="app-title">My App</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <h1>Welcome to React Playground!</h1>
        <Routes>
          <Route path="/" element={<h2>Home Page</h2>} />
          <Route path="/about" element={<h2>About Page</h2>} />
        </Routes>
      </main>
      <footer>
        <p>&copy; 2023 My App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
