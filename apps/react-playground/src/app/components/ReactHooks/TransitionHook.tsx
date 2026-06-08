import React, { useState, useTransition } from "react";

const users = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
}));

export default function SearchWithTransition() {
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    // High priority update
    setQuery(value);
    // Low priority update
    startTransition(() => {
      const results = users.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredUsers(results);
    });
  };

  return (
    <div>
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search users..."
      />

      {isPending && <p>Loading results...</p>}

      <ul>
        {filteredUsers.slice(0, 20).map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}