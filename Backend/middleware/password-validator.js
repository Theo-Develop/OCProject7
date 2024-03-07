const passwordValidator = require("password-validator");

// Middleware to check a password meets certain security requirements
const validatePassword = (req, res, next) => {
    const userPassword = req.body.password;

    const schema = new passwordValidator();
    schema
        .is().min(8)
        .has().uppercase()
        .has().digits(1)
        .has().symbols(1)
        .has().not().spaces()

    if (!schema.validate(userPassword)) {
        return res.status(400).json({ error: "invalid password" });
    }
    next();
};

module.exports = validatePassword;