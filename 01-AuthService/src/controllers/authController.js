const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare plain-text password for admin or other users
    const isMatch = password === user.password;  // Direct comparison with plain-text password

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),  // Generate a token for the logged-in user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { loginUser };