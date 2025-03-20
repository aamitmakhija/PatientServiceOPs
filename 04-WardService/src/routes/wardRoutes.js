const express = require("express");
const router = express.Router();
const { assignWardToPatient, transferPatient, getWardInfo } = require("../controllers/wardController");
const authenticateToken = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/authorizeRole");

// Assign a patient to a specific ward using ward name
router.post(
  "/assign",
  authenticateToken,  // Authenticate the user
  authorizeRole(["Admin", "Clerk"]),  // Only Admin and Clerk can assign wards
  assignWardToPatient // Call the assign ward controller
);

// Transfer a patient between wards
router.put(
  "/transfer/:id",
  authenticateToken,
  authorizeRole(["Admin", "Clerk"]),  // Admin and Clerk can transfer patients
  transferPatient
);

// Get ward details (e.g., list of patients in a ward)
router.get(
  "/:id",
  authenticateToken,
  authorizeRole(["Admin", "Clerk", "Doctor"]),  // Admin, Clerk, and Doctor can view ward details
  getWardInfo
);

module.exports = router;