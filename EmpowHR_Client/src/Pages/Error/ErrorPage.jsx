// ErrorPage.jsx
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
        gap={3}
      >
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'primary.main' }}>
          404
        </Typography>

        <Typography variant="h4" gutterBottom>
          Oops! Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary">
          The page you're looking for doesn't exist.
        </Typography>

        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
        >
          Go Back Home
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;
