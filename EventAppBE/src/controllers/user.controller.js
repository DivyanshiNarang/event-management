const User  = require("../models/User");
const Event = require("../models/Event");

// GET /api/users/saved-events
exports.getSavedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedEvents",
      match: { isActive: true },
      options: { sort: { date: 1 } },
      populate: { path: "organizer", select: "name avatar" },
    });

    res.json({ success: true, events: user.savedEvents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (bio  !== undefined) updates.bio = bio;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/users/avatar
exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded." });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id, { avatar: avatarUrl }, { new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/:id  (public profile)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -savedEvents");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users  (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, total: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/users/:id  (admin only)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
