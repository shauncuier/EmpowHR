import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import EmployeeDashboard from './Employee/EmployeeDashboard';
import HRDashboard from './HR/HRDashboard';
import AdminDashboard from './Admin/AdminDashboard';
import { CircularProgress, Box, Typography, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const DashboardRouter = () => {
  const { user, userDetails, loading } = useAuth();

  console.log('DashboardRouter - Auth State:', { 
    user: user?.email, 
    userDetails: userDetails?.role, 
    loading 
  });

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="h6">Loading dashboard...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Please log in to access the dashboard
          </Typography>
          <Button component={Link} to="/login" variant="contained">
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!userDetails) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Setting up your profile...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User: {user.email}
          </Typography>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outlined" 
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  // Check if user is fired
  if (userDetails.isFired) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom color="error">
            Account Suspended
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your account has been suspended. Please contact HR.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Route to appropriate dashboard based on user role
  const role = userDetails.role?.toLowerCase();
  
  switch (role) {
    case 'employee':
      return <EmployeeDashboard />;
    case 'hr':
      return <HRDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      console.warn('Unknown role:', userDetails.role, 'defaulting to employee dashboard');
      return <EmployeeDashboard />;
  }
};

export default DashboardRouter;
