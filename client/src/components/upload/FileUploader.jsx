import { Box, Button } from '@mui/material';
import { AttachFile, CloudUpload } from '@mui/icons-material';

export const FileUploader = ({ files, loading, onFileChange, onUpload }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
    <input
      accept="image/*"
      id="file-upload"
      type="file"
      hidden
      onChange={onFileChange}
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
        onClick={onUpload}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Food'}
      </Button>
    )}
  </Box>
);