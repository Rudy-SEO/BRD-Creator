import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleDriveConnector = () => {
  const [googleFileUrl, setGoogleFileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('/api/google/auth');
      if (response.data.auth_url) {
        // Store the file URL in localStorage to retrieve after auth
        localStorage.setItem('pendingGoogleFileUrl', googleFileUrl);
        // Redirect to Google auth
        window.location.href = response.data.auth_url;
      } else {
        setError('Failed to initialize Google authentication');
      }
    } catch (err) {
      console.error('Google auth error:', err);
      setError('Error connecting to Google Drive. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const extractFileInfo = (url) => {
    // Extract file ID and type from Google Drive URL
    // Example: https://docs.google.com/document/d/1abc123def456/edit
    // or https://docs.google.com/spreadsheets/d/1abc123def456/edit
    
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      
      let fileType = '';
      if (url.includes('docs.google.com/document')) {
        fileType = 'document';
      } else if (url.includes('docs.google.com/spreadsheets')) {
        fileType = 'spreadsheet';
      } else {
        return null;
      }
      
      // Find the file ID in the path
      const fileIdIndex = pathParts.indexOf('d') + 1;
      if (fileIdIndex < pathParts.length) {
        const fileId = pathParts[fileIdIndex];
        return { fileId, fileType };
      }
      
      return null;
    } catch (err) {
      console.error('Error parsing Google URL:', err);
      return null;
    }
  };

  const handleUrlChange = (e) => {
    setGoogleFileUrl(e.target.value);
    setError('');
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
          Connect to Google Drive
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          Enter the URL of a Google Document or Google Sheet to analyze
        </Typography>
        
        <TextField
          fullWidth
          label="Google Doc or Sheet URL"
          variant="outlined"
          value={googleFileUrl}
          onChange={handleUrlChange}
          placeholder="https://docs.google.com/document/d/..."
          sx={{ mb: 3 }}
        />
        
        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        
        <Button
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
          onClick={handleConnect}
          disabled={!googleFileUrl || loading}
        >
          {loading ? 'Connecting...' : 'Connect to Google Drive'}
        </Button>
      </Paper>
    </Box>
  );
};

export default GoogleDriveConnector;