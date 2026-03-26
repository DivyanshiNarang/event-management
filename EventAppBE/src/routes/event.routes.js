const router = require("express").Router();
const {
  getEvents, getEvent, createEvent, updateEvent,
  deleteEvent, rsvpEvent, saveEvent,
} = require("../controllers/event.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// Public
router.get("/",    getEvents);
router.get("/:id", getEvent);

// Protected (user)
router.post("/:id/rsvp", protect, rsvpEvent);
router.post("/:id/save", protect, saveEvent);

// Admin only
router.post(  "/",    protect, adminOnly, upload.single("coverImage"), createEvent);
router.put(   "/:id", protect, adminOnly, upload.single("coverImage"), updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

module.exports = router;
