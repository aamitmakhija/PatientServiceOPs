// /src/models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Clerk', 'Doctor', 'Admin'],
    default: 'Clerk',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;