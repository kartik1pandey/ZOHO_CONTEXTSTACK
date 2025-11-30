const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Create task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tasks by channel
router.get('/:channelId', async (req, res) => {
  try {
    const tasks = await Task.find({ channelId: req.params.channelId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;