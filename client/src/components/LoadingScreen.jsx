import { Box, Typography, CircularProgress } from "@mui/material";

export const LoadingScreen = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: 2
      }}
    >
      <CircularProgress 
        size={60} 
        sx={{ color: '#3AA8AE' }}
      />
      <Typography 
        sx={{ 
          fontFamily: 'Montserrat',
          fontSize: '18px',
          color: '#666'
        }}
      >
        Loading SnacTrack...
      </Typography>
    </Box>
  );
};