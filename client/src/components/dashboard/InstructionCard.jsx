import { Box, Typography, Button, Collapse, Card, CardContent } from "@mui/material";
import { useState } from "react";
import { ExpandMore, ExpandLess, Assignment } from "@mui/icons-material";

export const InstructionsCard = () => {
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  return (
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
              <strong>1.</strong> Upload a photo of your meal
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
  );
};