const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const stuffCtrl = require("../controllers/stuff");

router.post("/", auth, stuffCtrl.createBooks);
router.put("/:id", auth, stuffCtrl.modifyBooks);
router.delete("/:id", auth, stuffCtrl.deleteBooks);
router.get("/:id", stuffCtrl.readOneBook);
router.get("/", stuffCtrl.readAllBooks);

module.exports = router;