const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String, required: [true, "Group name is required"],
      trim: true, maxlength: 80,
    },
    description: { type: String, maxlength: 500, default: "" },
    coverImage:  { type: String, default: null },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members:     [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    events:      [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
