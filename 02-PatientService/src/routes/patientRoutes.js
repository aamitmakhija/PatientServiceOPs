const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const authorizeAction = require("../middleware/authorizeAction");

const {
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
} = require("../controllers/patientController");

// Patient management routes
router.post("/register", authenticateToken, authorizeAction("registerPatient"), createPatient);
router.put("/update/:id", authenticateToken, authorizeAction("updatePatient"), updatePatientStatus);
router.get("/:id", authenticateToken, authorizeAction("retrievePatient"), getPatient);
router.delete("/:id", authenticateToken, authorizeAction("deletePatient"), deletePatient);
router.get("/history/:id", authenticateToken, authorizeAction("monitorHistory"), getPatientHistory);

// Additional routes
router.get("/search", authenticateToken, authorizeAction("searchPatient"), searchPatients);
router.post("/admissions", authenticateToken, authorizeAction("manageAdmissions"), manageAdmissions);
router.post("/accessControl", authenticateToken, authorizeAction("manageAccessControl"), updateAccessControl);
router.get("/auditTrail", authenticateToken, authorizeAction("viewAuditTrail"), getAuditTrail);
router.post("/diagnostics", authenticateToken, authorizeAction("diagnosticIntegration"), integrateDiagnostics);

module.exports = router;
