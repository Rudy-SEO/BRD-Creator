import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

const GoogleAuth = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Get the auth code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          setError('No authorization code received from Google');
          setLoading(false);
          return;
        }
        
        // Get the pending Google file URL from localStorage
        const pendingFileUrl = localStorage.getItem('pendingGoogleFileUrl');
        if (!pendingFileUrl) {
          setError('No Google file URL found. Please try again.');
          setLoading(false);
          return;
        }
        
        // Extract file info from the URL
        const fileInfo = extractFileInfo(pendingFileUrl);
        if (!fileInfo) {
          setError('Invalid Google file URL. Please try again with a valid Google Doc or Sheet URL.');
          setLoading(false);
          return;
        }
        
        // Exchange the code for a token and process the file
        const response = await axios.post('/api/google/process', {
          code: code,
          fileId: fileInfo.fileId,
          fileType: fileInfo.fileType
        });
        
        if (response.data.success && response.data.brd_id) {
          setSuccess(true);
          // Clear the pending URL
          localStorage.removeItem('pendingGoogleFileUrl');
          // Navigate to the BRD view page after a short delay
          setTimeout(() => {
            navigate(`/brd/${response.data.brd_id}`);
          }, 1500);
        } else {
          setError('Failed to process Google file. Please try again.');
        }
      } catch (err) {
        console.error('Google auth callback error:', err);
        setError(err.response?.data?.error || 'Error processing Google authentication. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    processAuth();
  }, [navigate]);
  
  const extractFileInfo = (url) => {
    // Extract file ID and type from Google Drive URL
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

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Google Authentication
        </Typography>
        
        {loading && (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Processing Google authentication...
            </Typography>
          </Box>
        )}
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ width: '100%', mt: 2 }}
            action={
              <Button color="inherit" size="small" onClick={() => navigate('/upload')}>
                Try Again
              </Button>
            }
          >
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
            Google file processed successfully! Redirecting to your BRD...
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default GoogleAuth;