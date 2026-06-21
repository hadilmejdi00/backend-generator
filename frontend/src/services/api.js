import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateProject = async (model) => {
  const response = await api.post('/api/generator/generate', model, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${model.projectName}.zip`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export default api;