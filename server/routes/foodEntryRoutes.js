const express = require("express");
const router = express.Router();
const { FoodEntry } = require("../models/FoodEntry");
const { analyzeNutritionWithGemini } = require("../utils/healthModel");

// Create new food entry/entries (supports both single object and array)
router.post("/", async (req, res) => {
  console.log('=== POST /food - Create food entry ===');
  try {
    const userId = req.user.id;
    const requestData = req.body;

    // Handle both single object and array
    const foodEntries = Array.isArray(requestData) ? requestData : [requestData];

    if (foodEntries.length === 0) {
      return res.status(400).json({ 
        message: "Request body cannot be empty" 
      });
    }

    const processedEntries = foodEntries.map(entry => {
      if (
        !entry.ingredientName ||
        entry.portionSize_g == null ||
        entry.calories == null ||
        entry.protein_g == null ||
        entry.carbohydrates_g == null ||
        entry.fat_g == null
      ) {
        throw new Error(`Missing required fields in entry: ${entry.ingredientName || "Unnamed entry"}`);
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
    });

    const savedEntries = await FoodEntry.insertMany(processedEntries);

    console.log('Food entries created:', savedEntries.length);
    res.status(201).json({
      message: "Food entries created successfully",
      data: savedEntries,
      count: savedEntries.length
    });

  } catch (error) {
    console.error('Error creating food entries:', error);
    res.status(400).json({ 
      message: error.message || "Failed to create food entries" 
    });
  }
});

// Get user's food entries with pagination and filtering
router.get("/", async (req, res) => {
  console.log('=== GET /food - Fetch food entries ===');
  console.log('Query params:', req.query);
  
  try {
    const userId = req.user.id;
    const { 
      page = 1, 
      limit = 10, 
      startDate, 
      endDate,
      ingredient,
      days 
    } = req.query;

    const query = { userId };
    
    // Handle days parameter for simple date filtering
    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      query.consumedAt = { $gte: startDate };
      console.log('Filtering by days:', days, 'Start date:', startDate);
    } else if (startDate || endDate) {
      query.consumedAt = {};
      if (startDate) query.consumedAt.$gte = new Date(startDate);
      if (endDate) query.consumedAt.$lte = new Date(endDate);
      console.log('Filtering by date range:', startDate, 'to', endDate);
    }

    if (ingredient) {
      query.ingredientName = { $regex: ingredient, $options: 'i' };
    }

    const total = await FoodEntry.countDocuments(query);
    console.log('Total entries matching query:', total);

    const entries = await FoodEntry.find(query)
      .sort({ consumedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    console.log('Returning entries:', entries.length);

    res.json({
      success: true, // Added for consistency
      data: entries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching food entries:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch food entries",
      error: error.message 
    });
  }
});

// Get single food entry by ID
router.get("/:id", async (req, res) => {
  console.log('=== GET /food/:id - Fetch single entry ===');
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const entry = await FoodEntry.findOne({ _id: id, userId });
    
    if (!entry) {
      console.log('Food entry not found:', id);
      return res.status(404).json({ 
        message: "Food entry not found" 
      });
    }

    res.json({ data: entry });

  } catch (error) {
    console.error('Error fetching food entry:', error);
    res.status(500).json({ 
      message: "Failed to fetch food entry" 
    });
  }
});

// Update food entry
router.put("/:id", async (req, res) => {
  console.log('=== PUT /food/:id - Update entry ===');
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    delete updateData.userId;

    const updatedEntry = await FoodEntry.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      console.log('Food entry not found for update:', id);
      return res.status(404).json({ 
        message: "Food entry not found" 
      });
    }

    console.log('Food entry updated:', id);
    res.json({
      message: "Food entry updated successfully",
      data: updatedEntry
    });

  } catch (error) {
    console.error('Error updating food entry:', error);
    res.status(400).json({ 
      message: error.message || "Failed to update food entry" 
    });
  }
});

// Delete food entry
router.delete("/:id", async (req, res) => {
  console.log('=== DELETE /food/:id - Delete entry ===');
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deletedEntry = await FoodEntry.findOneAndDelete({ _id: id, userId });

    if (!deletedEntry) {
      console.log('Food entry not found for deletion:', id);
      return res.status(404).json({ 
        message: "Food entry not found" 
      });
    }

    console.log('Food entry deleted:', id);
    res.json({
      message: "Food entry deleted successfully",
      data: deletedEntry
    });

  } catch (error) {
    console.error('Error deleting food entry:', error);
    res.status(500).json({ 
      message: "Failed to delete food entry" 
    });
  }
});

// Get daily nutrition stats
router.get("/stats/daily", async (req, res) => {
  console.log('=== GET /food/stats/daily - Daily stats ===');
  console.log('Query params:', req.query);
  
  try {
    const userId = req.user.id;
    const { date } = req.query;

    if (!date) {
      console.error('Date parameter missing');
      return res.status(400).json({ 
        message: "Date parameter is required" 
      });
    }

    const [year, month, day] = date.split('-').map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    console.log('Fetching entries for date:', date);
    console.log('Date range:', startOfDay, 'to', endOfDay);

    const entries = await FoodEntry.find({
      userId,
      consumedAt: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ consumedAt: 1 });

    console.log('Found entries:', entries.length);

    const totals = entries.reduce((acc, entry) => ({
      calories: acc.calories + (entry.calories || 0),
      protein_g: acc.protein_g + (entry.protein_g || 0),
      carbohydrates_g: acc.carbohydrates_g + (entry.carbohydrates_g || 0),
      fat_g: acc.fat_g + (entry.fat_g || 0),
      entriesCount: acc.entriesCount + 1
    }), {
      calories: 0,
      protein_g: 0,
      carbohydrates_g: 0,
      fat_g: 0,
      entriesCount: 0
    });

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
      success: true, // Added for consistency
      date: date,
      totals,
      entries: entriesWithDetails,
      summary: {
        totalEntries: entries.length,
        firstEntry: entries.length > 0 ? entries[0].consumedAt : null,
        lastEntry: entries.length > 0 ? entries[entries.length - 1].consumedAt : null
      }
    });

  } catch (error) {
    console.error('Error fetching daily stats:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch daily stats",
      error: error.message 
    });
  }
});

// Get monthly nutrition stats
router.get("/stats/monthly", async (req, res) => {
  console.log('=== GET /food/stats/monthly - Monthly stats ===');
  try {
    const userId = req.user.id;
    const { year, month } = req.query;

    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;

    console.log('Fetching monthly stats for:', targetYear, targetMonth);

    const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
    const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    const entries = await FoodEntry.find({
      userId,
      consumedAt: { $gte: startOfMonth, $lte: endOfMonth }
    }).sort({ consumedAt: 1 });

    console.log('Found entries:', entries.length);

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
      calories: 0,
      protein_g: 0,
      carbohydrates_g: 0,
      fat_g: 0,
      fiber_g: 0,
      sugar_g: 0,
      sodium_mg: 0,
      entriesCount: 0,
      activeDays: 0
    });

    res.json({
      year: targetYear,
      month: targetMonth,
      monthName: new Date(targetYear, targetMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      dailyStats: Object.values(dailyStats).sort((a, b) => new Date(a.date) - new Date(b.date)),
      monthlyTotals,
      averages: {
        caloriesPerDay: monthlyTotals.activeDays > 0 ? Math.round(monthlyTotals.calories / monthlyTotals.activeDays) : 0,
        proteinPerDay: monthlyTotals.activeDays > 0 ? Math.round(monthlyTotals.protein_g / monthlyTotals.activeDays) : 0,
        carbsPerDay: monthlyTotals.activeDays > 0 ? Math.round(monthlyTotals.carbohydrates_g / monthlyTotals.activeDays) : 0,
        fatPerDay: monthlyTotals.activeDays > 0 ? Math.round(monthlyTotals.fat_g / monthlyTotals.activeDays) : 0
      }
    });

  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    res.status(500).json({ 
      message: "Failed to fetch monthly stats",
      error: error.message 
    });
  }
});

// UPDATED: Get nutrition analysis and health suggestions
// This route now works properly with the frontend
router.get("/analysis/health-suggestions", async (req, res) => {
  console.log('=== GET /food/analysis/health-suggestions ===');
  console.log('Query params:', req.query);
  console.log('User:', req.user?.id);
  
  try {
    const userId = req.user.id;
    const { days = 7 } = req.query;

    console.log('Fetching entries for last', days, 'days');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    console.log('Date range: from', startDate, 'to now');

    const entries = await FoodEntry.find({
      userId,
      consumedAt: { $gte: startDate }
    }).sort({ consumedAt: -1 });

    console.log('Found entries:', entries.length);
    if (entries.length > 0) {
      console.log('Sample entry:', JSON.stringify(entries[0], null, 2));
    }

    if (entries.length === 0) {
      console.warn('No food entries found for analysis');
      return res.status(404).json({ 
        success: false,
        message: "No food entries found for the specified period. Please log some food entries first." 
      });
    }

    console.log('Calling analyzeNutritionWithGemini...');
    const analysis = await analyzeNutritionWithGemini(entries, parseInt(days));
    
    console.log('Analysis complete');
    console.log('Analysis keys:', Object.keys(analysis));
    
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
    console.error('=== Error in health suggestions route ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      success: false,
      message: "Error analyzing nutrition data", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Legacy route - kept for backward compatibility but logs deprecation
router.get("/analysis/:userId", async (req, res) => {
  console.log('=== DEPRECATED: GET /food/analysis/:userId ===');
  console.log('This route is deprecated. Use /food/analysis/health-suggestions instead');
  
  try {
    const { userId } = req.params;
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const entries = await FoodEntry.find({
      userId,
      consumedAt: { $gte: startDate }
    }).sort({ consumedAt: -1 });

    if (entries.length === 0) {
      return res.status(404).json({ message: "No food entries found" });
    }

    const analysis = await analyzeNutritionWithGemini(entries, days);
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error in deprecated analysis route:', error);
    res.status(400).json({ message: "Error analyzing nutrition data", error: error.message });
  }
});

module.exports = { foodEntryRoutes: router };