const multer = require("multer");
const path = require("path");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/webp": "webp"
};

// Middleware function to configure storage for multer, specifying the destination and filename for uploaded files
const storage = multer.diskStorage({
    destination: (req, res, callback) => {
        callback(null, "images")
    },
    filename: (req, file, callback) => {
        // Adding this line for upload UTF8
        file.originalname = Buffer.from(file.originalname, 'latin1').toString(
            'utf8',);
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        const { name: onlyFileName } = path.parse(name);
        const finalFilename = onlyFileName + '-' + Date.now() + '.' + extension;
        // Sending to the next middleware / controller with the destination filename
        callback(null, finalFilename);
    }
});

module.exports = multer({ storage }).single("image");