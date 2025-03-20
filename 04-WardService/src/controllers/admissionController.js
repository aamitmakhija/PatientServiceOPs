const Admission = require("../models/admissionModel"); // Import the admission model

// Create a new admission
const createAdmission = async (req, res) => {
  try {
    const { patientId, wardId, admissionDate, dischargeDate, status } = req.body;

    // Check if all required fields are present
    if (!patientId || !wardId || !admissionDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: patientId, wardId, and admissionDate.",
      });
    }

    // Create a new admission record
    const admission = new Admission({
      patientId,
      wardId,
      admissionDate,
      dischargeDate,
      status,
    });

    await admission.save();
    res.status(201).json({
      success: true,
      message: "Admission created successfully",
      admission,
    });
  } catch (error) {
    console.error("[Create Admission Error]", error);
    res.status(500).json({
      success: false,
      message: "Error creating admission",
      error: error.message,
    });
  }
};

// Get a specific admission by ID
const getAdmission = async (req, res) => {
  try {
    const admissionId = req.params.id;

    // Find the admission by ID
    const admission = await Admission.findById(admissionId);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    res.status(200).json({
      success: true,
      admission,
    });
  } catch (error) {
    console.error("[Get Admission Error]", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving admission",
      error: error.message,
    });
  }
};

// Update an admission
const updateAdmission = async (req, res) => {
  try {
    const admissionId = req.params.id;
    const updateData = req.body;

    // Find the admission by ID and update it
    const updatedAdmission = await Admission.findByIdAndUpdate(admissionId, updateData, { new: true });

    if (!updatedAdmission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admission updated successfully",
      updatedAdmission,
    });
  } catch (error) {
    console.error("[Update Admission Error]", error);
    res.status(500).json({
      success: false,
      message: "Error updating admission",
      error: error.message,
    });
  }
};

// Delete an admission
const deleteAdmission = async (req, res) => {
  try {
    const admissionId = req.params.id;

    // Find the admission by ID and delete it
    const deletedAdmission = await Admission.findByIdAndDelete(admissionId);

    if (!deletedAdmission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admission deleted successfully",
    });
  } catch (error) {
    console.error("[Delete Admission Error]", error);
    res.status(500).json({
      success: false,
      message: "Error deleting admission",
      error: error.message,
    });
  }
};

module.exports = {
  createAdmission,
  getAdmission,
  updateAdmission,
  deleteAdmission,
};