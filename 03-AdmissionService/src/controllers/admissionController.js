const Admission = require("../models/admissionModel");  // Import the Admission model

// Create a new admission
const createAdmission = async (req, res) => {
  try {
    const { patientId, servicePoint, notes } = req.body;

    // Validate input fields (you can enhance validation here)
    if (!patientId || !servicePoint) {
      return res.status(400).json({
        success: false,
        message: "Patient ID and service point are required",
      });
    }

    // Create a new admission record
    const newAdmission = new Admission({
      patientId,
      servicePoint,
      notes,
    });

    // Save the admission to the database
    await newAdmission.save();

    res.status(201).json({
      success: true,
      message: "Admission created successfully",
      data: newAdmission,
    });
  } catch (error) {
    console.error("[createAdmission] Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get an admission by ID
const getAdmission = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the admission by ID
    const admission = await Admission.findById(id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admission,
    });
  } catch (error) {
    console.error("[getAdmission] Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update an existing admission
const updateAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { patientId, servicePoint, notes, dischargeDate } = req.body;

    // Find the admission by ID
    const admission = await Admission.findById(id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    // Update the admission fields
    admission.patientId = patientId || admission.patientId;
    admission.servicePoint = servicePoint || admission.servicePoint;
    admission.notes = notes || admission.notes;
    admission.dischargeDate = dischargeDate || admission.dischargeDate;

    // Save the updated admission
    await admission.save();

    res.status(200).json({
      success: true,
      message: "Admission updated successfully",
      data: admission,
    });
  } catch (error) {
    console.error("[updateAdmission] Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete an admission
const deleteAdmission = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the admission by ID
    const admission = await Admission.findByIdAndDelete(id);

    if (!admission) {
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
    console.error("[deleteAdmission] Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createAdmission,
  getAdmission,
  updateAdmission,
  deleteAdmission,
};