const express = require("express");
const router = express.Router();
const { FoodEntry } = require("../models/FoodEntry");
const { analyzeNutritionWithGemini } = require("../utils/healthModel");

// Helper to process food entry data
const processFoodEntry = (entry, userId) => {
  const requiredFields = ['ingredientName', 'portionSize_g', 'calories', 'protein_g', 'carbohydrates_g', 'fat_g'];
  const missing = requiredFields.filter(field => entry[field] == null);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  return {
    userId,
    imageUrl: entry.imageUrl || "",
    consumedAt: entry.consumedAt || new Date(),
    ingredientName: entry.ingredientName,
    portionSize_g: entry.portionSize_g,
    calories: entry.calories,
    protein_g: entry.protein_g,
    carbohydrates_g: entry.carbohydrates_g,
    fat_g: entry.fat_g,
    fiber_g: entry.fiber_g ?? 0,
    sugar_g: entry.sugar_g ?? 0,
    sodium_mg: entry.sodium_mg ?? 0,
    vitamin_A: entry.vitamin_A ?? 0,
    vitamin_C: entry.vitamin_C ?? 0,
    vitamin_D: entry.vitamin_D ?? 0,
    vitamin_E: entry.vitamin_E ?? 0,
    vitamin_K: entry.vitamin_K ?? 0,
    vitamin_B1: entry.vitamin_B1 ?? 0,
    vitamin_B2: entry.vitamin_B2 ?? 0,
    vitamin_B3: entry.vitamin_B3 ?? 0,
    vitamin_B6: entry.vitamin_B6 ?? 0,
    vitamin_B12: entry.vitamin_B12 ?? 0,
    folate: entry.folate ?? 0,
    calcium: entry.calcium ?? 0,
    iron: entry.iron ?? 0,
    magnesium: entry.magnesium ?? 0,
    phosphorus: entry.phosphorus ?? 0,
    potassium: entry.potassium ?? 0,
    zinc: entry.zinc ?? 0,
    selenium: entry.selenium ?? 0,
  };
};

// Create food entry/entries
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = Array.isArray(req.body) ? req.body : [req.body];

    if (entries.length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }

    const processedEntries = entries.map(entry => processFoodEntry(entry, userId));
    const savedEntries = await FoodEntry.insertMany(processedEntries);

    res.status(201).json({
      message: "Food entries created successfully",
      data: savedEntries,
      count: savedEntries.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to create food entries" });
  }
});

// Get food entries with filtering
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, startDate, endDate, ingredient, days } = req.query;

    const query = { userId };
    
    if (days) {
      const start = new Date();
      start.setDate(start.getDate() - parseInt(days));
      query.consumedAt = { $gte: start };
    } else if (startDate || endDate) {
      query.consumedAt = {};
      if (startDate) query.consumedAt.$gte = new Date(startDate);
      if (endDate) query.consumedAt.$lte = new Date(endDate);
    }

    if (ingredient) {
      query.ingredientName = { $regex: ingredient, $options: 'i' };
    }

    const total = await FoodEntry.countDocuments(query);
    const entries = await FoodEntry.find(query)
      .sort({ consumedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: entries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch food entries",
      error: error.message 
    });
  }
});

// Get single food entry
router.get("/:id", async (req, res) => {
  try {
    const entry = await FoodEntry.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!entry) {
      return res.status(404).json({ message: "Food entry not found" });
    }

    res.json({ data: entry });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch food entry" });
  }
});

// Update food entry
router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.userId;

    const updatedEntry = await FoodEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Food entry not found" });
    }

    res.json({
      message: "Food entry updated successfully",
      data: updatedEntry
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to update food entry" });
  }
});

// Delete food entry
router.delete("/:id", async (req, res) => {
  try {
    const deletedEntry = await FoodEntry.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!deletedEntry) {
      return res.status(404).json({ message: "Food entry not found" });
    }

    res.json({
      message: "Food entry deleted successfully",
      data: deletedEntry
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete food entry" });
  }
});

// Get daily nutrition stats
router.get("/stats/daily", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    const [year, month, day] = date.split('-').map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    const entries = await FoodEntry.find({
      userId: req.user.id,
      consumedAt: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ consumedAt: 1 });

    const totals = entries.reduce((acc, entry) => ({
      calories: acc.calories + (entry.calories || 0),
      protein_g: acc.protein_g + (entry.protein_g || 0),
      carbohydrates_g: acc.carbohydrates_g + (entry.carbohydrates_g || 0),
      fat_g: acc.fat_g + (entry.fat_g || 0),
      entriesCount: acc.entriesCount + 1
    }), { calories: 0, protein_g: 0, carbohydrates_g: 0, fat_g: 0, entriesCount: 0 });

    const entriesWithDetails = entries.map(entry => ({
      _id: entry._id,
      ingredientName: entry.ingredientName,
      calories: entry.calories || 0,
      protein_g: entry.protein_g || 0,
      carbohydrates_g: entry.carbohydrates_g || 0,
      fat_g: entry.fat_g || 0,
      fiber_g: entry.fiber_g || 0,
      sugar_g: entry.sugar_g || 0,
      sodium_mg: entry.sodium_mg || 0,
      vitamin_A: entry.vitamin_A || 0,
      vitamin_C: entry.vitamin_C || 0,
      vitamin_D: entry.vitamin_D || 0,
      calcium: entry.calcium || 0,
      iron: entry.iron || 0,
      potassium: entry.potassium || 0,
      zinc: entry.zinc || 0,
      portionSize_g: entry.portionSize_g || 0,
      consumedAt: entry.consumedAt
    }));

    res.json({
      success: true,
      date,
      totals,
      entries: entriesWithDetails,
      summary: {
        totalEntries: entries.length,
        firstEntry: entries[0]?.consumedAt || null,
        lastEntry: entries[entries.length - 1]?.consumedAt || null
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch daily stats",
      error: error.message 
    });
  }
});

// Get monthly nutrition stats
router.get("/stats/monthly", async (req, res) => {
  try {
    const { year, month } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;

    const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
    const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    const entries = await FoodEntry.find({
      userId: req.user.id,
      consumedAt: { $gte: startOfMonth, $lte: endOfMonth }
    }).sort({ consumedAt: 1 });

    const dailyStats = {};
    
    entries.forEach(entry => {
      const dateKey = entry.consumedAt.toISOString().split('T')[0];
      
      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = {
          date: dateKey,
          calories: 0,
          protein_g: 0,
          carbohydrates_g: 0,
          fat_g: 0,
          fiber_g: 0,
          sugar_g: 0,
          sodium_mg: 0,
          entriesCount: 0
        };
      }

      dailyStats[dateKey].calories += entry.calories;
      dailyStats[dateKey].protein_g += entry.protein_g;
      dailyStats[dateKey].carbohydrates_g += entry.carbohydrates_g;
      dailyStats[dateKey].fat_g += entry.fat_g;
      dailyStats[dateKey].fiber_g += entry.fiber_g;
      dailyStats[dateKey].sugar_g += entry.sugar_g;
      dailyStats[dateKey].sodium_mg += entry.sodium_mg;
      dailyStats[dateKey].entriesCount += 1;
    });

    const monthlyTotals = Object.values(dailyStats).reduce((acc, day) => ({
      calories: acc.calories + day.calories,
      protein_g: acc.protein_g + day.protein_g,
      carbohydrates_g: acc.carbohydrates_g + day.carbohydrates_g,
      fat_g: acc.fat_g + day.fat_g,
      fiber_g: acc.fiber_g + day.fiber_g,
      sugar_g: acc.sugar_g + day.sugar_g,
      sodium_mg: acc.sodium_mg + day.sodium_mg,
      entriesCount: acc.entriesCount + day.entriesCount,
      activeDays: acc.activeDays + (day.entriesCount > 0 ? 1 : 0)
    }), {
      calories: 0, protein_g: 0, carbohydrates_g: 0, fat_g: 0,
      fiber_g: 0, sugar_g: 0, sodium_mg: 0, entriesCount: 0, activeDays: 0
    });

    const activeDays = monthlyTotals.activeDays || 1;

    res.json({
      year: targetYear,
      month: targetMonth,
      monthName: new Date(targetYear, targetMonth - 1).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      }),
      dailyStats: Object.values(dailyStats).sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      ),
      monthlyTotals,
      averages: {
        caloriesPerDay: Math.round(monthlyTotals.calories / activeDays),
        proteinPerDay: Math.round(monthlyTotals.protein_g / activeDays),
        carbsPerDay: Math.round(monthlyTotals.carbohydrates_g / activeDays),
        fatPerDay: Math.round(monthlyTotals.fat_g / activeDays)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch monthly stats",
      error: error.message 
    });
  }
});

// Get health suggestions with AI analysis
router.get("/analysis/health-suggestions", async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const entries = await FoodEntry.find({
      userId: req.user.id,
      consumedAt: { $gte: startDate }
    }).sort({ consumedAt: -1 });

    if (entries.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "No food entries found for the specified period" 
      });
    }

    const analysis = await analyzeNutritionWithGemini(entries, parseInt(days));
    
    res.status(200).json({
      success: true,
      data: analysis,
      metadata: {
        entriesAnalyzed: entries.length,
        daysCovered: days,
        analysisDate: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error analyzing nutrition data", 
      error: error.message
    });
  }
});

module.exports = { foodEntryRoutes: router };