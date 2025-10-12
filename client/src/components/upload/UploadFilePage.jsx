import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert, Button, Snackbar } from '@mui/material';
import { FileUploader } from './FileUploader';
import { FilePreview } from './FilePreview';
import { NutritionTable } from './NutritionTable';
import { useApi } from '../../hooks/useApi';
import { calculateTotals, formatFoodEntry } from '../../utils/nutrition';
export const UploadFilePage = () => {
  const navigate = useNavigate();
  const { analyzeImage, saveFoodEntries } = useApi();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file =>
      file.type.startsWith('image/')
    );
    setFiles(selectedFiles);
    setResult(null);
    setError(null);
  };
  const handleUpload = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);
    const response = await analyzeImage(files[0]);
    if (response.success) {
      setResult(response.data);
    } else {
      setError(response.error);
    }
    setLoading(false);
  };
  const handleEdit = (index) => {
    const item = result[index];
    setEditingRow(index);
    setEditData({
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
    });
  };
  const handleSaveEdit = () => {
    const updatedResult = [...result];
    updatedResult[editingRow] = {
      ingredientName: editData.ingredientName,
      'portionSize(g)': editData.portionSize_g,
      nutritionFacts: {
        calories: editData.calories,
        protein_g: editData.protein_g,
        carbohydrates_g: editData.carbohydrates_g,
        fat_g: editData.fat_g,
        fiber_g: editData.fiber_g,
        sugar_g: editData.sugar_g,
        sodium_mg: editData.sodium_mg,
        'Vitamin A': editData.vitamin_A,
        'Vitamin C': editData.vitamin_C,
        'Calcium': editData.calcium,
        'Iron': editData.iron,
      }
    };
    setResult(updatedResult);
    setEditingRow(null);
    setEditData({});
  };
  const handleDelete = (index) => {
    setResult(result.filter((_, i) => i !== index));
  };
  const handleSubmit = async () => {
    if (!result || result.length === 0) return;
    setSubmitting(true);
    const foodEntries = result.map(item => formatFoodEntry(item, files[0]));
    const response = await saveFoodEntries(foodEntries);
    if (response.success) {
      setSnackbar({
        open: true,
        message: 'Food entries saved successfully!',
        severity: 'success'
      });
      setResult(null);
      setFiles([]);
      setTimeout(() => navigate('/analytics'), 1000);
    } else {
      setSnackbar({
        open: true,
        message: response.error || 'Failed to save',
        severity: 'error'
      });
    }
    setSubmitting(false);
  };
  const totals = calculateTotals(result);
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 700, mb: 4 }}>
        Food Nutrition Tracker
      </Typography>
      <FileUploader
        files={files}
        loading={loading}
        onFileChange={handleFileChange}
        onUpload={handleUpload}
      />
      <FilePreview file={files[0]} />
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
      {result && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Results</Typography>
            <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save All'}
            </Button>
          </Box>
          {totals && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="h6" color="white" align="center">
                Total: {totals.calories} cal | {totals.protein}g protein | {totals.carbs}g carbs | {totals.fat}g fat
              </Typography>
            </Box>
          )}
          <NutritionTable
            data={result}
            editingRow={editingRow}
            editData={editData}
            onEdit={handleEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={() => setEditingRow(null)}
            onDelete={handleDelete}
            onEditDataChange={(field, value) => setEditData({...editData, [field]: value})}
          />
        </Box>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Box sx={{ height: "31vh" }} />
    </Container>
  );
};  