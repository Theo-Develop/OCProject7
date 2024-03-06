const express = require("express");
const router = express.Router();

// Import middlewares for security
const rateLimit = require("../middleware/rate");
const validateEmail = require("../middleware/email-validator");
const validatePassword = require("../middleware/password-validator");

const userCrtl = require("../controllers/user");

router.post("/signup", rateLimit, validateEmail, validatePassword, userCrtl.signup);
router.post("/login", rateLimit, userCrtl.login);

module.exports = router;