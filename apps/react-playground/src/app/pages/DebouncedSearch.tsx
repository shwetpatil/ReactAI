import React from "react";

type Product = {
  id: number;
  title: string;
};

export default function DebouncedSearch() {
  const [input, setInput] = React.useState("");
  const [data, setData] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      setData([]);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(trimmedInput)}`,
          { signal: controller.signal }
        );
        const result = await response.json();
        setData(result.products ?? []);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error fetching products:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }, 500);

    // Clears the timer IF the user types again within 500ms
    // ALSO cancels any active fetch request if input changes mid-flight
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

      <div>
        {data.map((product) => (
          <p key={product.id}>{product.title}</p>
        ))}
      </div>
    </div>
  );
}