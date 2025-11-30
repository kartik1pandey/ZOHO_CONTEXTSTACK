const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages by channel
router.get('/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    
    const messages = await Message.find({ channelId })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk ingest messages
router.post('/ingest', async (req, res) => {
  try {
    const { messages } = req.body;
    const inserted = await Message.insertMany(messages, { ordered: false });
    res.json({ success: true, count: inserted.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;