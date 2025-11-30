const express = require('express');
const router = express.Router();
const Doc = require('../models/Doc');
const fetch = require('node-fetch');

// Ingest docs
router.post('/ingest', async (req, res) => {
  try {
    const { docs } = req.body;
    
    // Save to DB and index in NLP service
    for (const doc of docs) {
      const saved = await Doc.create(doc);
      
      // Send to NLP for embedding
      try {
        await fetch(`${process.env.NLP_URL}/nlp/index_doc`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: saved._id.toString(),
            text: doc.content || doc.excerpt
          })
        });
      } catch (err) {
        console.error('Failed to index doc:', err.message);
      }
    }
    
    res.json({ success: true, count: docs.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;