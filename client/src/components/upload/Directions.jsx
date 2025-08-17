import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { PhotoCamera, Analytics, CheckCircle } from '@mui/icons-material';

const steps = [
  { 
    number: '1', 
    title: 'Take Photo', 
    icon: <PhotoCamera sx={{ fontSize: 40, color: 'primary.main' }} />
  },
  { 
    number: '2', 
    title: 'AI Analysis', 
    icon: <Analytics sx={{ fontSize: 40, color: 'secondary.main' }} />
  },
  { 
    number: '3', 
    title: 'Save Results', 
    icon: <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
  }
];

export const Directions = () => {
  return (
    <Card sx={{ p: 4, mb: 3, bgcolor: 'grey.50' }}>
      <Typography variant="h5" align="center" sx={{ mb: 4, fontWeight: 600 }}>
        How It Works
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', maxWidth: '600px', mx: 'auto' }}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Box 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: 2, 
                  bgcolor: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: 1,
                  '&:hover': { transform: 'scale(1.05)' },
                  transition: 'transform 0.2s'
                }}
              >
                {step.icon}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}
                >
                  {step.number}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {step.title}
                </Typography>
              </Box>
            </Box>
            {index < steps.length - 1 && (
              <Box sx={{ mx: 4, mt: 6, fontSize: '1.5rem', color: 'grey.400' }}>
                →
              </Box>
            )}
          </React.Fragment>
        ))}
      </Box>
    </Card>
  );
}