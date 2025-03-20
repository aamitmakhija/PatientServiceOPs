const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username (or email)
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Validate password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Create the JWT token payload
    const userPayload = {
      id: user._id,
      role: user.role,
    };

    // Generate JWT token
    const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send back the JWT token
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}; 