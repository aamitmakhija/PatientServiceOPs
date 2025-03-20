const Ward = require("../models/wardModel"); // Assuming you have a Ward model for MongoDB
const Patient = require("../models/patientModel"); // Assuming you have a Patient model

// Assign patient to a ward using ward name
exports.assignWardToPatient = async (req, res) => {
  try {
    const { patientId, wardName } = req.body;

    // Find the ward by name
    const ward = await Ward.findOne({ wardName: wardName });

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward not found",
      });
    }

    // Find the patient by ID
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Assign the patient to the ward
    patient.ward = ward._id; // Use the ward's _id to assign to patient
    await patient.save();

    res.status(200).json({
      success: true,
      message: "Patient assigned to ward successfully",
      patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Transfer a patient to another ward using ward name
exports.transferPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { newWardName } = req.body;

    // Find the patient by ID
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // Find the new ward by name
    const newWard = await Ward.findOne({ wardName: newWardName });
    if (!newWard) {
      return res.status(404).json({ success: false, message: "New ward not found" });
    }

    // Update the patient's ward
    patient.ward = newWard._id; // Use the new ward's _id
    await patient.save();

    res.status(200).json({
      success: true,
      message: "Patient transferred to new ward",
      data: patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error transferring patient",
    });
  }
};

// Get ward details
exports.getWardInfo = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the ward by ID
    const ward = await Ward.findById(id).populate("patients");
    if (!ward) {
      return res.status(404).json({ success: false, message: "Ward not found" });
    }

    res.status(200).json({ success: true, data: ward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching ward details" });
  }
};