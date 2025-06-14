const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI("AIzaSyChdTXaoTSNW-qI7nioPXfpQjxT8fyCuPM");

const analyzeFoodWithGemini = async (imagePath) => {
  try {
    const imageBuffer = fs.readFileSync(path.resolve(imagePath));
    const imageBase64 = imageBuffer.toString('base64');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this food image and return ONLY a JSON array with this structure:
[{"ingredientName": "string", "portionSize(g)": number, "nutritionFacts": {"calories": number, "protein_g": number, "carbohydrates_g": number, "fat_g": number, "keyVitaminsAndMinerals": ["Vitamin A", "Calcium"]}}]
Return raw JSON only, no markdown or explanations.`;

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: imageBase64 }}
        ]
      }]
    });

    let jsonString = result.response.text().trim();
    jsonString = jsonString.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    
    return JSON.parse(jsonString);

  } catch (err) {
    console.error("Error analyzing food:", err);
    return null;
  }
};

module.exports = { analyzeFoodWithGemini };