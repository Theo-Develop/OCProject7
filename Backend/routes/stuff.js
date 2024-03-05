const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const stuffCtrl = require("../controllers/stuff");

router.post("/", auth, multer, stuffCtrl.createBooks);
router.put("/:id", auth, multer, stuffCtrl.modifyBooks);
router.delete("/:id", auth, stuffCtrl.deleteBooks);
router.get("/:id", stuffCtrl.readOneBook);
router.get("/", stuffCtrl.readAllBooks);
router.get("/bestrating", stuffCtrl.getBestRating);

module.exports = router;