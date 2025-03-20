const { Types } = require("mongoose");

// Utility function for checking if a field is required
const isRequired = (value, fieldName) => {
  if (!value) {
    return `${fieldName} is required.`;
  }
  return null;
};

// Utility function for checking if a field is a valid ObjectId
const isValidObjectId = (id, fieldName) => {
  if (!Types.ObjectId.isValid(id)) {
    return `${fieldName} must be a valid MongoDB ObjectId.`;
  }
  return null;
};

// Utility function for checking string type
const isString = (value, fieldName) => {
  if (typeof value !== "string") {
    return `${fieldName} must be a string.`;
  }
  return null;
};

// Validation for creating admission
const validateCreateAdmission = (data) => {
  const errors = [];

  // Validate patientId (MongoDB ObjectId)
  const patientIdError = isRequired(data.patientId, "Patient ID") || isValidObjectId(data.patientId, "Patient ID");
  if (patientIdError) errors.push({ field: "patientId", message: patientIdError });

  // Validate servicePoint
  const servicePointError = isRequired(data.servicePoint, "Service point");
  if (servicePointError) errors.push({ field: "servicePoint", message: servicePointError });
  else if (!["OPD", "Ward", "ICU"].includes(data.servicePoint)) {
    errors.push({
      field: "servicePoint",
      message: "Service point must be one of: OPD, Ward, ICU.",
    });
  }

  // Validate notes
  const notesError = data.notes && isString(data.notes, "Notes");
  if (notesError) errors.push({ field: "notes", message: notesError });

  return { isValid: errors.length === 0, errors };
};

// Middleware for validation
const validateRequest = (validatorFn) => {
  return (req, res, next) => {
    const { isValid, errors } = validatorFn(req.body);

    if (!isValid) {
      console.error("[validateRequest] Validation errors:", errors);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};

module.exports = { validateRequest, validateCreateAdmission };