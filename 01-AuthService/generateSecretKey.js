const crypto = require("crypto");

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

console.log("Generated JWT Secret Key:", generateSecretKey());