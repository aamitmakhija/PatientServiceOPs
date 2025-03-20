const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

// Create or update the admin user (plain-text password)
const setupAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the admin already exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, update the user data
      user.name = name;
      user.password = password;  // Use plain-text password directly for the admin user
      user.role = role;
    } else {
      // If the user doesn't exist, create the admin user
      user = new User({
        name,
        email,
        password,  // Use the plain-text password directly for the admin user
        role,
      });
    }

    // Save the user (whether newly created or updated)
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create or update a regular user (plain-text password)
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // If the user exists, update the user data
      user.name = name;
      user.password = password;  // Use plain-text password for regular users
      user.role = role;
    } else {
      // If the user doesn't exist, create the user
      user = new User({
        name,
        email,
        password,  // Use plain-text password for the user
        role,
      });
    }

    // Save the user (whether newly created or updated)
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),  // Generate JWT token for the new user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { setupAdmin, createUser };