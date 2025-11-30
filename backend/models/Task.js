const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  channelId: String,
  title: { type: String, required: true },
  description: String,
  assigneeId: Schema.Types.ObjectId,
  assigneeName: String,
  status: { 
    type: String, 
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  },
  createdAt: { type: Date, default: Date.now },
  dueDate: Date
});

module.exports = mongoose.model('Task', TaskSchema);