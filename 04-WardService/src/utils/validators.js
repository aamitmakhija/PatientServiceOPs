// src/utils/validators.js

const { body, validationResult } = require("express-validator");

// Validator for creating a new admission
const validateCreateAdmission = [
  body("patientId")
    .isMongoId()
    .withMessage("Patient ID must be a valid MongoDB ObjectId."),
  body("admissionDate")
    .isDate()
    .withMessage("Admission Date must be a valid date."),
  body("ward")
    .notEmpty()
    .withMessage("Ward is required."),
  body("assignedDoctor")
    .isMongoId()
    .withMessage("Assigned Doctor must be a valid MongoDB ObjectId."),
  body("diagnosis")
    .notEmpty()
    .withMessage("Diagnosis is required."),
  // You can add more fields as needed
];

// Validator for updating an existing admission
const validateUpdateAdmission = [
  body("admissionDate")
    .optional()
    .isDate()
    .withMessage("Admission Date must be a valid date."),
  body("ward")
    .optional()
    .notEmpty()
    .withMessage("Ward is required."),
  body("assignedDoctor")
    .optional()
    .isMongoId()
    .withMessage("Assigned Doctor must be a valid MongoDB ObjectId."),
  body("diagnosis")
    .optional()
    .notEmpty()
    .withMessage("Diagnosis is required."),
  // You can add more fields as needed
];

// Middleware to handle validation result and send errors if any
const validateRequest = (validationRules) => {
  return [
    validationRules,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }
      next();
    },
  ];
};

module.exports = { validateCreateAdmission, validateUpdateAdmission, validateRequest };