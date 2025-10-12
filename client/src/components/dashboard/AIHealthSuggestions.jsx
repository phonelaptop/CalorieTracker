import { Box, Typography, Button, Card, CardContent, Alert, Chip } from "@mui/material";
import { useState } from "react";
import { AutoFixHigh } from "@mui/icons-material";
import { useApi } from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";

const SEVERITY_COLORS = {
  high: "error",
  medium: "warning",
  low: "info",
};

const PRIORITY_COLORS = {
  high: "#f44336",
  medium: "#ff9800",
  low: "#2196f3",
};

export const AIHealthSuggestions = () => {
  const navigate = useNavigate();
  const { getHealthAnalysis } = useApi();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateAnalysis = async () => {
    setLoading(true);
    const response = await getHealthAnalysis(7);
    
    if (response.success) {
      setAnalysis(response.data);
    }
    
    setLoading(false);
  };

  const resetAnalysis = () => {
    setAnalysis(null);
  };

  if (!analysis) {
    return (
      <Card sx={{ mb: 3, bgcolor: "rgba(255, 255, 255, 0.95)" }}>
        <CardContent>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 2 }}>
              Get Personalized Health Suggestions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Analyze your nutrition patterns and receive tailored recommendations
            </Typography>
            <Button
              variant="contained"
              onClick={generateAnalysis}
              disabled={loading}
              startIcon={<AutoFixHigh />}
              sx={{
                bgcolor: "#9c27b0",
                color: "#fff",
                px: 4,
                py: 1.5,
                "&:hover": { bgcolor: "#7b1fa2" },
                "&:disabled": { bgcolor: "#e0e0e0" }
              }}
            >
              {loading ? "Generating..." : "Generate Suggestions"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3, bgcolor: "rgba(255, 255, 255, 0.95)" }}>
      <CardContent>
        {/* Health Concerns */}
        {analysis.healthConcerns?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {analysis.healthConcerns.slice(0, 2).map((concern, index) => (
              <Alert 
                key={index} 
                severity={SEVERITY_COLORS[concern.severity] || "info"}
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
        {analysis.recommendations?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {analysis.recommendations.slice(0, 3).map((rec, index) => (
              <Box key={index} sx={{ 
                display: "flex", 
                gap: 2, 
                p: 2, 
                mb: 1, 
                bgcolor: "#f9f9f9", 
                borderRadius: 2,
                border: `1px solid ${PRIORITY_COLORS[rec.priority]}30`
              }}>
                <Chip 
                  label={rec.priority} 
                  size="small" 
                  sx={{ 
                    bgcolor: PRIORITY_COLORS[rec.priority],
                    color: "#fff",
                    fontSize: "0.7rem",
                    minWidth: 60
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
        )}

        {/* Action Buttons */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: 2, 
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
                color: "#fff"
              }
            }}
          >
            View Details
          </Button>
          <Button
            variant="outlined"
            onClick={resetAnalysis}
            sx={{
              color: "#9c27b0",
              borderColor: "#9c27b0",
              "&:hover": { 
                bgcolor: "#9c27b0", 
                color: "#fff"
              }
            }}
          >
            Generate New
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};