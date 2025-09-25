const express = require("express");
const {
  addComment,
  replyToComment,
  getCommentsByThread,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { validateComment } = require("../middleware/validation");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/thread/:id", getCommentsByThread);

// Protected routes
router.post("/thread/:id", auth, validateComment, addComment);
router.post("/:id/reply", auth, validateComment, replyToComment);
router.put("/:id", auth, validateComment, updateComment);
router.delete("/:id", auth, deleteComment);

module.exports = router;
