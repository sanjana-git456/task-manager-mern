import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  //fetch tasks from backend
  useEffect(() => {
    fetch('http://localhost:5000/tasks')
    .then(res => res.json())
    .then(data => setTasks(data))
    .catch(err => console.log(err));
  }, []);

  //handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    const newTask = { title, description };
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
    const data = await res.json();
    setTasks([...tasks, data]);
    setTitle('');
    setDescription('');
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <form onSubmit={handleSubmit}>
        <input
          type = "text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        
        <input
          type = "text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <button type = "submit">Add Task</button>
      </form>

      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <strong>{task.title}</strong>: {task.description} [{task.status}]
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App;