import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';
import CopilotPage from './pages/CopilotPage';
import ResumeParser from './pages/ResumeParser';

export function App() {
  return (
    <div className={styles.app}>
      <header>
        <h1>LLM Playground</h1>
      </header>

      <main>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Copilot">Copilot</Link>
            </li>
             <li>
              <Link to="/ResumeParser">ResumeParser</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<CopilotPage />} />
            <Route path="/Copilot" element={<CopilotPage />} />
            <Route path="/ResumeParser" element={<ResumeParser />} />
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
