const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String, required: [true, "Title is required"],
      trim: true, maxlength: 100,
    },
    description: {
      type: String, required: [true, "Description is required"],
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: ["Music", "Tech", "Art", "Food", "Sports", "Networking", "Other"],
      required: true,
    },
    date:     { type: Date,   required: [true, "Date is required"] },
    time:     { type: String, required: [true, "Time is required"] },
    location: { type: String, required: [true, "Location is required"] },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    coverImage:   { type: String, default: null },
    organizer:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    group:        { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
    attendees:    [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    maxAttendees: { type: Number, default: null },
    price:        { type: Number, default: 0, min: 0 },
    tags:         [{ type: String, trim: true, lowercase: true }],
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index for search
eventSchema.index({ title: "text", description: "text", location: "text", tags: "text" });
eventSchema.index({ category: 1, date: 1 });

module.exports = mongoose.model("Event", eventSchema);
