const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const stuffCtrl = require("../controllers/stuff");

router.post("/", auth, stuffCtrl.createBooks);
router.put("/:id", auth, stuffCtrl.modifyBooks);
router.delete("/:id", auth, stuffCtrl.deleteBooks);
router.get("/:id", auth, stuffCtrl.readOneBook);
router.get("/", auth, stuffCtrl.readAllBooks);

module.exports = router;