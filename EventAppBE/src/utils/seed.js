require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const User     = require("../models/User");
const Event    = require("../models/Event");
const Group    = require("../models/Group");

const connectDB = require("../../config/db");

const seed = async () => {
  await connectDB();

  // Clear existing
  await User.deleteMany();
  await Event.deleteMany();
  await Group.deleteMany();
  console.log("🗑️  Cleared existing data");

  // Create admin user
  const admin = await User.create({
    name: "Admin User",
    email: "admin@eventapp.com",
    password: "admin123",
    role: "admin",
  });

  // Create regular user
  const user = await User.create({
    name: "John Doe",
    email: "user@eventapp.com",
    password: "user1234",
  });

  console.log("👤 Users created");

  // Create groups
  const group1 = await Group.create({
    name: "Tech Enthusiasts",
    description: "A group for tech lovers and developers.",
    createdBy: admin._id,
    members: [admin._id, user._id],
  });

  const group2 = await Group.create({
    name: "Music Lovers",
    description: "For everyone who loves live music and concerts.",
    createdBy: admin._id,
    members: [admin._id],
  });

  console.log("👥 Groups created");

  // Create events
  const events = await Event.insertMany([
    {
      title: "React Native Workshop 2025",
      description: "A hands-on workshop covering React Native, Expo, and NativeWind. Build a real mobile app from scratch in just one day.",
      category: "Tech",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      time: "10:00 AM",
      location: "Tech Hub, Mumbai",
      organizer: admin._id,
      group: group1._id,
      attendees: [user._id],
      maxAttendees: 50,
      price: 0,
      tags: ["reactnative", "expo", "mobile", "workshop"],
    },
    {
      title: "Indie Music Night",
      description: "An evening of soulful indie music performances by emerging artists. Food and drinks available.",
      category: "Music",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      time: "7:00 PM",
      location: "The Blue Note, Bangalore",
      organizer: admin._id,
      group: group2._id,
      attendees: [user._id, admin._id],
      maxAttendees: 100,
      price: 299,
      tags: ["indie", "livemusic", "nightout"],
    },
    {
      title: "Street Food Festival",
      description: "Explore 50+ street food vendors from across India. Live cooking demos, tastings and competitions.",
      category: "Food",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      time: "12:00 PM",
      location: "Central Park, Delhi",
      organizer: admin._id,
      attendees: [],
      price: 0,
      tags: ["food", "festival", "streetfood"],
    },
    {
      title: "Startup Networking Mixer",
      description: "Connect with founders, investors and fellow entrepreneurs. Speed networking + pitching rounds.",
      category: "Networking",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      time: "6:30 PM",
      location: "WeWork, Hyderabad",
      organizer: admin._id,
      attendees: [user._id],
      maxAttendees: 80,
      price: 199,
      tags: ["startup", "networking", "entrepreneurs"],
    },
    {
      title: "Contemporary Art Exhibition",
      description: "A curated showcase of contemporary Indian artists exploring themes of identity, nature and technology.",
      category: "Art",
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      time: "11:00 AM",
      location: "NGMA, Chennai",
      organizer: admin._id,
      attendees: [],
      price: 150,
      tags: ["art", "exhibition", "contemporary"],
    },
    {
      title: "5K Community Run",
      description: "Join hundreds of runners for a morning 5K through the city. All fitness levels welcome!",
      category: "Sports",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: "6:00 AM",
      location: "Marine Drive, Mumbai",
      organizer: admin._id,
      attendees: [user._id, admin._id],
      price: 0,
      tags: ["running", "fitness", "community"],
    },
  ]);

  // Link events to groups
  await Group.findByIdAndUpdate(group1._id, { $push: { events: events[0]._id } });
  await Group.findByIdAndUpdate(group2._id, { $push: { events: events[1]._id } });

  // Save some events to user
  await User.findByIdAndUpdate(user._id, {
    savedEvents: [events[0]._id, events[1]._id],
    joinedGroups: [group1._id, group2._id],
  });

  console.log("🎉 Events & Groups seeded");
  console.log("\n✅ Seed complete!");
  console.log("─────────────────────────────");
  console.log("  Admin  → admin@eventapp.com  / admin123");
  console.log("  User   → user@eventapp.com   / user1234");
  console.log("─────────────────────────────");

  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
