import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { ArrowBack, Psychology, TrendingUp, Warning, Lightbulb } from '@mui/icons-material';
import { useApi } from '../../hooks/useApi'; // Adjust import path

export const HealthSuggestions = () => {
  const navigate = useNavigate();
  const { user, getHealthAnalysis } = useApi();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHealthSuggestions();
  }, []);

  const fetchHealthSuggestions = async () => {
    try {
      if (!user?.id) {
        setError('User not found. Please log in again.');
        return;
      }

      setLoading(true);
      const result = await getHealthAnalysis(user.id, 7);
      
      if (result.success) {
        setAnalysis(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error fetching health suggestions:', err);
      setError('Failed to fetch health suggestions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Analyzing your nutrition...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/analytics')} sx={{ mb: 3 }}>
          Back to Analytics
        </Button>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/analytics')} sx={{ mb: 3 }}>
        Back to Analytics
      </Button>

      <Box textAlign="center" mb={4}>
        <Psychology sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Health Suggestions
        </Typography>
        <Typography color="text.secondary">
          AI-powered insights from your last 7 days
        </Typography>
      </Box>

      {/* Overall Score */}
      <Card sx={{ mb: 4, textAlign: 'center', bgcolor: 'primary.50' }}>
        <CardContent>
          <Typography variant="h2" fontWeight="bold" color="primary.main">
            {analysis?.overallScore?.score || 0}
          </Typography>
          <Chip 
            label={analysis?.overallScore?.rating?.toUpperCase() || 'UNKNOWN'} 
            color="primary" 
            sx={{ mb: 2 }} 
          />
          <Typography variant="body1">
            {analysis?.overallScore?.summary}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Nutrition Status */}
        <Grid item xs={12} md={6}width="100%">
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUp color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">Nutrition Status</Typography>
              </Box>
              
              {analysis?.macronutrientAnalysis && Object.entries(analysis.macronutrientAnalysis).map(([key, status]) => (
                <Box key={key} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">
                    {key.replace('Status', '').replace(/([A-Z])/g, ' $1').trim()}
                  </Typography>
                  <Chip 
                    label={status} 
                    size="small" 
                    color={status === 'adequate' || status === 'balanced' ? 'success' : 'warning'} 
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Deficiencies */}
        <Grid item xs={12} md={6} width="100%">
          <Card sx={{ height: '100%'}}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Warning color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">Deficiencies</Typography>
              </Box>
              
              {analysis?.micronutrientAnalysis?.vitaminDeficiencies?.length > 0 && (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Vitamins:</Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {analysis.micronutrientAnalysis.vitaminDeficiencies.map((vitamin) => (
                      <Chip key={vitamin} label={vitamin.replace('_', ' ')} size="small" color="error" />
                    ))}
                  </Box>
                </Box>
              )}

              {analysis?.micronutrientAnalysis?.mineralDeficiencies?.length > 0 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Minerals:</Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {analysis.micronutrientAnalysis.mineralDeficiencies.map((mineral) => (
                      <Chip key={mineral} label={mineral} size="small" color="warning" />
                    ))}
                  </Box>
                </Box>
              )}

              {(!analysis?.micronutrientAnalysis?.vitaminDeficiencies?.length && 
                !analysis?.micronutrientAnalysis?.mineralDeficiencies?.length) && (
                <Typography color="success.main">No major deficiencies detected!</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Health Concerns */}
        {analysis?.healthConcerns?.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Warning color="error" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">Health Concerns</Typography>
                </Box>
                
                {analysis.healthConcerns.map((concern, index) => (
                  <Alert key={index} severity={concern.severity === 'high' ? 'error' : 'warning'} sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">{concern.concern}</Typography>
                    <Typography variant="body2">{concern.explanation}</Typography>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Recommendations */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Lightbulb color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">Recommendations</Typography>
              </Box>
              
              <List dense>
                {analysis?.recommendations?.slice(0, 5).map((rec, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Chip 
                            label={rec.priority} 
                            size="small" 
                            color={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'info'} 
                          />
                          <Typography variant="body1" fontWeight="medium">
                            {rec.suggestion}
                          </Typography>
                        </Box>
                      }
                      secondary={rec.reason}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Suggested Foods */}
        {analysis?.suggestedFoods?.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>Suggested Foods</Typography>
                <Grid container spacing={2}>
                  {analysis.suggestedFoods.slice(0, 6).map((food, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box p={2} bgcolor="success.50" borderRadius={1}>
                        <Typography variant="subtitle2" fontWeight="bold" color="success.main">
                          {food.food}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {food.benefit}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};