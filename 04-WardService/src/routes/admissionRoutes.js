// src/routes/admissionRoutes.js
const express = require("express");
const router = express.Router();
const { createAdmission, getAdmission, updateAdmission, deleteAdmission } = require("../controllers/admissionController");
const authenticateToken = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/authorizeRole");
// Create a new admission - Only Clerks and Admins can create admissions
router.post(
  "/",
  authenticateToken,  // Authenticate the token
  authorizeRole(["Clerk", "Admin"]),  // Check if the user has one of the allowed roles
  createAdmission     // Call the create admission controller function
);

// Get an admission by ID - Allow Doctors, Admins, and Clerks
router.get(
  "/:id",
  authenticateToken,  // Authenticate the token
  authorizeRole(["Doctor", "Admin", "Clerk"]),  // Allow specific roles
  getAdmission        // Call the get admission controller function
);

// Update an existing admission - Only Doctors and Admins can update admissions
router.put(
  "/:id",
  authenticateToken,  // Authenticate the token
  authorizeRole(["Doctor", "Admin"]),  // Check if the user has the right role
  updateAdmission     // Call the update admission controller function
);

// Delete an admission - Only Admins can delete admissions
router.delete(
  "/:id",
  authenticateToken,  // Authenticate the token
  authorizeRole(["Admin"]),  // Only Admins can delete admissions
  deleteAdmission     // Call the delete admission controller function
);

module.exports = router;