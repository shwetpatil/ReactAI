import React from "react";

interface Product {
  id: number;
  title: string;
}

export default function DebouncedSearch() {
  const [input, setInput] = React.useState<string>("");
  const [data, setData] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const trimmedInput = input.trim();

    // 1. Don't search for empty input
    if (!trimmedInput) {
      setData([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    // 2. Debounce API call
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(
            trimmedInput
          )}`,
          { signal }
        );

        // Check HTTP status
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const result = await response.json();

        setData(result.products ?? []);
      } catch (err: unknown) {
        // Ignore aborted requests
        if (err instanceof Error && err.name !== "AbortError") {
          console.error(err);
          setError(err.message);
        }
      } finally {
        // Avoid updating state if request was aborted
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 500);

    // 3. Cleanup:
    // - Cancel debounce timer
    // - Abort any in-flight request
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [input]);

  return (
    <div style={{ padding: "16px" }}>
      <input
        type="text"
        placeholder="Search products..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {isLoading && <p>Loading...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <div>
        {data.map((product) => (
          <p key={product.id}>{product.title}</p>
        ))}
      </div>
    </div>
  );
}

/*
import { useQuery } from '@tanstack/react-query';

interface Todo {
  id: number;
  title: string;
}

// 1. Define your standard fetch function
async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

export function TodoList() {
  // 2. Pass the Query Key and Fetch Function into useQuery
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
  });

  if (isPending) return <p>Loading todos...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <button onClick={() => refetch()}>Manual Refresh</button>
      <ul>
        {data.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
  */