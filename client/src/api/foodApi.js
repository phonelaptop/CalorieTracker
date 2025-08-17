import axios from 'axios';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const foodApi = {
  async analyzeImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await axios.post('/api/ml/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders()
      }
    });
    return response.data;
  },

  async saveFoodEntries(entries) {
    const response = await axios.post('/api/foodentry', entries, {
      headers: getAuthHeaders()
    });
    return response.data;
  }
};