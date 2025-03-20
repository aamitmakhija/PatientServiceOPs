const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    admissionDate: { type: Date, required: true, default: Date.now },
    dischargeDate: { type: Date },
    servicePoint: { type: String, enum: ["OPD", "Ward", "ICU"], required: true },
    status: { type: String, enum: ["Admitted", "Discharged"], default: "Admitted" },
    notes: { type: String },
  },
  { timestamps: true }
);

// Virtual field to calculate the duration of admission
admissionSchema.virtual("duration").get(function () {
  if (this.dischargeDate) {
    return Math.ceil((this.dischargeDate - this.admissionDate) / (1000 * 60 * 60 * 24)); // Duration in days
  }
  return null; // Still admitted
});

const Admission = mongoose.model("Admission", admissionSchema);

module.exports = Admission;