import { useEffect, useState } from 'react';

export default function APIFetch() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      // In your ApiFetch.tsx
      fetch('https://jsonplaceholder.typicode.com/posts')
        .then((response) => response.json())
        .then((data) => {
            setItems(data)
            console.log(data)}
        ); // This will print the list of posts to your console    };
    };
    
    getData();
    
  }, []);

  return (
    <>
    
      {items.map((item) => (
        <li key={item}>{item.title}</li>
      ))}
    </>
  );
}
