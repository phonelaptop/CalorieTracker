import { useState } from 'react';
import { Container, Typography, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import { AttachFile } from '@mui/icons-material';

export const UploadFilePage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Upload Your Files
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <input
          accept="*"
          id="upload-button-file"
          multiple
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <label htmlFor="upload-button-file">
          <Button
            variant="contained"
            component="span"
            startIcon={<AttachFile />}
          >
            Choose Files
          </Button>
        </label>
      </Box>

      {selectedFiles.length > 0 && (
        <Box>
          <Typography variant="h6">Selected Files:</Typography>
          <List>
            {selectedFiles.map((file, index) => (
              <ListItem key={index}>
                <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Container>
  );
}
