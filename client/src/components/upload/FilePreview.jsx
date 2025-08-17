import { Box, Typography } from '@mui/material';

export const FilePreview = ({ file }) => {
  if (!file) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
        <img
          src={URL.createObjectURL(file)}
          alt="Food"
          style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
        />
        <Box>
          <Typography variant="h6">{file.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {(file.size / 1024).toFixed(1)} KB
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};