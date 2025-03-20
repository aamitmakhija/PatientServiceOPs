const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },  // Ensure this payload contains `id` and `role`
    process.env.JWT_SECRET,  // Secret key
    { expiresIn: "1h" }  // Token expiration time
  );
};

module.exports = generateToken;
