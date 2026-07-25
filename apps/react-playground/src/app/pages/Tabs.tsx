import React from 'react';

const tabsContent = [
  {
    title: 'HTML',
    content: `The HyperText Markup Language or HTML is the standard markup language
for documents designed to be displayed in a web browser.`,
  },
  {
    title: 'CSS',
    content: `Cascading Style Sheets is a style sheet language used for describing
the presentation of a document written in a markup language such as
HTML or XML.`,
  },
  {
    title: 'JavaScript',
    content: `JavaScript, often abbreviated as JS, is a programming language that is
one of the core technologies of the World Wide Web, alongside HTML and
CSS.`,
  },
];

export default function Tabs() {
  const [count, setCount] = React.useState<number>(0);

  return (
    <div>
      <div>
        {tabsContent.map((item, index) => (
          <button
            style={{ background: '#065d31' }}
            key={item.title}
            onClick={() => setCount(index)}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div style={{ background: '#DDFFEE' }}>
        <p>{tabsContent[count].content}</p>
      </div>
    </div>
  );
}
