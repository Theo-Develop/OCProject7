const emailValidator = require("email-validator");

// Middleware to use validate if an email address is valid
const validateEmail = (req, res, next) => {
    const { email } = req.body;

    if (!email || !emailValidator.validate(email)) {
        return res.status(400).json({ error: "Invalid email address" });
    }
    next();
};

module.exports = validateEmail;