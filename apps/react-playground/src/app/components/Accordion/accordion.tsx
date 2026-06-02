import { useState } from 'react';
import styles from './accordion.module.css';

type Section = {
  id: string;
  title: string;
  content: string;
};

const data: { sections: Section[] } = {
  sections: [
    {
      id: '1',
      title: 'HTML',
      content: 'HTML is the standard markup language for web pages.',
    },
    {
      id: '2',
      title: 'CSS',
      content: 'CSS is used to style web pages.',
    },
    {
      id: '3',
      title: 'JavaScript',
      content: 'JavaScript adds interactivity to web pages.',
    },
  ],
};

export function Accordion() {
  const [openSections, setOpenSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className={styles.container}>
      <h1>Accordion</h1>

      {data.sections.map((item) => (
        <div key={item.id}>
          <div className={styles.expander}>
            <h3>{item.title}</h3>

            <button
              type="button"
              aria-expanded={!!openSections[item.id]}
              aria-controls={`content-${item.id}`}
              onClick={() => toggleSection(item.id)}
            >
              {openSections[item.id] ? '▼' : '▶'}
            </button>
          </div>

          {openSections[item.id] && (
            <div id={`content-${item.id}`}>
              <p>{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Accordion;