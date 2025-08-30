import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import food from "../../img/food.jpg";
import { useAuth } from "../../hooks/useAuth";


import {InstructionsCard}  from "../dashboard/InstructionCard";
import {AIHealthSuggestions} from "../dashboard/AIHealthSuggestions";
import {RecentFoodsCard} from "./RecentFoods/RecentFoodCard";
import {NutritionProgress} from "../dashboard/NutritionProgress";
import {NutritionNeeds} from "../dashboard/NutritionNeeds";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [nutritionData, setNutritionData] = useState(null);
  const [recentFoods, setRecentFoods] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch today's nutrition data and recent foods
  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await axios.get(`/api/foodentry/stats/daily?date=${today}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        calculateNutritionProgress(response.data.totals, response.data.entries);
      } catch (error) {
        console.error('Error fetching nutrition data:', error);
        // Mock data for demo purposes
        const mockTotals = {
          calories: 1650,
          protein_g: 85,
          carbohydrates_g: 180,
          fat_g: 65
        };
        const mockEntries = [
          { fiber_g: 12, calcium: 400, iron: 8, vitamin_D: 200 },
          { fiber_g: 6, calcium: 300, iron: 4, vitamin_D: 100 }
        ];
        calculateNutritionProgress(mockTotals, mockEntries);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentFoods = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(`/api/foodentry/recent?days=7`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        setRecentFoods(response.data);
      } catch (error) {
        console.error('Error fetching recent foods:', error);
        // Mock recent foods data
        const mockRecentFoods = [
          { food_name: "Grilled Chicken", date: "2024-01-20", meal_type: "lunch" },
          { food_name: "Brown Rice", date: "2024-01-20", meal_type: "lunch" },
          { food_name: "Salmon Fillet", date: "2024-01-19", meal_type: "dinner" },
          { food_name: "Greek Yogurt", date: "2024-01-19", meal_type: "breakfast" },
          { food_name: "Spinach Salad", date: "2024-01-18", meal_type: "lunch" },
          { food_name: "Oatmeal", date: "2024-01-18", meal_type: "breakfast" },
          { food_name: "Banana", date: "2024-01-17", meal_type: "snack" },
          { food_name: "Whole Wheat Toast", date: "2024-01-17", meal_type: "breakfast" }
        ];
        setRecentFoods(mockRecentFoods);
      }
    };

    if (isAuthenticated) {
      fetchNutritionData();
      fetchRecentFoods();
    }
  }, [isAuthenticated]);

  const calculateNutritionProgress = (totals, entries) => {
    const targets = {
      calories: 2200,
      protein: 150,
      carbs: 220,
      fat: 80,
      fiber: 25,
      calcium: 1000,
      iron: 18,
      vitamin_D: 600
    };

    const progress = {
      calories: { 
        current: totals.calories || 0, 
        target: targets.calories, 
        percentage: Math.min(((totals.calories || 0) / targets.calories) * 100, 100) 
      },
      protein: { 
        current: totals.protein_g || 0, 
        target: targets.protein, 
        percentage: Math.min(((totals.protein_g || 0) / targets.protein) * 100, 100) 
      },
      carbs: { 
        current: totals.carbohydrates_g || 0, 
        target: targets.carbs, 
        percentage: Math.min(((totals.carbohydrates_g || 0) / targets.carbs) * 100, 100) 
      },
      fat: { 
        current: totals.fat_g || 0, 
        target: targets.fat, 
        percentage: Math.min(((totals.fat_g || 0) / targets.fat) * 100, 100) 
      }
    };

    const currentFiber = entries.reduce((sum, entry) => sum + (entry.fiber_g || 0), 0);
    const currentCalcium = entries.reduce((sum, entry) => sum + (entry.calcium || 0), 0);
    const currentIron = entries.reduce((sum, entry) => sum + (entry.iron || 0), 0);
    const currentVitaminD = entries.reduce((sum, entry) => sum + (entry.vitamin_D || 0), 0);

    const needs = [
      { 
        nutrient: "Protein", 
        amount: `${Math.max(0, targets.protein - (totals.protein_g || 0)).toFixed(0)}g`, 
        status: (totals.protein_g || 0) >= targets.protein * 0.9 ? "good" : (totals.protein_g || 0) >= targets.protein * 0.7 ? "moderate" : (totals.protein_g || 0) >= targets.protein * 0.5 ? "low" : "critical" 
      },
      { 
        nutrient: "Fiber", 
        amount: `${Math.max(0, targets.fiber - currentFiber).toFixed(0)}g`, 
        status: currentFiber >= targets.fiber * 0.9 ? "good" : currentFiber >= targets.fiber * 0.7 ? "moderate" : currentFiber >= targets.fiber * 0.5 ? "low" : "critical" 
      },
      { 
        nutrient: "Calcium", 
        amount: `${Math.max(0, targets.calcium - currentCalcium).toFixed(0)}mg`, 
        status: currentCalcium >= targets.calcium * 0.9 ? "good" : currentCalcium >= targets.calcium * 0.7 ? "moderate" : currentCalcium >= targets.calcium * 0.5 ? "low" : "critical" 
      },
      { 
        nutrient: "Vitamin D", 
        amount: `${Math.max(0, targets.vitamin_D - currentVitaminD).toFixed(0)}IU`, 
        status: currentVitaminD >= targets.vitamin_D * 0.9 ? "good" : currentVitaminD >= targets.vitamin_D * 0.7 ? "moderate" : currentVitaminD >= targets.vitamin_D * 0.5 ? "low" : "critical" 
      }
    ];

    setNutritionData({ progress, needs });
  };

  const textStyle = {
    fontFamily: "Montserrat",
    color: "#fff",
    WebkitTextStroke: "0.5px black",
    textShadow: "-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black",
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

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
        justifyContent: "flex-start",
        pt: 4,
        pb: 4,
      }}
    >
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h1"
          sx={{ ...textStyle, fontSize: "64px", fontWeight: 700, mb: 2 }}
        >
          CalorieTracker
        </Typography>

        <Typography
          variant="h2"
          sx={{ ...textStyle, fontSize: "32px", fontWeight: 600, mb: 4 }}
        >
          Receive fast data of your calorie intake
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/upload")}
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            py: 2,
            px: 4,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* Dashboard Sections */}
      <Box sx={{ maxWidth: 800, width: "100%", px: 2 }}>
        <InstructionsCard />
        <AIHealthSuggestions />
        <RecentFoodsCard recentFoods={recentFoods} loading={loading} />
        <NutritionProgress nutritionData={nutritionData} loading={loading} />
        <NutritionNeeds nutritionData={nutritionData} loading={loading} />
      </Box>
    </Box>
  );
};