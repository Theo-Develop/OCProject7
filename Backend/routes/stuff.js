const express = require("express");
const router = express.Router();
const stuffCtrl = require("../controllers/stuff");

router.post("/", stuffCtrl.createBooks);
router.put("/:id", stuffCtrl.modifyBooks);
router.delete("/:id", stuffCtrl.deleteBooks);
router.get("/:id", stuffCtrl.readOneBook);
router.get("/", stuffCtrl.readAllBooks);

module.exports = router;