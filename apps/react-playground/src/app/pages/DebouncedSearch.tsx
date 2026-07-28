import React from "react";

type Product = {
  id: number;
  title: string;
};

export default function DebouncedSearch() {
  const [input, setInput] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [data, setData] = React.useState<Product[]>([]);

  // Debounce the search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(input);
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);

  // Fetch products whenever the debounced query changes
  React.useEffect(() => {
    if (!query.trim()) {
      setData([]);
      return;
    }

    const searchProducts = async () => {
      try {
        const response = await fetch(
          `https://dummyjson.com/products/search?q=${query}`
        );

        const result = await response.json();
        setData(result.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    searchProducts();
  }, [query]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {data.map((product) => (
        <p key={product.id}>{product.title}</p>
      ))}
    </div>
  );
}