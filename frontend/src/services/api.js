import axios from 'axios';

// Updated to use Vite's environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGEKIT_UPLOAD_URL = import.meta.env.VITE_IMAGEKIT_UPLOAD_URL;
const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fileService = {
  getFiles: () => api.get('/files'),
  getStorageStats: () => api.get('/files/storage'),
  getUploadAuth: () => api.get('/files/auth'),
  deleteFile: (fileId) => api.delete(`/files/${fileId}`),
  saveFileMetadata: (fileData) => api.post('/files', fileData),
  
  uploadToImageKit: async (file, authParams) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('publicKey', IMAGEKIT_PUBLIC_KEY);
    formData.append('signature', authParams.signature);
    formData.append('token', authParams.token);
    formData.append('expire', authParams.expire);

    return axios.post(IMAGEKIT_UPLOAD_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
}; 