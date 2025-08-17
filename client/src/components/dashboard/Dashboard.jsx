import { Box, Typography, Button, Collapse, Card, CardContent, LinearProgress, Grid, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ExpandMore, ExpandLess, TrendingUp, Assignment, Restaurant } from "@mui/icons-material";
import axios from "axios";
import food from "../../img/food.jpg";
import { useAuth } from "../../hooks/useAuth";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch today's nutrition data
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
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchNutritionData();
    }
  }, [isAuthenticated]);

  const calculateNutritionProgress = (totals, entries) => {
    // Daily targets (these could come from user profile)
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

    // Calculate remaining nutrients for needs section
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
    textShadow:
      "-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black",
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "critical": return "#f44336";
      case "low": return "#ff9800";
      case "moderate": return "#2196f3";
      case "good": return "#4caf50";
      default: return "#757575";
    }
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
        {/* Instructions Section */}
        <Card sx={{ mb: 3, bgcolor: "rgba(255, 255, 255, 0.95)" }}>
          <CardContent>
            <Button
              onClick={() => setInstructionsOpen(!instructionsOpen)}
              sx={{
                width: "100%",
                justifyContent: "space-between",
                textTransform: "none",
                color: "#333",
                fontSize: "18px",
                fontWeight: 600,
              }}
              endIcon={instructionsOpen ? <ExpandLess /> : <ExpandMore />}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Assignment />
                How to Use CalorieTracker
              </Box>
            </Button>
            
            <Collapse in={instructionsOpen}>
              <Box sx={{ pt: 2, borderTop: "1px solid #eee", mt: 2 }}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Track your nutrition in 3 simple steps:
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>1.</strong> Upload a photo of your meal or scan barcode
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>2.</strong> Confirm detected foods and adjust portions
                </Typography>
                <Typography variant="body2">
                  <strong>3.</strong> View your daily progress and nutrition insights
                </Typography>
              </Box>
            </Collapse>
          </CardContent>
        </Card>

        {/* Nutrition Progress Section */}
        <Card sx={{ mb: 3, bgcolor: "rgba(255, 255, 255, 0.95)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <TrendingUp />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                Today's Progress
              </Typography>
            </Box>

            {loading ? (
              <Typography>Loading...</Typography>
            ) : nutritionData ? (
              <Grid container spacing={2}>
                {Object.entries(nutritionData.progress).map(([key, data]) => (
                  <Grid item xs={6} sm={3} key={key}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, textTransform: "capitalize" }}>
                        {key}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {Math.round(data.current)}/{data.target}{key === "calories" ? "" : "g"}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={data.percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: data.percentage >= 90 ? "#4caf50" : data.percentage >= 70 ? "#2196f3" : "#ff9800"
                          }
                        }}
                      />
                      <Typography variant="caption" sx={{ color: "#666", mt: 0.5 }}>
                        {Math.round(data.percentage)}%
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No data available for today</Typography>
            )}
          </CardContent>
        </Card>

        {/* Nutrition Needs Section */}
        <Card sx={{ bgcolor: "rgba(255, 255, 255, 0.95)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <Restaurant />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                What You Still Need
              </Typography>
            </Box>

            {loading ? (
              <Typography>Loading...</Typography>
            ) : nutritionData ? (
              <Grid container spacing={2}>
                {nutritionData.needs.map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        bgcolor: "#f9f9f9",
                        borderRadius: 2,
                        border: `2px solid ${getStatusColor(item.status)}20`,
                      }}
                    >
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {item.nutrient}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          {item.amount} remaining
                        </Typography>
                      </Box>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          bgcolor: getStatusColor(item.status),
                          color: "#fff",
                          fontWeight: 500,
                          textTransform: "capitalize"
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No data available</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};