const permissions = {
  admin: [
    "registerPatient",
    "updatePatient",
    "deletePatient",
    "retrievePatient",
    "searchPatient",
    "manageAdmissions",
    "monitorHistory",
    "manageAccessControl",
    "viewAuditTrail",
    "diagnosticIntegration",
  ],
  clerk: [
    "registerPatient",
    "updatePatient",
    "retrievePatient",
    "searchPatient",
    "monitorHistory",
  ],
  doctor: [
    "retrievePatient",
    "monitorHistory",
    "diagnosticIntegration",
  ],
  nurse: [
    "retrievePatient",
    "monitorHistory",
  ],
  pathologist: [
    "diagnosticIntegration",
  ],
  paramedics: [
    "retrievePatient",
  ],
};

module.exports = permissions;
