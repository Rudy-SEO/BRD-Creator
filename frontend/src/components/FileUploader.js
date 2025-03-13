import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Alert from '@mui/material/Alert';

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    setError('');
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success && response.data.brd_id) {
        navigate(`/brd/${response.data.brd_id}`);
      } else {
        setError('Failed to process file. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Error uploading file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Upload Document
        </Typography>

        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 3,
            mb: 3,
            width: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#f0f8ff' : 'transparent',
            '&:hover': {
              backgroundColor: '#f0f8ff',
            },
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          {isDragActive ? (
            <Typography>Drop the file here...</Typography>
          ) : (
            <Typography>
              Drag and drop a file here, or click to select a file
            </Typography>
          )}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Supported formats: PDF, TXT, DOC, DOCX, XLS, XLSX, CSV
          </Typography>
        </Box>

        {file && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            Selected file: {file.name}
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ mt: 2 }}
        >
          {loading ? 'Processing...' : 'Upload & Generate BRD'}
        </Button>
      </Paper>
    </Box>
  );
};

export default FileUploader;