const mongoose = require("mongoose");

const wardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  location: { type: String, required: true },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }]
});

module.exports = mongoose.model("Ward", wardSchema);