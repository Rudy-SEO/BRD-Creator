import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';

const ViewBRD = () => {
  const { brdId } = useParams();
  const [brd, setBrd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBRD = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/brd/${brdId}`);
        setBrd(response.data);
      } catch (err) {
        console.error('Error fetching BRD:', err);
        setError('Failed to load the Business Requirements Document. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (brdId) {
      fetchBRD();
    }
  }, [brdId]);

  const handleDownload = () => {
    // Create a JSON blob and download it
    const brdJson = JSON.stringify(brd.brd, null, 2);
    const blob = new Blob([brdJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `BRD_${brdId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper function to render nested objects
  const renderNestedObject = (obj) => {
    if (!obj) return null;
    
    return Object.entries(obj).map(([key, value]) => {
      // Skip rendering if value is null or empty
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        return null;
      }
      
      // Format the key for display
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
      
      return (
        <Box key={key} sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {formattedKey}
          </Typography>
          
          {typeof value === 'object' && !Array.isArray(value) ? (
            <Box sx={{ pl: 2 }}>
              {renderNestedObject(value)}
            </Box>
          ) : Array.isArray(value) ? (
            <Box component="ul" sx={{ pl: 4, mt: 1 }}>
              {value.map((item, index) => (
                <Typography component="li" key={index} variant="body1">
                  {typeof item === 'object' ? renderNestedObject(item) : item}
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" paragraph>
              {value}
            </Typography>
          )}
        </Box>
      );
    });
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!brd) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 4 }}>
          No BRD found with the provided ID.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Business Requirements Document
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {/* Executive Summary */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Executive Summary
          </Typography>
          <Typography variant="body1">
            {brd.brd.executiveSummary || 'No executive summary provided.'}
          </Typography>
        </Box>
        
        {/* Main BRD sections as accordions */}
        {Object.entries(brd.brd).map(([key, value]) => {
          // Skip executive summary as it's already displayed
          if (key === 'executiveSummary') return null;
          
          // Format the key for display
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
          
          return (
            <Accordion key={key} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{formattedKey}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {typeof value === 'object' ? (
                  renderNestedObject(value)
                ) : (
                  <Typography variant="body1">{value}</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
        
        {/* Metadata */}
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="caption" color="text.secondary">
            Document ID: {brd.id}
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            Created: {new Date(brd.created_at).toLocaleString()}
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            Source: {brd.original_filename || brd.original_source || 'Unknown'}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ViewBRD;