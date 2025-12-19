const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// POST /tasks - create a new task
router.post('/', async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const newTask = new Task({ title, description, status });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
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
 
//DELETE /tasks/:id - delete a task
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//UPDATE /tasks/:id - update a task as completed
router.put('/:id', async(req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true}
        );
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//UPDATE /tasks/:id - edit a task
router.put('/:id', async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, status },
            { new: true }
        );
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;