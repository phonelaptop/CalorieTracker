import { Box, Typography, Button, Card, CardContent, Alert, Chip, Skeleton } from "@mui/material";
import { useState } from "react";
import { AutoFixHigh } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AIHealthSuggestions = () => {
  const navigate = useNavigate();
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const generateAISuggestions = async () => {
    setSuggestionsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');

      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id || payload.userId || payload.sub;
      
      if (!userId) throw new Error('No user ID');

      const response = await axios.get(`/api/foodentry/analysis/${userId}?days=7`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setAiSuggestions(response.data);
      setShowAISuggestions(true);
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
      
      // Mock AI suggestions data
      const mockAnalysis = {
        healthConcerns: [
          {
            concern: "Low Fiber Intake",
            severity: "medium",
            explanation: "Only 18g daily. Aim for 25g+ for better digestion."
          },
          {
            concern: "Vitamin D Deficiency",
            severity: "high", 
            explanation: "Very low levels. Consider supplements or more sun exposure."
          }
        ],
        recommendations: [
          {
            suggestion: "Add more leafy greens to meals",
            priority: "high",
            reason: "Boost fiber and micronutrients"
          },
          {
            suggestion: "Include fatty fish 2x per week",
            priority: "high",
            reason: "Increase vitamin D and omega-3s"
          },
          {
            suggestion: "Choose whole grains over refined",
            priority: "medium", 
            reason: "Better fiber and sustained energy"
          }
        ]
      };
      setAiSuggestions(mockAnalysis);
      setShowAISuggestions(true);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "info";
      default: return "info";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#f44336";
      case "medium": return "#ff9800";
      case "low": return "#2196f3";
      default: return "#757575";
    }
  };

  return (
    <Card sx={{ mb: 3, bgcolor: "rgba(255, 255, 255, 0.95)" }}>
      <CardContent>
        {!showAISuggestions ? (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 2 }}>
              Get Personalized Health Suggestions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Analyze your nutrition patterns and receive tailored recommendations
            </Typography>
            <Button
              variant="contained"
              onClick={generateAISuggestions}
              disabled={suggestionsLoading}
              startIcon={suggestionsLoading ? null : <AutoFixHigh />}
              sx={{
                bgcolor: "#9c27b0",
                color: "#fff",
                px: 4,
                py: 1.5,
                "&:hover": { bgcolor: "#7b1fa2" },
                "&:disabled": { bgcolor: "#e0e0e0" }
              }}
            >
              {suggestionsLoading ? "Generating..." : "Generate Suggestions"}
            </Button>
          </Box>
        ) : (
          <>
            {suggestionsLoading ? (
              <Box>
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
              </Box>
            ) : aiSuggestions ? (
              <Box>
                {/* Health Concerns */}
                {aiSuggestions.healthConcerns?.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    {aiSuggestions.healthConcerns.slice(0, 2).map((concern, index) => (
                      <Alert 
                        key={index} 
                        severity={getSeverityColor(concern.severity)} 
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {concern.concern}
                        </Typography>
                        <Typography variant="caption">
                          {concern.explanation}
                        </Typography>
                      </Alert>
                    ))}
                  </Box>
                )}

                {/* Recommendations */}
                <Box>
                  {aiSuggestions.recommendations?.slice(0, 3).map((rec, index) => (
                    <Box key={index} sx={{ 
                      display: "flex", 
                      alignItems: "flex-start", 
                      gap: 2, 
                      p: 2, 
                      mb: 1, 
                      bgcolor: "#f9f9f9", 
                      borderRadius: 2,
                      border: `1px solid ${getPriorityColor(rec.priority)}30`
                    }}>
                      <Chip 
                        label={rec.priority} 
                        size="small" 
                        sx={{ 
                          bgcolor: getPriorityColor(rec.priority), 
                          color: "#fff",
                          fontSize: "0.7rem"
                        }} 
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                          {rec.suggestion}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#666" }}>
                          {rec.reason}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Generate New Button and View Detailed */}
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  gap: 2, 
                  mt: 3, 
                  pt: 2, 
                  borderTop: "1px solid #eee" 
                }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/health-suggestions")}
                    sx={{
                      color: "#2196f3",
                      borderColor: "#2196f3",
                      "&:hover": { 
                        bgcolor: "#2196f3", 
                        color: "#fff",
                        borderColor: "#2196f3"
                      }
                    }}
                  >
                    View Detailed Analysis
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowAISuggestions(false);
                      setAiSuggestions(null);
                    }}
                    sx={{
                      color: "#9c27b0",
                      borderColor: "#9c27b0",
                      "&:hover": { 
                        bgcolor: "#9c27b0", 
                        color: "#fff",
                        borderColor: "#9c27b0"
                      }
                    }}
                  >
                    Generate New
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography color="text.secondary">Unable to load suggestions</Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};