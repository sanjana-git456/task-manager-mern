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
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === id ? { ...task, deleted: true } : task
      )
    );
  };

  //restore deleted task
  const restoreTask = (id) => {
    setTasks(prev =>
      prev.map(task => (task._id === id ? { ...task, deleted: false } : task))
    );
  };

  //permanently delete a task
  const permanentDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task permanently: ', err);
    }
  }

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
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditingTitle(task.title);
    setEditingDescription(task.description);
  }

  const saveEdit = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/tasks/${id}`, {
        title: editingTitle,
        description: editingDescription,
      });
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

  const pendingCount = tasks.filter(task => task.status === 'pending').length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const res = await axios.post('http://localhost:5000/tasks', { title, description });
      setTasks(prevTasks => [...prevTasks, res.data]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.log(err);
    }
  };

  const [filter, setFilter] = useState('all');

  const buttonStyleGreen = { padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer', fontFamily: 'Times New Roman, sans-serif' };
  const buttonStyleRed = { padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#f44336', color: 'white', cursor: 'pointer', fontFamily: 'Times New Roman, sans-serif' };
  const buttonStyleBlue = { padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#2196F3', color: 'white', cursor: 'pointer', fontFamily: 'Times New Roman, sans-serif' };
  const buttonStyleGrey = { padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#ccc', color: 'black', cursor: 'pointer', fontFamily: 'Times New Roman, sans-serif' };
  const inputStyle = { padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' };
  const toggleButtonStyle = (status) => ({
    backgroundColor: status === 'pending' ? 'green' : 'orange',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    marginLeft: '10px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontFamily: 'Times New Roman, sans-serif'
  });

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', fontFamily: 'Times New Roman, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#131558ff' }}>Task Manager</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <button type="submit" style={{ padding: '8px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Task</button>
      </form>

      <div style={{ margin: '10px 0', height: '8px', backgroundColor: '#eee', borderRadius: '5px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(completedCount / (pendingCount + completedCount || 1)) * 100}%`, backgroundColor: '#4CAF50' }} />
      </div>

      <div style={{ margin: '10px 0' }}>
        <button onClick={() => setFilter('all')} style={{ padding: '6px 12px', marginRight: '8px', borderRadius: '20px', backgroundColor: filter==='all'?'#474979ff':'#f5f5f5', color: filter==='all'?'white':'black', cursor:'pointer' }}>All ({tasks.filter(t => !t.deleted).length})</button>
        <button onClick={() => setFilter('pending')} style={{ padding: '6px 12px', marginRight: '8px', borderRadius: '20px', backgroundColor: filter==='pending'?'#474979ff':'#f5f5f5', color: filter==='pending'?'white':'black', cursor:'pointer' }}>Pending ({pendingCount})</button>
        <button onClick={() => setFilter('completed')} style={{ padding: '6px 12px', marginRight: '8px', borderRadius: '20px', backgroundColor: filter==='completed'?'#474979ff':'#f5f5f5', color: filter==='completed'?'white':'black', cursor:'pointer' }}>Completed ({completedCount})</button>
        <button onClick={() => setFilter('recycle')} style={{ padding: '6px 12px', marginRight: '8px', borderRadius: '20px', backgroundColor: filter==='recycle'?'#4CAF50':'#f5f5f5', color: filter==='recycle'?'white':'black', cursor:'pointer' }}>Recycle Bin ({tasks.filter(t=>t.deleted).length})</button>
      </div>

      <ul>
        {tasks.filter(task => {
          if (filter==='all') return !task.deleted;
          if (filter==='pending') return task.status==='pending' && !task.deleted;
          if (filter==='completed') return task.status==='completed' && !task.deleted;
          if (filter==='recycle') return task.deleted;
          return true;
        }).map(task => (
          <li key={task._id} style={{ display:'flex', flexDirection:'column', padding:'10px 15px', marginBottom:'8px', borderRadius:'8px', boxShadow:'0 2px 5px rgba(0,0,0,0.1)', backgroundColor: task.status==='completed'?'#f0f0f0':'#fff', flexWrap:'wrap' }}>
            <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap' }}>
              {filter==='recycle' ? (
                <>
                  <div style={{ flex: 1 }}><strong>{task.title}</strong>: {task.description}</div>
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                    <button onClick={()=>restoreTask(task._id)} style={buttonStyleGreen}>Restore</button>
                    <button onClick={()=>permanentDeleteTask(task._id)} style={buttonStyleRed}>Delete Permanently</button>
                  </div>
                </>
              ) : editingTaskId===task._id ? (
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'6px' }}>
                  <input value={editingTitle} onChange={e=>setEditingTitle(e.target.value)} style={inputStyle}/>
                  <input value={editingDescription} onChange={e=>setEditingDescription(e.target.value)} style={inputStyle}/>
                  <div style={{ display:'flex', gap:'6px' }}>
                    <button onClick={()=>saveEdit(task._id)} style={buttonStyleGreen}>Save</button>
                    <button onClick={()=>setEditingTaskId(null)} style={buttonStyleGrey}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ flex:1, minWidth:'150px', textDecoration: task.status==='completed'?'line-through':'none', color: task.status==='completed'?'gray':'black' }}>
                    <strong>{task.title}</strong>: {task.description} [{task.status}]
                  </div>
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                    <button onClick={()=>deleteTask(task._id)} style={buttonStyleRed}>Delete</button>
                    <button onClick={()=>toggleStatus(task._id, task.status)} style={toggleButtonStyle(task.status)}>
                      {task.status==='pending'?'Mark Completed':'Mark Pending'}
                    </button>
                    <button onClick={()=>startEditing(task)} style={buttonStyleBlue}>Edit</button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App;
