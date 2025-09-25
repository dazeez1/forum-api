const express = require("express");
const { signup, login, getProfile } = require("../controllers/authController");
const { validateSignup, validateLogin } = require("../middleware/validation");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);

// Protected routes
router.get("/profile", auth, getProfile);

module.exports = router;
