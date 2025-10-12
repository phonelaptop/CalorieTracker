import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import food from "../../img/food.jpg";

import { InstructionsCard } from "./InstructionsCard";
import { AIHealthSuggestions } from "../dashboard/AIHealthSuggestions";
import { NutritionProgress } from "../dashboard/NutritionProgress";
import { NutritionNeeds } from "../dashboard/NutritionNeeds";

const NUTRITION_TARGETS = {
  calories: 2200,
  protein: 150,
  carbs: 220,
  fat: 80,
  fiber: 25,
  calcium: 1000,
  iron: 18,
  vitamin_D: 600
};

const calculateProgress = (current, target) => ({
  current,
  target,
  percentage: Math.min((current / target) * 100, 100)
});

const calculateNutritionData = (totals, entries) => {
  const progress = {
    calories: calculateProgress(totals.calories || 0, NUTRITION_TARGETS.calories),
    protein: calculateProgress(totals.protein_g || 0, NUTRITION_TARGETS.protein),
    carbs: calculateProgress(totals.carbohydrates_g || 0, NUTRITION_TARGETS.carbs),
    fat: calculateProgress(totals.fat_g || 0, NUTRITION_TARGETS.fat),
  };

  const currentFiber = entries.reduce((sum, entry) => sum + (entry.fiber_g || 0), 0);
  const currentCalcium = entries.reduce((sum, entry) => sum + (entry.calcium || 0), 0);
  const currentIron = entries.reduce((sum, entry) => sum + (entry.iron || 0), 0);
  const currentVitaminD = entries.reduce((sum, entry) => sum + (entry.vitamin_D || 0), 0);

  const getNutrientStatus = (current, target) => {
    const ratio = current / target;
    if (ratio >= 0.9) return "good";
    if (ratio >= 0.7) return "moderate";
    if (ratio >= 0.5) return "low";
    return "critical";
  };

  const needs = [
    { 
      nutrient: "Protein", 
      amount: `${Math.max(0, NUTRITION_TARGETS.protein - (totals.protein_g || 0)).toFixed(0)}g`,
      status: getNutrientStatus(totals.protein_g || 0, NUTRITION_TARGETS.protein)
    },
    { 
      nutrient: "Fiber", 
      amount: `${Math.max(0, NUTRITION_TARGETS.fiber - currentFiber).toFixed(0)}g`,
      status: getNutrientStatus(currentFiber, NUTRITION_TARGETS.fiber)
    },
    { 
      nutrient: "Calcium", 
      amount: `${Math.max(0, NUTRITION_TARGETS.calcium - currentCalcium).toFixed(0)}mg`,
      status: getNutrientStatus(currentCalcium, NUTRITION_TARGETS.calcium)
    },
    { 
      nutrient: "Vitamin D", 
      amount: `${Math.max(0, NUTRITION_TARGETS.vitamin_D - currentVitaminD).toFixed(0)}IU`,
      status: getNutrientStatus(currentVitaminD, NUTRITION_TARGETS.vitamin_D)
    }
  ];

  return { progress, needs };
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getDailyStats, getRecentFoods } = useApi();
  const [nutritionData, setNutritionData] = useState(null);
  const [recentFoods, setRecentFoods] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Fetch nutrition stats
        const statsResponse = await getDailyStats(today);
        if (statsResponse.success) {
          const data = calculateNutritionData(
            statsResponse.data.totals, 
            statsResponse.data.entries
          );
          setNutritionData(data);
        }

        // Fetch recent foods
        const foodsResponse = await getRecentFoods(7);
        if (foodsResponse.success) {
          setRecentFoods(foodsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, getDailyStats, getRecentFoods]);

  const textStyle = {
    fontFamily: "Montserrat",
    color: "#fff",
    WebkitTextStroke: "0.5px black",
    textShadow: "-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black",
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${food})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: { xs: 2, sm: 4 },
        pb: { xs: 2, sm: 4 },
      }}
    >
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: { xs: 2, sm: 4 }, px: { xs: 2, sm: 0 } }}>
        <Typography
          variant="h1"
          sx={{ 
            ...textStyle, 
            fontSize: { xs: "32px", sm: "48px", md: "64px" }, 
            fontWeight: 700, 
            mb: { xs: 1, sm: 2 }
          }}
        >
          CalorieTracker
        </Typography>

        <Typography
          variant="h2"
          sx={{ 
            ...textStyle, 
            fontSize: { xs: "18px", sm: "24px", md: "32px" }, 
            fontWeight: 600, 
            mb: { xs: 2, sm: 4 }
          }}
        >
          Track your nutrition with AI-powered insights
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/upload")}
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            py: { xs: 1.5, sm: 2 },
            px: { xs: 3, sm: 4 },
            fontSize: { xs: "14px", sm: "16px" },
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* Dashboard Content */}
      <Box sx={{ maxWidth: 800, width: "100%", px: { xs: 2, sm: 2 } }}>
        <InstructionsCard />
        <AIHealthSuggestions />
        <NutritionProgress nutritionData={nutritionData} loading={loading} />
        <NutritionNeeds nutritionData={nutritionData} loading={loading} />
      </Box>
    </Box>
  );
};