import React, { useState } from "react";

const App = () => {
  const data = ["React", "Node", "MongoDB", "Express"];
  const [query, setQuery] = useState("");

  return (
    <div>
      <h1>Search Example</h1>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <h2>Results:</h2>
      <ul>
        {data
          .filter((e) => e.toLowerCase().includes(query.toLowerCase()))
          .map((items, index) => {
            return <li key={index}>{items}</li>;
          })}
      </ul>
    </div>
  );
};

export default App;
