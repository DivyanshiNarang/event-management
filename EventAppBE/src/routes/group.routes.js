const router = require("express").Router();
const {
  getGroups, getGroup, createGroup, updateGroup, deleteGroup, joinGroup,
} = require("../controllers/group.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// Public
router.get("/",    getGroups);
router.get("/:id", getGroup);

// Protected (user)
router.post("/:id/join", protect, joinGroup);

// Admin only
router.post(  "/",    protect, adminOnly, upload.single("coverImage"), createGroup);
router.put(   "/:id", protect, adminOnly, upload.single("coverImage"), updateGroup);
router.delete("/:id", protect, adminOnly, deleteGroup);

module.exports = router;
