const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const fetch = require('node-fetch');

// Webhook handler for Cliq messages
router.post('/webhook', async (req, res) => {
  try {
    const { event, data } = req.body;
    
    if (event === 'message.created') {
      const { message, channel, user } = data;
      
      // Store message in database
      await Message.create({
        channelId: channel.id,
        messageId: message.id,
        authorName: user.name,
        text: message.text,
        createdAt: new Date(message.time)
      });
      
      // Check if message contains action keywords
      const actionKeywords = ['todo', 'task', 'please', 'can you', 'need to', 'should', 'must'];
      const hasActionKeyword = actionKeywords.some(kw => 
        message.text.toLowerCase().includes(kw)
      );
      
      if (hasActionKeyword) {
        // Extract actions using NLP service
        try {
          const nlpResp = await fetch(`${process.env.NLP_URL}/nlp/extract_actions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: message.text })
          });
          
          const actions = await nlpResp.json();
          
          if (actions && actions.length > 0) {
            // Send notification card to Cliq
            const card = {
              title: '🎯 Action Items Detected',
              theme: 'modern-inline',
              sections: actions.map(action => ({
                type: 'text',
                text: `**${action.text}**\n` +
                      `${action.owner ? `👤 ${action.owner}\n` : ''}` +
                      `${action.deadline ? `⏰ ${action.deadline}\n` : ''}` +
                      `📊 ${(action.score * 100).toFixed(0)}% confidence`
              })),
              buttons: [
                {
                  label: 'Create Task',
                  type: 'invoke.function',
                  name: 'create_task_from_action',
                  id: '1'
                }
              ]
            };
            
            // Return card response
            return res.json({ card });
          }
        } catch (nlpError) {
          console.error('NLP service error:', nlpError);
        }
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Cliq webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Function to create task from Cliq
router.post('/create-task', async (req, res) => {
  try {
    const { title, description, channelId, assignee } = req.body;
    
    const Task = require('../models/Task');
    const task = await Task.create({
      channelId,
      title,
      description,
      assigneeName: assignee,
      status: 'todo'
    });
    
    res.json({
      success: true,
      task,
      message: `✅ Task created: ${title}`
    });
  } catch (error) {
    console.error('Task creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
