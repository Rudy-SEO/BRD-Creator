import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import FileUploader from '../components/FileUploader';
import GoogleDriveConnector from '../components/GoogleDriveConnector';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`upload-tabpanel-${index}`}
      aria-labelledby={`upload-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const Upload = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Upload Documents
        </Typography>
        <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
          Upload files or connect to Google Drive to generate a Business Requirements Document
        </Typography>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="File Upload" />
            <Tab label="Google Drive" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <FileUploader />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <GoogleDriveConnector />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default Upload;