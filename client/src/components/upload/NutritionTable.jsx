import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, IconButton, Box 
} from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';

export const NutritionTable = ({ 
  data, 
  editingRow, 
  editData, 
  onEdit, 
  onSaveEdit, 
  onCancelEdit, 
  onDelete, 
  onEditDataChange 
}) => {
  const renderCell = (value, field, isEditing) => {
    if (isEditing) {
      return (
        <TextField
          type={field === 'ingredientName' ? 'text' : 'number'}
          value={editData[field] || (field === 'ingredientName' ? '' : 0)}
          onChange={(e) => onEditDataChange(field, field === 'ingredientName' ? e.target.value : Number(e.target.value))}
          size="small"
          sx={{ width: field === 'ingredientName' ? '120px' : '80px' }}
        />
      );
    }
    return value;
  };

  return (
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
          {data.map((item, index) => {
            const isEditing = editingRow === index;
            return (
              <TableRow key={index}>
                <TableCell>
                  {isEditing ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={onSaveEdit} color="success" size="small">
                        <Save />
                      </IconButton>
                      <IconButton onClick={onCancelEdit} color="error" size="small">
                        <Cancel />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => onEdit(index)} color="primary" size="small">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => onDelete(index)} color="error" size="small">
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
  );
};