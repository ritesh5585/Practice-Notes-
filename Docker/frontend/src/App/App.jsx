import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [users, setusers] = useState([]);

  useEffect(() => {
    axios.get("/api/user").then((response) => {
      setusers(response.data);
    });
  }, []);

  return (
    <>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  );
};

export default App;
