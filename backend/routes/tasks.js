const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// POST /tasks - create a new task
router.post('/', async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const newTask = new Task({ title, description, status });
        const savedTask = await newTask.save();
        res.status(201).json({ savedTask });
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
})

// GET /tasks - fetch all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

module.exports = router;