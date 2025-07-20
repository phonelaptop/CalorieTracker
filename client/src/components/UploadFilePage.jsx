import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Button, Box, CircularProgress, Alert, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, Snackbar 
} from '@mui/material';
import { AttachFile, CloudUpload, Edit, Delete, Add, Save, Cancel } from '@mui/icons-material';
import axios from 'axios';

export const UploadFilePage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEntry, setNewEntry] = useState({});
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

    try {
      const formData = new FormData();
      formData.append('image', files[0]);
      
      const response = await axios.post('/api/ml/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
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

  const handleAddNew = () => {
    setNewEntry({
      ingredientName: '',
      portionSize_g: 0,
      calories: 0,
      protein_g: 0,
      carbohydrates_g: 0,
      fat_g: 0,
      fiber_g: 0,
      sugar_g: 0,
      sodium_mg: 0,
      vitamin_A: 0,
      vitamin_C: 0,
      calcium: 0,
      iron: 0,
    });
    setShowAddDialog(true);
  };

  const handleSaveNew = () => {
    const newItem = {
      ingredientName: newEntry.ingredientName,
      'portionSize(g)': newEntry.portionSize_g,
      nutritionFacts: {
        calories: newEntry.calories,
        protein_g: newEntry.protein_g,
        carbohydrates_g: newEntry.carbohydrates_g,
        fat_g: newEntry.fat_g,
        fiber_g: newEntry.fiber_g,
        sugar_g: newEntry.sugar_g,
        sodium_mg: newEntry.sodium_mg,
        'Vitamin A': newEntry.vitamin_A,
        'Vitamin C': newEntry.vitamin_C,
        'Calcium': newEntry.calcium,
        'Iron': newEntry.iron,
      }
    };
    setResult([...result, newItem]);
    setShowAddDialog(false);
    setNewEntry({});
  };

  const handleSubmit = async () => {
    if (!result || result.length === 0) return;

    setSubmitting(true);
    try {
      const foodEntries = result.map(item => ({
        imageUrl: files[0] ? URL.createObjectURL(files[0]) : '',
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

      await axios.post('/api/foodentry', foodEntries, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSnackbar({ open: true, message: 'Food entries saved successfully!', severity: 'success' });
      setResult(null);
      setFiles([]);
      navigate('/analytics');
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to save', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const totals = result ? result.reduce((acc, item) => ({
    calories: acc.calories + item.nutritionFacts.calories,
    protein: acc.protein + item.nutritionFacts.protein_g,
    carbs: acc.carbs + item.nutritionFacts.carbohydrates_g,
    fat: acc.fat + item.nutritionFacts.fat_g,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 }) : null;

  const renderCell = (value, field, isEditing) => {
    if (isEditing) {
      return (
        <TextField
          type={field === 'ingredientName' ? 'text' : 'number'}
          value={editData[field] || (field === 'ingredientName' ? '' : 0)}
          onChange={(e) => setEditData({...editData, [field]: field === 'ingredientName' ? e.target.value : Number(e.target.value)})}
          size="small"
          sx={{ width: field === 'ingredientName' ? '120px' : '80px' }}
        />
      );
    }
    return value;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 700, mb: 4 }}>
        Food Nutrition Tracker
      </Typography>

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
        
        {files.length > 0 && (
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Food'}
          </Button>
        )}
      </Box>

      {files.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <img
              src={URL.createObjectURL(files[0])}
              alt="Food"
              style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
            />
            <Box>
              <Typography variant="h6">{files[0].name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {(files[0].size / 1024).toFixed(1)} KB
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Results</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" startIcon={<Add />} onClick={handleAddNew}>
                Add Entry
              </Button>
              <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Saving...' : 'Save All'}
              </Button>
            </Box>
          </Box>

          {totals && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="h6" color="white" align="center">
                Total: {totals.calories} cal | {totals.protein}g protein | {totals.carbs}g carbs | {totals.fat}g fat
              </Typography>
            </Box>
          )}

          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1000 }}>
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
                  <TableCell align="right">Sodium (mg)</TableCell>
                  <TableCell align="right">Vitamin A</TableCell>
                  <TableCell align="right">Vitamin C</TableCell>
                  <TableCell align="right">Calcium</TableCell>
                  <TableCell align="right">Iron</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.map((item, index) => {
                  const isEditing = editingRow === index;
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {isEditing ? (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton onClick={handleSaveEdit} color="success" size="small">
                              <Save />
                            </IconButton>
                            <IconButton onClick={() => setEditingRow(null)} color="error" size="small">
                              <Cancel />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton onClick={() => handleEdit(index)} color="primary" size="small">
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(index)} color="error" size="small">
                              <Delete />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>{renderCell(item.ingredientName, 'ingredientName', isEditing)}</TableCell>
                      <TableCell align="right">{renderCell(item['portionSize(g)'], 'portionSize_g', isEditing)}</TableCell>
                      <TableCell align="right">{renderCell(item.nutritionFacts.calories, 'calories', isEditing)}</TableCell>
                      <TableCell align="right">{renderCell(item.nutritionFacts.protein_g, 'protein_g', isEditing)}</TableCell>
                      <TableCell align="right">{renderCell(item.nutritionFacts.carbohydrates_g, 'carbohydrates_g', isEditing)}</TableCell>
                      <TableCell align="right">{renderCell(item.nutritionFacts.fat_g, 'fat_g', isEditing)}</TableCell>
                      <TableCell align="right">{renderCell(item.nutritionFacts.fiber_g || 0, 'fiber_g', isEditing)}</TableCell>
                      <TableCell align="right">{renderCell(item.nutritionFacts.sugar_g || 0, 'sugar_g', isEditing)}</TableCell>
                      <TableCell align="right">{renderCell(item.nutritionFacts.sodium_mg || 0, 'sodium_mg', isEditing)}</TableCell>
                      <TableCell align="right">{renderCell(item.nutritionFacts['Vitamin A'] || 0, 'vitamin_A', isEditing)}</TableCell>
                      <TableCell align="right">{renderCell(item.nutritionFacts['Vitamin C'] || 0, 'vitamin_C', isEditing)}</TableCell>
                      <TableCell align="right">{renderCell(item.nutritionFacts['Calcium'] || 0, 'calcium', isEditing)}</TableCell>
                      <TableCell align="right">{renderCell(item.nutritionFacts['Iron'] || 0, 'iron', isEditing)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Food Entry</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 2 }}>
            <TextField
              label="Ingredient Name"
              value={newEntry.ingredientName || ''}
              onChange={(e) => setNewEntry({...newEntry, ingredientName: e.target.value})}
              fullWidth
            />
            <TextField
              label="Portion (g)"
              type="number"
              value={newEntry.portionSize_g || 0}
              onChange={(e) => setNewEntry({...newEntry, portionSize_g: Number(e.target.value)})}
              fullWidth
            />
            <TextField
              label="Calories"
              type="number"
              value={newEntry.calories || 0}
              onChange={(e) => setNewEntry({...newEntry, calories: Number(e.target.value)})}
              fullWidth
            />
            <TextField
              label="Protein (g)"
              type="number"
              value={newEntry.protein_g || 0}
              onChange={(e) => setNewEntry({...newEntry, protein_g: Number(e.target.value)})}
              fullWidth
            />
            <TextField
              label="Carbs (g)"
              type="number"
              value={newEntry.carbohydrates_g || 0}
              onChange={(e) => setNewEntry({...newEntry, carbohydrates_g: Number(e.target.value)})}
              fullWidth
            />
            <TextField
              label="Fat (g)"
              type="number"
              value={newEntry.fat_g || 0}
              onChange={(e) => setNewEntry({...newEntry, fat_g: Number(e.target.value)})}
              fullWidth
            />
            <TextField
              label="Fiber (g)"
              type="number"
              value={newEntry.fiber_g || 0}
              onChange={(e) => setNewEntry({...newEntry, fiber_g: Number(e.target.value)})}
              fullWidth
            />
            <TextField
              label="Sugar (g)"
              type="number"
              value={newEntry.sugar_g || 0}
              onChange={(e) => setNewEntry({...newEntry, sugar_g: Number(e.target.value)})}
              fullWidth
            />
            <TextField
              label="Sodium (mg)"
              type="number"
              value={newEntry.sodium_mg || 0}
              onChange={(e) => setNewEntry({...newEntry, sodium_mg: Number(e.target.value)})}
              fullWidth
            />
            <TextField
              label="Vitamin A"
              type="number"
              value={newEntry.vitamin_A || 0}
              onChange={(e) => setNewEntry({...newEntry, vitamin_A: Number(e.target.value)})}
              fullWidth
            />
            <TextField
              label="Vitamin C"
              type="number"
              value={newEntry.vitamin_C || 0}
              onChange={(e) => setNewEntry({...newEntry, vitamin_C: Number(e.target.value)})}
              fullWidth
            />
            <TextField
              label="Calcium"
              type="number"
              value={newEntry.calcium || 0}
              onChange={(e) => setNewEntry({...newEntry, calcium: Number(e.target.value)})}
              fullWidth
            />
            <TextField
              label="Iron"
              type="number"
              value={newEntry.iron || 0}
              onChange={(e) => setNewEntry({...newEntry, iron: Number(e.target.value)})}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveNew} variant="contained">Add Entry</Button>
        </DialogActions>
      </Dialog>

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