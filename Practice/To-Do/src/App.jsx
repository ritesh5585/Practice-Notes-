import React from "react";
import { useState, useEffect } from "react";

const App = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    console.log(task);
    if (task.trim() !== "") {
      setTasks([...tasks, task]);
    }
  };
  return (
    <>
      <div className="to-do">
        <div className="header">
          <input type="text" placeholder="Add a task" />
          <button onClick={() => addTask(document.querySelector('input').value)}>Add</button>
        </div>
        <div className="todo-list">
          <h1>
            {tasks.map((task, index) => (
              <div key={index}>{task}</div>
            ))}
          </h1>
        </div>
      </div>
    </>
  );
};

export default App;
