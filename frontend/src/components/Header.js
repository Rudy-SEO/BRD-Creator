import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import DescriptionIcon from '@mui/icons-material/Description';

const Header = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <DescriptionIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            BRD Creator
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/upload"
          >
            Upload
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;