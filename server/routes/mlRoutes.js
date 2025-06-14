const express = require("express");
const router = express.Router();
const { analyzeFoodWithGemini } = require("../utils/model");

router.post("/upload", async (req, res) => {
  try {
    const imagePath = "./assets/pho.avif";
    const result = await analyzeFoodWithGemini(imagePath);

    console.log(result)
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: "Error creating prediction", error });
  }
});

module.exports = { mlRoutes: router };
