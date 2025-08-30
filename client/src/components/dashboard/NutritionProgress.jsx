import { Box, Typography, Card, CardContent, LinearProgress, Grid, Skeleton } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

export const NutritionProgress = ({ nutritionData, loading }) => {
  return (
    <Card sx={{ mb: 3, bgcolor: "rgba(255, 255, 255, 0.95)" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <TrendingUp />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
            Today's Progress
          </Typography>
        </Box>

        {loading ? (
          <Box>
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((i) => (
                <Grid item xs={6} sm={3} key={i}>
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="text" height={25} />
                  <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 1, mb: 1 }} />
                  <Skeleton variant="text" height={20} />
                </Grid>
              ))}
            </Grid>
          </Box>
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
                  <Typography variant="caption" sx={{ color: "#666", mt: 0.5, display: "block" }}>
                    {Math.round(data.percentage)}%
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">No data available for today</Typography>
        )}
      </CardContent>
    </Card>
  );
};