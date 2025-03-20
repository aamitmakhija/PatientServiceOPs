const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // Store plain-text password
  role: {
    type: String,
    enum: ["admin", "clerk", "doctor", "nurse", "pathologist"],
    default: "clerk",
  },
});

module.exports = mongoose.model("User", userSchema);