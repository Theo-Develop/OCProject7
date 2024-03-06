const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

require("dotenv").config();

// Create an Express application
const app = express();

// Connect to MongoDB using the connection URL from environment variables
mongoose.connect(process.env.DB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

// Middleware to parse JSON bodies in incoming requests
app.use(express.json());

// Middleware to set CORS (Cross-Origin Resource Sharing) headers to allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

// DATE SANITIZATION against NoSQL query injection
app.use(mongoSanitize());

// SECURE HEADER HTTP
app.use(helmet({
    crossOriginResourcePolicy: false,
}));


app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;