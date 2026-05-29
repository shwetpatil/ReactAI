import { useRef, useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function App() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const serverUrl =
    import.meta.env.VITE_SERVER_AI_URL ?? 'http://localhost:3333';

  async function askAI() {
    if (!prompt.trim()) {
      return;
    }

    const userPrompt = prompt;
    setPrompt('');
    setIsLoading(true);

    abortRef.current = new AbortController();

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userPrompt,
      },
      {
        role: 'assistant',
        content: 'Waiting for server response...',
      },
    ]);

    try {
      const response = await fetch(`${serverUrl}/api/ai`, {
        method: 'POST',
        signal: abortRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'LLM request failed.');
      }

      setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          role: 'assistant',
          content: data.text ?? '',
        };

        return updated;
      });
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
      abortRef.current = null;
    }
  }

  function stopGeneration() {
    abortRef.current?.abort();
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
      <h1>Gemini AI Chat</h1>

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