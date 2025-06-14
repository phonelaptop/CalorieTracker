import { useState } from 'react';
import { Container, Typography, Button, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { AttachFile, CloudUpload } from '@mui/icons-material';
import axios from 'axios';

export const UploadFilePage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file => 
      file.type.startsWith('image/')
    );
    setFiles(selectedFiles);
    setResult(null);
    setError(null);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    // Get token from localStorage or wherever you store it
    const token = localStorage.getItem('token'); // Adjust based on your auth implementation

    const response = await axios.post('/api/ml/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`, // Add auth header
      },
    });

    return response.data;
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const uploadResult = await uploadImage(files[0]); // Upload first image
      setResult(uploadResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>Upload Food Image</Typography>
      
      <input
        accept="image/*"
        id="file-upload"
        type="file"
        hidden
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button variant="outlined" component="span" startIcon={<AttachFile />} sx={{ mr: 2 }}>
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

      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          {files.map((file, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
              <img 
                src={URL.createObjectURL(file)} 
                alt={file.name}
                style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }}
              />
              <Box>
                <Typography variant="body1">{file.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {(file.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Food Analysis Results</Typography>
          
          {/* Total Calories Summary */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
            <Typography variant="h4" color="white" align="center">
              Total Calories: {result.reduce((total, item) => total + item.nutritionFacts.calories, 0)}
            </Typography>
          </Box>

          {/* Detailed Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Ingredient</strong></TableCell>
                  <TableCell align="right"><strong>Portion (g)</strong></TableCell>
                  <TableCell align="right"><strong>Calories</strong></TableCell>
                  <TableCell align="right"><strong>Protein (g)</strong></TableCell>
                  <TableCell align="right"><strong>Carbs (g)</strong></TableCell>
                  <TableCell align="right"><strong>Fat (g)</strong></TableCell>
                  <TableCell><strong>Key Nutrients</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.ingredientName}</TableCell>
                    <TableCell align="right">{item['portionSize(g)']}</TableCell>
                    <TableCell align="right">
                      <strong style={{ color: '#1976d2' }}>
                        {item.nutritionFacts.calories}
                      </strong>
                    </TableCell>
                    <TableCell align="right">{item.nutritionFacts.protein_g}</TableCell>
                    <TableCell align="right">{item.nutritionFacts.carbohydrates_g}</TableCell>
                    <TableCell align="right">{item.nutritionFacts.fat_g}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {item.nutritionFacts.keyVitaminsAndMinerals.map((nutrient, i) => (
                          <Chip key={i} label={nutrient} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total Row */}
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell><strong>TOTAL</strong></TableCell>
                  <TableCell align="right">
                    <strong>{result.reduce((total, item) => total + item['portionSize(g)'], 0)}g</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong style={{ color: '#1976d2', fontSize: '1.1em' }}>
                      {result.reduce((total, item) => total + item.nutritionFacts.calories, 0)}
                    </strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{result.reduce((total, item) => total + item.nutritionFacts.protein_g, 0)}g</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{result.reduce((total, item) => total + item.nutritionFacts.carbohydrates_g, 0)}g</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{result.reduce((total, item) => total + item.nutritionFacts.fat_g, 0)}g</strong>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Container>
  );
};