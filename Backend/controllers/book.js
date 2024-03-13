const Book = require("../models/Books");
const fs = require("fs");

// Function to create a new book entry
exports.createBooks = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ratings: [],
        averageRating: 0,
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.compressedFilename}`
    });
    book.save()
        .then(() => res.status(201).json({ message: "Book saved successfully!" }))
        .catch(error => res.status(400).json({ message: "Error saving the book", details: error.message }));
};

// Function to modify an existing book entry
exports.modifyBooks = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.compressedFilename}`
    } : { ...req.body };
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: "Unauthorized request. You do not have permission to modify this book." });
            } else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Book modified successfully" }))
                    .catch(error => res.status(400).json({ message: "Error modifying the book", details: error.message }));
            }
        })
        .catch((error) => {
            res.status(404).json({ message: "Book not found", details: error.message });
        });
};

// Function to delete a book entry
exports.deleteBooks = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: "Unauthorized request. You do not have permission to delete this book." });
            } else {
                const filename = book.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: "Book deleted successfully" }) })
                        .catch(error => res.status(500).json({ message: "Error deleting the book", details: error.message }));
                });
            }
        })
        .catch(error => {
            res.status(404).json({ message: "Book not found", details: error.message });
        });
};

// Function to retrieve a single book entry by its ID
exports.readOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ message: "Book not found", details: error.message }));
};

// Function to retrieve all book entries
exports.readAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(404).json({ message: "Error retrieving books", details: error.message }));
};

// Function to retrieve the top 3 books with the highest average rating
exports.getBestRating = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(404).json({ message: "Error retrieving top rated books", details: error.message }));
};

// Function to add a rating by another user for only one time
exports.createNewRating = (req, res, next) => {
    const { userId, rating } = req.body;
    if (userId !== req.auth.userId) {
        return res.status(403).json({ message: "Unauthorized request. Only the authenticated user can add a rating." });
    }
    if (rating < 0 || rating > 5) {
        return res.status(400).json({ message: "The rating must be a number between 0 and 5." });
    }
    Book.findById(req.params.id)
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }
            const userRating = book.ratings.find(rating => rating.userId === userId);
            if (userRating) {
                return res.status(409).json({
                    message: "The user has already rated this book. Only one rating per user is allowed."
                });
            }
            book.ratings.push({ userId, grade: rating });
            const totalRatings = book.ratings.length;
            const sumRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
            const averageRating = sumRatings / totalRatings;
            book.averageRating = averageRating;
            book.save()
                .then(updatedBook => {
                    res.status(200).json(updatedBook);
                })
                .catch(error => {
                    res.status(400).json({ message: "Error saving the new rating", details: error.message });
                });
        })
        .catch(error => {
            res.status(404).json({ message: "Book not found", details: error.message });
        });
};
