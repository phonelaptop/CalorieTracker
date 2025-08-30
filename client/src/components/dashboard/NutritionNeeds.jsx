import { Box, Typography, Card, CardContent, Grid, Chip, Skeleton } from "@mui/material";
import { Restaurant } from "@mui/icons-material";

export const NutritionNeeds = ({ nutritionData, loading }) => {
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
    <Card sx={{ bgcolor: "rgba(255, 255, 255, 0.95)" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Restaurant />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
            What You Still Need
          </Typography>
        </Box>

        {loading ? (
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Skeleton variant="rectangular" height={70} sx={{ borderRadius: 1 }} />
              </Grid>
            ))}
          </Grid>
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
          <Typography color="text.secondary">No data available</Typography>
        )}
      </CardContent>
    </Card>
  );
};