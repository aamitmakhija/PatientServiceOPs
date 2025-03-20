const mongoose = require("mongoose");

const patientSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    medicalHistory: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    servicePoint: { type: String, required: true, enum: ["OPD", "A&E"] },  // New field
    status: { type: String, default: "Pending" },  // Track patient status
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
