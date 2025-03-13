import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import GoogleIcon from '@mui/icons-material/Google';
import DescriptionIcon from '@mui/icons-material/Description';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          BRD Creator
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Generate comprehensive Business Requirements Documents for AI automation projects
        </Typography>
        <Box sx={{ mt: 4, mb: 6 }}>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/upload"
            startIcon={<UploadFileIcon />}
            sx={{ mx: 1 }}
          >
            Upload Files
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={RouterLink}
            to="/upload"
            startIcon={<GoogleIcon />}
            sx={{ mx: 1 }}
          >
            Connect Google Drive
          </Button>
        </Box>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <UploadFileIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Upload Documents
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Upload PDF, Word documents, text files, spreadsheets and more. Our AI will analyze the content and extract key requirements.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button component={RouterLink} to="/upload">
                  Upload Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <GoogleIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Google Drive Integration
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Connect directly to Google Drive to access your Google Docs, Sheets, and other documents without downloading.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button component={RouterLink} to="/upload">
                  Connect Drive
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <DescriptionIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  AI-Generated BRDs
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Our AI analyzes your documents and generates structured Business Requirements Documents tailored for AI automation specialists.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button component={RouterLink} to="/upload">
                  Get Started
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;