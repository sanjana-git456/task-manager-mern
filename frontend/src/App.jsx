import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  //fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/tasks`);
        setTasks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTasks();
  }, []);

  //delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task: ', err);
    }
  };

  //update task as completed/pending
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
      const res = await axios.put(`http://localhost:5000/tasks/${id}`, { status: newStatus });
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === id ? res.data : task)
      );
    } catch (err) {
      console.error('Error updating task status: ', err);
    }
  };

  //update/edit task
  //tracks tasks being edited
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  //function to start editing
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditingTitle(task.title);
    setEditingDescription(task.description);
  }

  //save changes made
  const saveEdit = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/tasks/${id}`, {
        title: editingTitle,
        description: editingDescription,
      });
      console.log('Response:', res.data);
      setTasks(prevTasks =>
        prevTasks.map(task => (task._id === id ? res.data : task))
      );
      setEditingTaskId(null);
      setEditingTitle('');
      setEditingDescription('');
    } catch (err) {
      console.error('Error editing task: ', err);
    }
  };

  //count
  const pendingCount = tasks.filter(task => task.status === 'pending').length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;

  //handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const res = await axios.post('http://localhost:5000/tasks', {
        title,
        description
      });
      setTasks(prevTasks => [...prevTasks, res.data]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.log(err);
    }
  };

  //filter
  const [filter, setFilter] = useState('all');

  return (
    <div>
      <h1>Task Manager</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <div>
        <p>Pending: {pendingCount} | Completed: {completedCount}</p>
      </div>

      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>

      <ul>
        {tasks
        .filter(task => filter === 'all' || task.status === filter)
        .map(task => (
          <li
            key={task._id}
            style={{
              textDecoration: task.status === 'completed' ? 'line-through' : 'none',
              color: task.status === 'completed' ? 'gray' : 'black'
            }}
          >
            {editingTaskId === task._id ? (
              <>
                <input value={editingTitle} onChange={e => setEditingTitle(e.target.value)} />
                <input value={editingDescription} onChange={e => setEditingDescription(e.target.value)} />
                <button type="button" onClick={() => saveEdit(task._id)}>Save</button>
                <button type="button" onClick={() => setEditingTaskId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{task.title}</strong>: {task.description} [{task.status}]
                <button onClick={() => deleteTask(task._id)}>Delete</button>
                <button
                  onClick={() => toggleStatus(task._id, task.status)}
                  style={{
                    backgroundColor: task.status === 'pending' ? 'green' : 'orange',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    marginLeft: '10px',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  {task.status === 'pending' ? 'Mark Completed' : 'Mark Pending'}
                </button>
                <button onClick={() => startEditing(task)}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App;