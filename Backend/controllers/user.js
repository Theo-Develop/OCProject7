const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

require("dotenv").config();

// Erreur 400 remontée pour evitez de données des infos a des utilisateurs malveillants
// Function to create a new account
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "User created successfully!" }))
                .catch(error => res.status(400).json({ message: "Error creating user", details: error.message }));
        })
        .catch(error => res.status(500).json({ message: "Failed to hash the password", details: error.message }));
};


// Erreur 400 remontée pour evitez de données des infos a des utilisateurs malveillants
// Function to connect to one account
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: "Incorrect username/password" });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: "Incorrect username/password" });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    process.env.SECRET_TOKEN,
                                    { expiresIn: "24H" }
                                )
                            });
                        }
                    })
                    .catch(error => res.status(400).json({ message: "Failed to compare passwords", details: error.message }));
            }
        })
        .catch(error => res.status(400).json({ message: "Wrong credentials", details: error.message }));
};