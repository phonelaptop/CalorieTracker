const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function analyzeNutritionWithGemini(foodEntries, days = 7) {
  if (!Array.isArray(foodEntries)) {
    throw new Error("foodEntries must be an array");
  }

  if (foodEntries.length === 0) {
    throw new Error("No food entries to analyze");
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  try {
    const nutritionSummary = aggregateNutritionData(foodEntries, days);
    const prompt = createNutritionAnalysisPrompt(nutritionSummary, days);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    return parseNutritionAnalysis(analysisText);
  } catch (error) {
    throw new Error(`Nutrition analysis failed: ${error.message}`);
  }
}

function aggregateNutritionData(foodEntries, days) {
  const totals = foodEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + (entry.calories || 0),
      protein_g: acc.protein_g + (entry.protein_g || 0),
      carbohydrates_g: acc.carbohydrates_g + (entry.carbohydrates_g || 0),
      fat_g: acc.fat_g + (entry.fat_g || 0),
      fiber_g: acc.fiber_g + (entry.fiber_g || 0),
      sugar_g: acc.sugar_g + (entry.sugar_g || 0),
      sodium_mg: acc.sodium_mg + (entry.sodium_mg || 0),
      vitamin_A: acc.vitamin_A + (entry.vitamin_A || 0),
      vitamin_C: acc.vitamin_C + (entry.vitamin_C || 0),
      vitamin_D: acc.vitamin_D + (entry.vitamin_D || 0),
      calcium: acc.calcium + (entry.calcium || 0),
      iron: acc.iron + (entry.iron || 0),
      potassium: acc.potassium + (entry.potassium || 0),
      zinc: acc.zinc + (entry.zinc || 0),
    }),
    {
      calories: 0,
      protein_g: 0,
      carbohydrates_g: 0,
      fat_g: 0,
      fiber_g: 0,
      sugar_g: 0,
      sodium_mg: 0,
      vitamin_A: 0,
      vitamin_C: 0,
      vitamin_D: 0,
      calcium: 0,
      iron: 0,
      potassium: 0,
      zinc: 0,
    }
  );

  const dailyAverages = Object.fromEntries(
    Object.entries(totals).map(([key, value]) => [
      key,
      Math.round((value / days) * 100) / 100,
    ])
  );

  const uniqueFoods = [...new Set(foodEntries.map((e) => e.ingredientName))];

  return {
    period: `${days} days`,
    totalEntries: foodEntries.length,
    uniqueFoods: uniqueFoods.length,
    foodList: uniqueFoods,
    totals,
    dailyAverages,
  };
}

function createNutritionAnalysisPrompt(nutritionData, days) {
  return `You are a certified nutritionist analyzing ${days} days of food consumption data. 

NUTRITION DATA SUMMARY:
- Period: ${nutritionData.period}
- Total food entries: ${nutritionData.totalEntries}
- Unique foods consumed: ${nutritionData.uniqueFoods}
- Foods: ${nutritionData.foodList.join(", ")}

DAILY AVERAGES:
• Calories: ${nutritionData.dailyAverages.calories} kcal
• Protein: ${nutritionData.dailyAverages.protein_g}g
• Carbohydrates: ${nutritionData.dailyAverages.carbohydrates_g}g
• Fat: ${nutritionData.dailyAverages.fat_g}g
• Fiber: ${nutritionData.dailyAverages.fiber_g}g
• Sugar: ${nutritionData.dailyAverages.sugar_g}g
• Sodium: ${nutritionData.dailyAverages.sodium_mg}mg
• Vitamin A: ${nutritionData.dailyAverages.vitamin_A}mcg
• Vitamin C: ${nutritionData.dailyAverages.vitamin_C}mg
• Vitamin D: ${nutritionData.dailyAverages.vitamin_D}mcg
• Calcium: ${nutritionData.dailyAverages.calcium}mg
• Iron: ${nutritionData.dailyAverages.iron}mg
• Potassium: ${nutritionData.dailyAverages.potassium}mg
• Zinc: ${nutritionData.dailyAverages.zinc}mg

Provide a comprehensive nutrition analysis in EXACT JSON format:

{
  "overallScore": {
    "rating": "excellent|good|fair|poor",
    "score": 85,
    "summary": "Brief overall assessment"
  },
  "macronutrientAnalysis": {
    "calorieStatus": "appropriate|low|high",
    "proteinStatus": "adequate|low|high", 
    "carbStatus": "balanced|low|high",
    "fatStatus": "balanced|low|high",
    "fiberStatus": "adequate|low|high"
  },
  "micronutrientAnalysis": {
    "vitaminDeficiencies": ["vitamin_d", "vitamin_b12"],
    "mineralDeficiencies": ["iron", "calcium"],
    "adequateNutrients": ["vitamin_c", "potassium"]
  },
  "healthConcerns": [
    {
      "concern": "High sodium intake",
      "severity": "moderate",
      "explanation": "Detailed explanation"
    }
  ],
  "recommendations": [
    {
      "category": "macronutrients",
      "priority": "high",
      "suggestion": "Specific actionable advice",
      "reason": "Why this recommendation is important"
    }
  ],
  "suggestedFoods": [
    {
      "food": "Spinach",
      "benefit": "High in iron and folate",
      "nutrient": "iron"
    }
  ],
  "dietaryPatterns": {
    "variety": "good",
    "balance": "balanced", 
    "processingLevel": "mixed",
    "observations": "Key patterns noticed"
  }
}

Return ONLY valid JSON.`;
}

function parseNutritionAnalysis(analysisText) {
  try {
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No valid JSON found in response");

    const analysis = JSON.parse(jsonMatch[0]);

    if (!analysis.overallScore || !analysis.recommendations) {
      throw new Error("Invalid analysis structure");
    }

    return analysis;
  } catch (error) {
    return {
      overallScore: {
        rating: "fair",
        score: 50,
        summary: "Analysis completed but detailed parsing failed",
      },
      macronutrientAnalysis: {
        calorieStatus: "unknown",
        proteinStatus: "unknown",
        carbStatus: "unknown",
        fatStatus: "unknown",
        fiberStatus: "unknown",
      },
      micronutrientAnalysis: {
        vitaminDeficiencies: [],
        mineralDeficiencies: [],
        adequateNutrients: [],
      },
      healthConcerns: [],
      recommendations: [
        {
          category: "general",
          priority: "medium",
          suggestion:
            "Consult with a registered dietitian for personalized advice",
          reason:
            "Professional guidance is recommended for optimal nutrition planning",
        },
      ],
      suggestedFoods: [],
      dietaryPatterns: {
        variety: "unknown",
        balance: "unknown",
        processingLevel: "unknown",
        observations: "Data analysis was incomplete",
      },
      error: "Partial analysis - detailed parsing failed",
    };
  }
}

module.exports = { analyzeNutritionWithGemini };
