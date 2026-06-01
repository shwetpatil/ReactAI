import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';
import CopilotPage from './pages/CopilotPage';
import ResumeParser from './pages/ResumeParser';

export function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>🤖 AI Playground</h1>
      </header>

      <main className={styles.main}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <Link to="/Copilot">💬 Copilot</Link>
            </li>

            <li>
              <Link to="/ResumeParser">
                📄 Resume Parser
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<CopilotPage />} />
            <Route path="/Copilot" element={<CopilotPage />} />
            <Route
              path="/ResumeParser"
              element={<ResumeParser />}
            />
          </Routes>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2026 AI Playground</p>
      </footer>
    </div>
  );
}

export default App;