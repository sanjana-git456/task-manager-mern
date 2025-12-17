const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/tasks');

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected!'))
.catch(err => console.log(err));

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('Server is running!');
});
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});