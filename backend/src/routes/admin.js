const express = require("express");
const {
  getAllThreadsAdmin,
  deleteCommentAdmin,
  lockThread,
  pinThread,
  getAllUsers,
} = require("../controllers/adminController");
const { adminAuth } = require("../middleware/auth");

const router = express.Router();

// All admin routes require admin authentication
router.get("/threads", adminAuth, getAllThreadsAdmin);
router.delete("/comments/:id", adminAuth, deleteCommentAdmin);
router.put("/threads/:id/lock", adminAuth, lockThread);
router.put("/threads/:id/pin", adminAuth, pinThread);
router.get("/users", adminAuth, getAllUsers);

module.exports = router;
