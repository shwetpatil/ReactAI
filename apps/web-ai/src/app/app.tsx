import { useRef, useState } from 'react';
import { askGeminiStream } from '@org/ai';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function App() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const abortRef = useRef(false);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  async function askAI() {
    if (!prompt.trim()) {
      return;
    }

    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Missing VITE_GEMINI_API_KEY in apps/web-ai/.env.local',
        },
      ]);
      return;
    }

    const userPrompt = prompt;

    setPrompt('');
    setIsLoading(true);

    abortRef.current = false;

    // Add user message + empty assistant message
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userPrompt,
      },
      {
        role: 'assistant',
        content: '',
      },
    ]);

    try {
      let accumulated = '';

      for await (const chunk of askGeminiStream(
        userPrompt,
        apiKey
      )) {
        if (abortRef.current) {
          break;
        }

        accumulated += chunk;

        const currentContent = accumulated;

        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            role: 'assistant',
            content: currentContent,
          };

          return updated;
        });
      }
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          role: 'assistant',
          content:
            error instanceof Error
              ? error.message
              : 'Request failed.',
        };

        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }

  function stopGeneration() {
    abortRef.current = true;
    setIsLoading(false);
  }

  function clearChat() {
    setPrompt('');
    setMessages([]);
  }

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 900,
        margin: '0 auto',
      }}
    >
      <h1>Gemini Streaming Chat</h1>

      <textarea
        rows={6}
        cols={80}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask Gemini anything..."
      />

      <br />
      <br />

      <div
        style={{
          display: 'flex',
          gap: '12px',
        }}
      >
        <button
          onClick={askAI}
          disabled={isLoading}
        >
          {isLoading ? 'Thinking...' : 'Ask AI'}
        </button>

        <button
          onClick={stopGeneration}
          disabled={!isLoading}
        >
          Stop
        </button>

        <button onClick={clearChat}>
          Clear
        </button>
      </div>

      <hr />

      <div style={{ marginTop: '20px' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '16px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <strong>
              {msg.role === 'assistant'
                ? '🤖 Gemini'
                : '👤 You'}
            </strong>

            <pre
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                marginTop: '8px',
              }}
            >
              {msg.content}

              {idx === messages.length - 1 &&
                msg.role === 'assistant' &&
                isLoading &&
                '▋'}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;