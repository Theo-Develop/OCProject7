const jwt = require("jsonwebtoken");

require("dotenv").config();

// Middleware function to authenticate incoming requests
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(process.env.SECRET_TOKEN)[1];
        const decodeToken = jwt.verify(token,);
        const userId = decodeToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};