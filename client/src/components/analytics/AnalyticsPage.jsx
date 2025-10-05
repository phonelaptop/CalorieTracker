import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarToday, ChevronLeft, ChevronRight, Psychology } from '@mui/icons-material';
import { 
  Container, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CircularProgress, 
  Paper,
  IconButton,
  Button
} from '@mui/material';
import { useApi } from '../../hooks/useApi'; // Adjust import path

export const AnalyticsPage = () => {
  console.log('=== AnalyticsPage Component Mounted ===');
  
  const navigate = useNavigate();
  const { getDailyStats } = useApi();
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [currentDayDate, setCurrentDayDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    console.log('Initial date set to:', dateStr);
    return dateStr;
  });

  useEffect(() => {
    console.log('useEffect triggered - currentDayDate changed to:', currentDayDate);
    fetchDayData();
  }, [currentDayDate]);

  const fetchDayData = async () => {
    console.log('=== Fetching Day Data ===');
    console.log('Date:', currentDayDate);
    console.log('getDailyStats function available:', typeof getDailyStats === 'function');
    
    setLoading(true);
    try {
      console.log('Calling getDailyStats API...');
      const result = await getDailyStats(currentDayDate);
      
      console.log('API Response received:', {
        success: result.success,
        hasData: !!result.data,
        entriesCount: result.data?.entries?.length,
        error: result.error
      });
      console.log('Full result:', JSON.stringify(result, null, 2));
      
      if (result.success) {
        const entries = result.data.entries || [];
        console.log('Setting entries:', entries.length, 'entries');
        if (entries.length > 0) {
          console.log('Sample entry:', JSON.stringify(entries[0], null, 2));
        }
        setEntries(entries);
      } else {
        console.error('API call failed:', result.error);
        console.error('Full error object:', result);
        setEntries([]);
      }
    } catch (error) {
      console.error('=== Error in fetchDayData ===');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Full error:', error);
      setEntries([]);
    } finally {
      setLoading(false);
      console.log('fetchDayData complete, loading set to false');
    }
  };

  const handleHealthSuggestionsClick = async () => {
    console.log('=== Health Suggestions Button Clicked ===');
    console.log('Current entries count:', entries.length);
    
    try {
      // Option 1: Navigate to a health suggestions page
      console.log('Navigating to /health-suggestions');
      navigate('/health-suggestions');
      
      /* Option 2: Call the API directly and show results in a modal
      console.log('Fetching health suggestions directly...');
      
      const response = await fetch('/api/food/analysis/health-suggestions?days=7', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Health suggestions received:', data);
      
      if (data.success) {
        // Handle the suggestions - show in modal, navigate, etc.
        console.log('Analysis data:', data.data);
      } else {
        console.error('Failed to get suggestions:', data.message);
      }
      */
      
    } catch (error) {
      console.error('=== Error getting health suggestions ===');
      console.error('Error:', error);
    }
  };

  const processEntriesForChart = (entries) => {
    console.log('Processing entries for chart:', entries.length, 'entries');
    
    const processed = entries.map((entry, index) => {
      const consumedTime = new Date(entry.consumedAt);
      const timeLabel = consumedTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      const chartEntry = {
        id: entry._id || index,
        name: entry.ingredientName,
        timeLabel: timeLabel,
        calories: entry.calories,
        protein: entry.protein_g,
        carbohydrates: entry.carbohydrates_g,
        fat: entry.fat_g,
        consumedAt: entry.consumedAt,
        sortTime: consumedTime.getTime()
      };
      
      if (index === 0) {
        console.log('Sample processed entry:', chartEntry);
      }
      
      return chartEntry;
    }).sort((a, b) => a.sortTime - b.sortTime);
    
    console.log('Processed chart data:', processed.length, 'entries');
    return processed;
  };

  const processHourlyTotals = (entries) => {
    console.log('Processing hourly totals for', entries.length, 'entries');
    
    const hourlyTotals = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      hourLabel: formatHour(hour),
      calories: 0,
      entries: 0,
      foods: []
    }));

    entries.forEach((entry, idx) => {
      const consumedTime = new Date(entry.consumedAt);
      const hour = consumedTime.getHours();
      
      if (idx < 3) {
        console.log(`Entry ${idx}: consumed at hour ${hour}`, {
          food: entry.ingredientName,
          calories: entry.calories
        });
      }
      
      if (hourlyTotals[hour]) {
        hourlyTotals[hour].calories += entry.calories || 0;
        hourlyTotals[hour].entries += 1;
        hourlyTotals[hour].foods.push({
          name: entry.ingredientName,
          calories: entry.calories,
          time: consumedTime.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          })
        });
      }
    });

    const hoursWithData = hourlyTotals.filter(h => h.entries > 0).length;
    console.log('Hourly totals:', hoursWithData, 'hours with data');
    
    return hourlyTotals;
  };

  const formatHour = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const handlePreviousDay = () => {
    console.log('Previous day button clicked, current:', currentDayDate);
    const [year, month, day] = currentDayDate.split('-').map(Number);
    const currentDate = new Date(year, month - 1, day);
    currentDate.setDate(currentDate.getDate() - 1);
    
    const newYear = currentDate.getFullYear();
    const newMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const newDay = String(currentDate.getDate()).padStart(2, '0');
    const newDate = `${newYear}-${newMonth}-${newDay}`;
    console.log('Setting date to:', newDate);
    setCurrentDayDate(newDate);
  };

  const handleNextDay = () => {
    console.log('Next day button clicked, current:', currentDayDate);
    const [year, month, day] = currentDayDate.split('-').map(Number);
    const currentDate = new Date(year, month - 1, day);
    const today = new Date();
    
    if (currentDate < today) {
      currentDate.setDate(currentDate.getDate() + 1);
      const newYear = currentDate.getFullYear();
      const newMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
      const newDay = String(currentDate.getDate()).padStart(2, '0');
      const newDate = `${newYear}-${newMonth}-${newDay}`;
      console.log('Setting date to:', newDate);
      setCurrentDayDate(newDate);
    } else {
      console.log('Cannot go forward - already at today');
    }
  };

  const formatDisplayDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (dateString === todayStr) {
      return 'Today';
    } else if (dateString === yesterdayStr) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const isToday = (() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return currentDayDate === todayStr;
  })();

  const hasData = entries.length > 0;
  const totalCalories = entries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
  const chartData = hasData ? processEntriesForChart(entries) : [];
  const hourlyData = hasData ? processHourlyTotals(entries) : [];

  console.log('Render state:', {
    loading,
    hasData,
    entriesCount: entries.length,
    totalCalories,
    isToday,
    currentDayDate
  });

  if (loading) {
    console.log('Rendering loading state');
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  console.log('Rendering main content');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" gutterBottom fontWeight="bold">Daily Food Entry Tracker</Typography>
        <Typography variant="h6" color="text.secondary">Track each food entry throughout your day</Typography>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<Psychology />}
          onClick={handleHealthSuggestionsClick}
          sx={{ 
            mt: 3,
            py: 1.5,
            px: 4,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #4CAF50 30%, #45A049 90%)',
            boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #45A049 30%, #4CAF50 90%)',
            }
          }}
        >
          Get AI Health Suggestions
        </Button>
      </Box>

      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center">
              <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
              <Typography variant="h6">Daily View</Typography>
            </Box>
            
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton 
                onClick={handlePreviousDay}
                sx={{ border: 1, borderColor: 'grey.300' }}
              >
                <ChevronLeft />
              </IconButton>
              
              <Box textAlign="center" minWidth={200}>
                <Typography variant="h6" fontWeight="medium">
                  {formatDisplayDate(currentDayDate)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(currentDayDate).toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
              
              <IconButton
                onClick={handleNextDay}
                disabled={isToday}
                sx={{ 
                  border: 1, 
                  borderColor: 'grey.300',
                  '&.Mui-disabled': {
                    opacity: 0.5
                  }
                }}
              >
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {hasData && (
        <Box display="flex" justifyContent="center" gap={4} mb={4}>
          <Paper sx={{ p: 3, textAlign: 'center', minWidth: 120 }}>
            <Typography variant="h4" fontWeight="bold" color="error.main">
              {Math.round(totalCalories)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Calories
            </Typography>
          </Paper>
          <Paper sx={{ p: 3, textAlign: 'center', minWidth: 120 }}>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {entries.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Food Entries
            </Typography>
          </Paper>
          <Paper sx={{ p: 3, textAlign: 'center', minWidth: 120 }}>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {Math.round(totalCalories / entries.length)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg per Entry
            </Typography>
          </Paper>
        </Box>
      )}

      <Card sx={{ boxShadow: 2, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Individual Food Entries - {formatDisplayDate(currentDayDate)}
          </Typography>
          {hasData ? (
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  label={{ value: 'Food Items (ordered by time)', position: 'insideBottom', offset: -10 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  label={{ value: 'Calories', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <Paper sx={{ p: 2, maxWidth: 300 }}>
                          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            {data.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Time:</strong> {data.timeLabel}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Calories:</strong> {data.calories}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Protein:</strong> {Math.round(data.protein)}g
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Carbs:</strong> {Math.round(data.carbohydrates)}g
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Fat:</strong> {Math.round(data.fat)}g
                          </Typography>
                        </Paper>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="calories" 
                  fill="#f44336" 
                  name="Calories"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={400}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No food entries for {formatDisplayDate(currentDayDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Log some food entries to see your daily nutrition intake
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {hasData && (
        <Card sx={{ boxShadow: 2, mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Hourly Calorie Intake - {formatDisplayDate(currentDayDate)}
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={hourlyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hourLabel" 
                  label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  label={{ value: 'Calories per Hour', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <Paper sx={{ p: 2, maxWidth: 350, maxHeight: 400, overflow: 'auto' }}>
                          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            {data.hourLabel}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Total Calories:</strong> {data.calories}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Food Entries:</strong> {data.entries}
                          </Typography>
                          {data.foods.length > 0 && (
                            <Box mt={2}>
                              <Typography variant="body2" fontWeight="bold" gutterBottom>
                                Foods consumed:
                              </Typography>
                              {data.foods.map((food, idx) => (
                                <Typography key={idx} variant="caption" display="block" sx={{ mb: 0.5 }}>
                                  • <strong>{food.name}</strong> ({food.calories} cal) at {food.time}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Paper>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="calories" 
                  fill="#2196f3"
                  name="Calories per Hour"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {hasData && (
        <Card sx={{ mt: 4, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Food Entries Details
            </Typography>
            <Box sx={{ mt: 2 }}>
              {chartData.map((entry, index) => (
                <Paper key={entry.id} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {entry.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {entry.timeLabel}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="h6" color="error.main" fontWeight="bold">
                        {entry.calories} cal
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        P: {Math.round(entry.protein)}g | C: {Math.round(entry.carbohydrates)}g | F: {Math.round(entry.fat)}g
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};