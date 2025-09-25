const express = require("express");
const {
  createThread,
  getAllThreads,
  getThreadById,
  deleteThread,
  updateThread,
} = require("../controllers/threadController");
const { validateThread } = require("../middleware/validation");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAllThreads);
router.get("/:id", getThreadById);

// Protected routes
router.post("/", auth, validateThread, createThread);
router.put("/:id", auth, validateThread, updateThread);
router.delete("/:id", auth, deleteThread);

module.exports = router;
