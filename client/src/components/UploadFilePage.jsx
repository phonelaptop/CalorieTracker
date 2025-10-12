import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Button, Box, CircularProgress, Alert, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Snackbar 
} from '@mui/material';
import { AttachFile, CloudUpload, Add } from '@mui/icons-material';
import { useApi } from '../hooks/useApi';
import { FoodEntryDialog } from '../components/FoodEntryDialog';
import { FoodEntryRow } from '../components/FoodEntryRow';

export const UploadFilePage = () => {
  const navigate = useNavigate();
  const { analyzeImage, saveFoodEntries } = useApi();
  
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Clean up image preview on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      // Clean up old preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      setEntries([]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const response = await analyzeImage(file);
    
    if (response.success) {
      setEntries(response.data);
    } else {
      setError(response.error);
    }
    
    setLoading(false);
  };

  const handleUpdateEntry = (index, updatedEntry) => {
    const newEntries = [...entries];
    newEntries[index] = updatedEntry;
    setEntries(newEntries);
    setEditingIndex(null);
  };

  const handleDeleteEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleAddEntry = (newEntry) => {
    setEntries([...entries, newEntry]);
    setShowAddDialog(false);
  };

  const handleSubmit = async () => {
    if (entries.length === 0) return;

    setSubmitting(true);
    
    const foodEntries = entries.map(item => ({
      ingredientName: item.ingredientName,
      portionSize_g: item['portionSize(g)'],
      calories: item.nutritionFacts.calories,
      protein_g: item.nutritionFacts.protein_g,
      carbohydrates_g: item.nutritionFacts.carbohydrates_g,
      fat_g: item.nutritionFacts.fat_g,
      fiber_g: item.nutritionFacts.fiber_g || 0,
      sugar_g: item.nutritionFacts.sugar_g || 0,
      sodium_mg: item.nutritionFacts.sodium_mg || 0,
      vitamin_A: item.nutritionFacts['Vitamin A'] || 0,
      vitamin_C: item.nutritionFacts['Vitamin C'] || 0,
      calcium: item.nutritionFacts['Calcium'] || 0,
      iron: item.nutritionFacts['Iron'] || 0,
    }));

    const response = await saveFoodEntries(foodEntries);
    
    if (response.success) {
      setSnackbar({ open: true, message: 'Food entries saved successfully!', severity: 'success' });
      
      // Clean up and redirect
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setEntries([]);
      setFile(null);
      setImagePreview(null);
      
      setTimeout(() => navigate('/analytics'), 1000);
    } else {
      setSnackbar({ open: true, message: response.error, severity: 'error' });
    }
    
    setSubmitting(false);
  };

  const totals = entries.reduce((acc, item) => ({
    calories: acc.calories + item.nutritionFacts.calories,
    protein: acc.protein + item.nutritionFacts.protein_g,
    carbs: acc.carbs + item.nutritionFacts.carbohydrates_g,
    fat: acc.fat + item.nutritionFacts.fat_g,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 700, mb: 4 }}>
        Food Nutrition Tracker
      </Typography>

      {/* Upload Section */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <input
          accept="image/*"
          id="file-upload"
          type="file"
          hidden
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <Button variant="outlined" component="span" startIcon={<AttachFile />}>
            Choose Image
          </Button>
        </label>
        
        {file && (
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Food'}
          </Button>
        )}
      </Box>

      {/* Image Preview */}
      {imagePreview && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <img
              src={imagePreview}
              alt="Food preview"
              style={{ maxWidth: 300, maxHeight: 200, objectFit: 'contain', borderRadius: 8 }}
            />
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </Typography>
          </Box>
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Results Table */}
      {entries.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Detected Food Items</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" startIcon={<Add />} onClick={() => setShowAddDialog(true)}>
                Add Entry
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSubmit} 
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save All'}
              </Button>
            </Box>
          </Box>

          {/* Totals Display */}
          <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="h6" color="white" align="center">
              Total: {totals.calories} cal | {totals.protein}g protein | {totals.carbs}g carbs | {totals.fat}g fat
            </Typography>
          </Box>

          {/* Food Entries Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Actions</TableCell>
                  <TableCell>Ingredient</TableCell>
                  <TableCell align="right">Portion (g)</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right">Protein (g)</TableCell>
                  <TableCell align="right">Carbs (g)</TableCell>
                  <TableCell align="right">Fat (g)</TableCell>
                  <TableCell align="right">Fiber (g)</TableCell>
                  <TableCell align="right">Sugar (g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.map((entry, index) => (
                  <FoodEntryRow
                    key={index}
                    entry={entry}
                    index={index}
                    isEditing={editingIndex === index}
                    onEdit={() => setEditingIndex(index)}
                    onSave={(updatedEntry) => handleUpdateEntry(index, updatedEntry)}
                    onCancel={() => setEditingIndex(null)}
                    onDelete={() => handleDeleteEntry(index)}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Add Entry Dialog */}
      <FoodEntryDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSave={handleAddEntry}
      />

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};