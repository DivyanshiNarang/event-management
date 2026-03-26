const Event = require("../models/Event");
const User  = require("../models/User");

// GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20, upcoming } = req.query;
    const query = { isActive: true };

    if (category && category !== "All") query.category = category;
    if (upcoming === "true") query.date = { $gte: new Date() };

    if (search) {
      query.$or = [
        { title:    { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { tags:     { $regex: search, $options: "i" } },
      ];
    }

    const skip   = (Number(page) - 1) * Number(limit);
    const total  = await Event.countDocuments(query);
    const events = await Event.find(query)
      .sort({ date: 1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("organizer", "name avatar")
      .populate("group", "name");

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      events,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/events/:id
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name avatar bio")
      .populate("group", "name description coverImage")
      .populate("attendees", "name avatar");

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/events  (admin only)
exports.createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body, organizer: req.user._id };

    if (req.file) {
      eventData.coverImage = `/uploads/${req.file.filename}`;
    }

    const event = await Event.create(eventData);
    res.status(201).json({ success: true, event });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/events/:id  (admin only)
exports.updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.coverImage = `/uploads/${req.file.filename}`;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id, updateData, { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    res.json({ success: true, event });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/events/:id  (admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id, { isActive: false }, { new: true }
    );
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }
    res.json({ success: true, message: "Event deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/events/:id/rsvp  (toggle attend)
exports.rsvpEvent = async (req, res) => {
  try {
    const event    = await Event.findById(req.params.id);
    const userId   = req.user._id;

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const isAttending = event.attendees.includes(userId);

    if (isAttending) {
      // Un-RSVP
      event.attendees.pull(userId);
    } else {
      // Check capacity
      if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
        return res.status(400).json({ success: false, message: "Event is full." });
      }
      event.attendees.push(userId);
    }

    await event.save();
    res.json({ success: true, attending: !isAttending, attendeeCount: event.attendees.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/events/:id/save  (toggle save)
exports.saveEvent = async (req, res) => {
  try {
    const user    = await User.findById(req.user._id);
    const eventId = req.params.id;
    const isSaved = user.savedEvents.includes(eventId);

    if (isSaved) {
      user.savedEvents.pull(eventId);
    } else {
      user.savedEvents.push(eventId);
    }

    await user.save();
    res.json({ success: true, saved: !isSaved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
