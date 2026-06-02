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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

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
          <button
            type="button"
            className={styles.expander}
            onClick={() => toggleSection(item.id)}
            aria-expanded={!!openSections[item.id]}
          >
            <h3>{item.title}</h3>

            <span
              className={`${styles['accordion-icon']} ${
                openSections[item.id] ? styles['accordion-icon--rotated'] : ''
              }`}
            />
          </button>

          {openSections[item.id] && (
            <div>
              <p>{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Accordion;
