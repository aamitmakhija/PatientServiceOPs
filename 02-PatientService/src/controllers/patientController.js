const Patient = require("../models/patientModel");

// Create and assign a patient to a service point
const createPatient = async (req, res) => {
  const { name, age, gender, medicalHistory, servicePoint } = req.body;

  console.log("Received request to create a patient.");

  try {
    // Validate service point
    if (!servicePoint || !["OPD", "A&E"].includes(servicePoint)) {
      return res.status(400).json({ message: "Invalid or missing service point (OPD or A&E required)." });
    }

    // Validate user authentication
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User ID is required to create a patient." });
    }

    const patient = new Patient({
      name,
      age,
      gender,
      medicalHistory,
      createdBy: req.user.id,
      servicePoint,
      status: `Assigned to ${servicePoint}`,
    });

    await patient.save();

    console.log(`Patient created successfully: ${patient.name}, assigned to ${servicePoint}`);

    res.status(201).json({
      success: true,
      message: `Patient assigned to ${servicePoint} successfully`,
      patient,
    });
  } catch (error) {
    console.error("[Error] Creating patient:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update patient status
const updatePatientStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`Received request to update patient with ID: ${id}, with status: ${status}`);

  try {
    const patient = await Patient.findById(id);

    if (!patient) {
      console.log("Patient not found.");
      return res.status(404).json({ message: "Patient not found" });
    }

    const allowedStatuses = ["Assigned to OPD", "Admitted to Ward", "Discharged"];
    if (!allowedStatuses.includes(status)) {
      console.log("Invalid status value provided.");
      return res.status(400).json({ message: "Invalid status value" });
    }

    patient.status = status;
    await patient.save();
    console.log(`Patient status updated successfully to: ${patient.status}`);

    res.json({
      success: true,
      message: "Patient status updated successfully",
      patient,
    });
  } catch (error) {
    console.error("[Error] Updating patient status:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Retrieve a specific patient
const getPatient = async (req, res) => {
  const { id } = req.params;

  console.log(`Received request to retrieve patient with ID: ${id}`);

  try {
    const patient = await Patient.findById(id);

    if (!patient) {
      console.log("Patient not found.");
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({
      success: true,
      message: "Patient retrieved successfully",
      patient,
    });
  } catch (error) {
    console.error("[Error] Retrieving patient:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a patient record
const deletePatient = async (req, res) => {
  const { id } = req.params;

  console.log(`Received request to delete patient with ID: ${id}`);

  try {
    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      console.log("Patient not found.");
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({
      success: true,
      message: "Patient deleted successfully",
      patient,
    });
  } catch (error) {
    console.error("[Error] Deleting patient:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Retrieve patient history
const getPatientHistory = async (req, res) => {
  const { id } = req.params;

  console.log(`Received request to retrieve history for patient with ID: ${id}`);

  try {
    const patient = await Patient.findById(id).populate("history");

    if (!patient) {
      console.log("Patient not found.");
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({
      success: true,
      message: "Patient history retrieved successfully",
      history: patient.history,
    });
  } catch (error) {
    console.error("[Error] Retrieving patient history:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Search patients
const searchPatients = async (req, res) => {
  const { query } = req.query;

  console.log(`Received request to search patients with query: ${query}`);

  try {
    const patients = await Patient.find({
      name: { $regex: query, $options: "i" }, // Case-insensitive search
    });

    res.json({
      success: true,
      message: "Patients retrieved successfully",
      patients,
    });
  } catch (error) {
    console.error("[Error] Searching patients:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Manage admissions (Placeholder for now)
const manageAdmissions = async (req, res) => {
  console.log("Received request to manage admissions.");
  res.json({ message: "Manage admissions endpoint under construction" });
};

// Manage access control (Placeholder for now)
const updateAccessControl = async (req, res) => {
  console.log("Received request to update access control.");
  res.json({ message: "Manage access control endpoint under construction" });
};

// View audit trail (Placeholder for now)
const getAuditTrail = async (req, res) => {
  console.log("Received request to retrieve audit trail.");
  res.json({ message: "View audit trail endpoint under construction" });
};

// Diagnostic integration (Placeholder for now)
const integrateDiagnostics = async (req, res) => {
  console.log("Received request to integrate diagnostics.");
  res.json({ message: "Diagnostic integration endpoint under construction" });
};

module.exports = {
  createPatient,
  updatePatientStatus,
  getPatient,
  deletePatient,
  getPatientHistory,
  searchPatients,
  manageAdmissions,
  updateAccessControl,
  getAuditTrail,
  integrateDiagnostics,
};
