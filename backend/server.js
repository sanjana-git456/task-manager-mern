const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/tasks');
const Task = require('./models/Task');

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected!'))
.catch(err => console.log(err));

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/tasks', taskRoutes);

app.delete('/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Server is running!');
});
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});