const express = require("express");
const { voteThread, voteComment } = require("../controllers/voteController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Protected routes - require authentication
router.post("/threads/:id/vote", auth, voteThread);
router.post("/comments/:id/vote", auth, voteComment);

module.exports = router;
