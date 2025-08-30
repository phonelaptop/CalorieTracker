import { Box, Typography, Card, CardContent, Grid, Skeleton } from "@mui/material";
import { History } from "@mui/icons-material";

export const RecentFoodsCard = ({ recentFoods, loading }) => {
  return (
    <Card sx={{ mb: 3, bgcolor: "rgba(255, 255, 255, 0.95)" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <History />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
            Recent Foods (Last 7 Days)
          </Typography>
        </Box>
        {loading ? (
          <Box>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" height={40} sx={{ mb: 1, borderRadius: 1 }} />
            ))}
          </Box>
        ) : recentFoods && recentFoods.length > 0 ? (
          <Grid container spacing={1}>
            {recentFoods.slice(0, 8).map((item, index) => (
              <Grid item xs={6} sm={4} md={3} key={item._id || index}>
                <Box sx={{
                  p: 1.5,
                  bgcolor: "#F5F5F5",
                  borderRadius: 1,
                  textAlign: "center",
                  border: "1px solid #E0E0E0",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "#E8E8E8",
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }
                }}>
                  <Typography variant="body2" sx={{
                    fontWeight: 500,
                    mb: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {item.ingredientName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 0.5 }}>
                    {item.portionSize_g}g portion
                  </Typography>
                  {item.calories && (
                    <Typography variant="caption" sx={{ color: "#888", fontSize: "0.7rem" }}>
                      {Math.round(item.calories)} cal
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ color: "#aaa", fontSize: "0.65rem", display: "block" }}>
                    {new Date(item.consumedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">No recent food data available</Typography>
        )}
      </CardContent>
    </Card>
  );
};