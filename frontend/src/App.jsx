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
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', fontFamily: 'Times New Roman, sans-serif' }}>
      <div>
        <h1 style={{ textAlign: 'center', color: '#131558ff' }}>Task Manager</h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px'}}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '8px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Task</button>
        </form>

        <div>
          <p>Pending: {pendingCount} | Completed: {completedCount}</p>
        </div>

        <div style={{ margin: '10px 0' }}>
          <div
            style={{
              height: '8px',
              backgroundColor: '#eee',
              borderRadius: '5px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(completedCount / (pendingCount + completedCount || 1)) * 100}%`,
                backgroundColor: '#4CAF50'
              }}
            />
        </div>
      </div>        

        <div>
          <button
          onClick={() => setFilter('all')}
          style={{
            padding: '6px 12px',
            marginRight: '8px',
            borderRadius: '20px',
            backgroundColor: filter === 'all' ? '#474979ff' : '#f5f5f5',
            color: filter === 'all' ? 'white' : 'black',
            cursor: 'pointer'
          }}
          >
            All
          </button>
          <button onClick={() => setFilter('pending')}
          style={{
            padding: '6px 12px',
            marginRight: '8px',
            borderRadius: '20px',
            backgroundColor: filter === 'pending' ? '#474979ff' : '#f5f5f5',
            color: filter === 'pending' ? 'white' : 'black',
            cursor: 'pointer'
          }}
            >
              Pending
          </button>
          <button onClick={() => setFilter('completed')}
          style={{
            padding: '6px 12px',
            marginRight: '8px',
            borderRadius: '20px',
            backgroundColor: filter === 'completed' ? '#474979ff' : '#f5f5f5',
            color: filter === 'completed' ? 'white' : 'black',
            cursor: 'pointer'
          }}
            >
              Completed
          </button>
        </div>

        <ul>
          {tasks
          .filter(task => filter === 'all' || task.status === filter)
          .map(task => (
            <li
              key={task._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 15px',
                marginBottom: '8px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                backgroundColor: task.status === 'completed' ? '#f0f0f0' : '#fff',
              }}
            >
              {editingTaskId === task._id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                  <input
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                  />

                  <input
                    value={editingDescription}
                    onChange={e => setEditingDescription(e.target.value)}
                    style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                  />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => saveEdit(task._id)}
                      style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}
                      >
                        Save
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingTaskId(null)}
                      style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#ccc', color: 'black', cursor: 'pointer' }}
                      >
                        Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1, minwidth: '150px' }}>
                    <strong>{task.title}</strong>: {task.description} [{task.status}]
                  </div>

                  <div style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? 'gray' : 'black', flex: 1 }}>
                    <strong>{task.title}</strong>: {task.description} [{task.status}]
                  </div>


                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                    onClick={() => deleteTask(task._id)}
                    style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#f44336', color: 'white', cursor: 'pointer', fontFamily: 'Times New Roman, sans-serif' }}
                    >
                      Delete
                    </button>
                                  
                  <button
                    onClick={() => toggleStatus(task._id, task.status)}
                    style={{
                      backgroundColor: task.status === 'pending' ? 'green' : 'orange',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      marginLeft: '10px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontFamily: 'Times New Roman, sans-serif'
                    }}
                  >
                    {task.status === 'pending' ? 'Mark Completed' : 'Mark Pending'}
                  </button>
                  <button
                  onClick={() => startEditing(task)}
                  style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#2196F3', color: 'white', cursor: 'pointer', fontFamily: 'Times New Roman, sans-serif' }}
                  >
                    Edit
                  </button>
                </div>
              </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App;