const jwt = require("jsonwebtoken");

require("dotenv").config();

// Middleware function to authenticate incoming requests
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodeToken = jwt.verify(token, process.env.SECRET_TOKEN);
        const userId = decodeToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or missing token: authentication failed.", details: error.message });
    }
};