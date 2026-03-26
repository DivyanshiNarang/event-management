const Group = require("../models/Group");
const User  = require("../models/User");

// GET /api/groups
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ isActive: true })
      .populate("createdBy", "name avatar")
      .sort({ createdAt: -1 });
    res.json({ success: true, groups });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/groups/:id
exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("createdBy", "name avatar")
      .populate("members", "name avatar")
      .populate({
        path: "events",
        match: { isActive: true },
        populate: { path: "organizer", select: "name avatar" },
      });

    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found." });
    }
    res.json({ success: true, group });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/groups  (admin only)
exports.createGroup = async (req, res) => {
  try {
    const groupData = { ...req.body, createdBy: req.user._id };
    if (req.file) groupData.coverImage = `/uploads/${req.file.filename}`;

    const group = await Group.create(groupData);
    res.status(201).json({ success: true, group });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/groups/:id  (admin only)
exports.updateGroup = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.coverImage = `/uploads/${req.file.filename}`;

    const group = await Group.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!group) return res.status(404).json({ success: false, message: "Group not found." });

    res.json({ success: true, group });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/groups/:id  (admin only)
exports.deleteGroup = async (req, res) => {
  try {
    await Group.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Group deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/groups/:id/join  (toggle join/leave)
exports.joinGroup = async (req, res) => {
  try {
    const group  = await Group.findById(req.params.id);
    const userId = req.user._id;

    if (!group) return res.status(404).json({ success: false, message: "Group not found." });

    const isMember = group.members.includes(userId);

    if (isMember) {
      group.members.pull(userId);
      await User.findByIdAndUpdate(userId, { $pull: { joinedGroups: group._id } });
    } else {
      group.members.push(userId);
      await User.findByIdAndUpdate(userId, { $addToSet: { joinedGroups: group._id } });
    }

    await group.save();
    res.json({ success: true, joined: !isMember, memberCount: group.members.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
