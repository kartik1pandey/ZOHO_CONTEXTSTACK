const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  zoho_user_id: { type: String, unique: true },
  name: String,
  email: String,
  roleTags: [String],
  timezone: String,
  integrations: {
    github: Schema.Types.Mixed,
    jira: Schema.Types.Mixed
  }
});

module.exports = mongoose.model('User', UserSchema);
