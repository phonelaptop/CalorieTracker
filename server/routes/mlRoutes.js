const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const { analyzeFoodWithGemini } = require("../utils/nutritionModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.post("/upload", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const imagePath = req.file.path;
    const result = await analyzeFoodWithGemini(imagePath);

    fs.unlinkSync(imagePath);

    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: "Error analyzing image", error: error.message });
  }
});

module.exports = { mlRoutes: router };
