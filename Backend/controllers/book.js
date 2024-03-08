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
        .then(() => res.status(201).json({ message: "book saved!" }))
        .catch(error => res.status(400).json({ error }));
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
                res.status(403).json({ message: "unauthorized request" });
            } else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "modified book" }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Function to delete a book entry
exports.deleteBooks = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: "unauthorized request" });
            } else {
                const filename = book.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: "deleted book" }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

// Function to retrieve a single book entry by his ID
exports.readOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

// Function to retrieve all book entries
exports.readAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

// Function to retrieve the top 3 books with the highest average rating
exports.getBestRating = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

// Function to add a rating by other user for only one time
exports.createNewRating = (req, res, next) => {

    const { userId, rating } = req.body;

    const user = req.body.userId;

    if (user !== req.auth.userId) {
        return res.status(401).json({ message: 'unauthorized request' });
    }

    // Check that the note is between 0 and 5
    if (rating < 0 || rating > 5) {
        return res.status(400).json({ error: "La note doit être un nombre entre 0 et 5." });
    }

    Book.findById(req.params.id)
        .then(book => {
            if (!book) {
                return res.status(404).json({ error: "Book not find" });
            }

            const userRating = book.ratings.find(rating => rating.userId === userId);

            if (userRating) {
                return res.status(400).json({
                    error: "the user has already rated this book"
                });
            }

            book.ratings.push({ userId, grade: rating });

            // Calculate the new average score
            const totalRatings = book.ratings.length;
            const sumRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
            const averageRating = sumRatings / totalRatings;
            book.averageRating = averageRating;

            book.save()
                .then(updatedBook => {
                    res.status(200).json(updatedBook);
                })
                .catch(error => {
                    res.status(500).json({ error });
                });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};