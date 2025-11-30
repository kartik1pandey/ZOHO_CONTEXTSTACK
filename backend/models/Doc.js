const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocSchema = new Schema({
  source: { 
    type: String, 
    enum: ['google-drive', 'notion', 'local', 'github'],
    default: 'local'
  },
  title: { type: String, required: true },
  content: String,
  excerpt: String,
  url: String,
  embeddingsId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Doc', DocSchema);