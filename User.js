const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: String,
  accounts: [String]
});

module.exports = mongoose.model('User', userSchema);
