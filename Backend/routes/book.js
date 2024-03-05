const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharp = require('../middleware/sharp');

const bookCtrl = require("../controllers/book");

router.post("/", auth, multer, sharp, bookCtrl.createBooks);
router.put("/:id", auth, multer, sharp, bookCtrl.modifyBooks);
router.delete("/:id", auth, bookCtrl.deleteBooks);
router.get("/:id", bookCtrl.readOneBook);
router.get("/", bookCtrl.readAllBooks);
router.get("/bestrating", bookCtrl.getBestRating);

module.exports = router;