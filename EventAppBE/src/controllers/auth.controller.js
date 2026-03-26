const User = require("../models/User");
const { sendTokenResponse } = require("../utils/jwt");

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // Remove password before sending
    user.password = undefined;
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me  (protected)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("joinedGroups", "name coverImage")
      .populate("savedEvents", "title date location coverImage");

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
