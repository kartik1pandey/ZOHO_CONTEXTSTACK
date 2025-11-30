const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  channelId: { type: String, required: true, index: true },
  messageId: { type: String, required: true, unique: true },
  authorId: Schema.Types.ObjectId,
  authorName: String,
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  attachments: [{
    type: String,
    url: String
  }],
  metadata: Schema.Types.Mixed
});

MessageSchema.index({ channelId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);