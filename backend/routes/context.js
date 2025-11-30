const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const Message = require('../models/Message');
const Doc = require('../models/Doc');
const { getCache, setCache } = require('../utils/cache');

router.post('/', async (req, res) => {
  try {
    const { channelId, messageId, limit = 8 } = req.body;
    const startTime = Date.now();

    // Check cache
    const cacheKey = `context:${channelId}:${messageId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log('✅ Cache hit');
      return res.json({ ...cached, fromCache: true });
    }

    // 1) Fetch last messages from DB
    const messages = await Message.find({ channelId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // 2) Get target message
    const target = await Message.findOne({ channelId, messageId }).lean();
    if (!target) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // 3) Extract actions from NLP service
    let actions = [];
    try {
      const nlpResp = await fetch(`${process.env.NLP_URL}/nlp/extract_actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: target.text })
      });
      actions = await nlpResp.json();
    } catch (err) {
      console.error('NLP service error:', err.message);
    }

    // 4) Get relevant docs via embedding search
    let relevantDocs = [];
    try {
      const docResp = await fetch(`${process.env.NLP_URL}/nlp/search_docs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: target.text, topK: 3 })
      });
      relevantDocs = await docResp.json();
    } catch (err) {
      console.error('Doc search error:', err.message);
    }

    // 5) Generate suggested reply
    const suggestedReply = generateReply(actions, target);

    const response = {
      messages: messages.reverse(),
      actions: actions || [],
      relevantDocs: relevantDocs || [],
      suggestedReply,
      meta: {
        generatedAt: new Date().toISOString(),
        latencyMs: Date.now() - startTime
      }
    };

    // Cache for 5 minutes
    await setCache(cacheKey, response, 300);

    res.json(response);
  } catch (error) {
    console.error('Context route error:', error);
    res.status(500).json({ error: error.message });
  }
});

function generateReply(actions, message) {
  if (!actions || actions.length === 0) {
    return "Thanks for sharing! Can you provide more details?";
  }
  
  const action = actions[0];
  if (action.owner) {
    return `Noted: ${action.text} — assigning to ${action.owner}.`;
  }
  
  return `Got it! I'll help with: ${action.text}`;
}

module.exports = router;