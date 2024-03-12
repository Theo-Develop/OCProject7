const sharp = require("sharp");
const fs = require("fs");

// Middleware function to compress uploaded images using sharp
module.exports = async (req, res, next) => {
    if (!req.file) {
        return next()
    };
    try {
        req.file.compressedFilename = req.file.filename + ".webp";
        req.file.compressedFilePath = req.file.path + ".webp";

        await sharp(req.file.path)
            .resize(500, 500)
            .webp(90)
            .toFile(req.file.compressedFilePath)

        fs.unlink(req.file.path, (error) => {
            if (error) console.log(error);
        });
        next();
    } catch (error) {
        res.status(500).json({ message: "Failed to process the image", details: error.message });
    }
};