import { useState, useCallback } from 'react';
import { fileService } from '../services/api';

export const useFiles = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const getFiles = useCallback(async () => {
    try {
      const { data } = await fileService.getFiles();
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load files');
      console.error('File load error:', err);
    }
  }, []);

  const deleteFile = useCallback(async (fileId) => {
    try {
      await fileService.deleteFile(fileId);
      setFiles(files => files.filter(file => file._id !== fileId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete file');
    }
  }, []);

  return {
    files,
    uploading,
    error,
    setError,
    getFiles,
    deleteFile,
    setUploading
  };
}; 