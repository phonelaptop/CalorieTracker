const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI("AIzaSyChdTXaoTSNW-qI7nioPXfpQjxT8fyCuPM");

const analyzeFoodWithGemini = async (imagePath) => {
  try {
    const imageBuffer = fs.readFileSync(path.resolve(imagePath));
    const imageBase64 = imageBuffer.toString('base64');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze this food image and return ONLY a JSON array with this structure:
    [
      {
        "ingredientName": "string",
        "portionSize(g)": number,
        "nutritionFacts": 
          {
            "calories": number,
            "protein_g": number,
            "carbohydrates_g": number,
            "fat_g": number,
            "fiber_g": number,
            "sugar_g": number,
            "sodium_mg": number,
            "Vitamin A": number,
            "Vitamin C": number,
            "Vitamin D": number,
            "Vitamin E": number,
            "Vitamin K": number,
            "Vitamin B1": number,
            "Vitamin B2": number,
            "Vitamin B3": number,
            "Vitamin B6": number,
            "Vitamin B12": number,
            "Folate": number,
            "Calcium": number,
            "Iron": number,
            "Magnesium": number,
            "Phosphorus": number,
            "Potassium": number,
            "Zinc": number,
            "Selenium": number
          }
      }
    ]
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