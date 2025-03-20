// src/models/admissionModel.js
const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", // Reference to the Patient model
      required: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    ward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward", // Reference to the Ward model
      required: true,
    },
    status: {
      type: String,
      enum: ["Admitted", "Discharged", "Transferred"],
      default: "Admitted",
    },
    diagnosis: {
      type: String,
      required: true,
    },
    treatment: {
      type: String,
      required: true,
    },
    attendingDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the Doctor who is attending
      required: true,
    },
    dischargedDate: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Admission model
const Admission = mongoose.model("Admission", admissionSchema);

module.exports = Admission;