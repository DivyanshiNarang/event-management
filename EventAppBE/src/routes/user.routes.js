const router = require("express").Router();
const {
  getSavedEvents, updateProfile, updateAvatar,
  getUserProfile, getAllUsers, deleteUser,
} = require("../controllers/user.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// Protected (user)
router.get("/saved-events",           protect, getSavedEvents);
router.put("/profile",                protect, updateProfile);
router.put("/avatar",                 protect, upload.single("avatar"), updateAvatar);

// Public
router.get("/:id",                    getUserProfile);

// Admin only
router.get(   "/",    protect, adminOnly, getAllUsers);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
