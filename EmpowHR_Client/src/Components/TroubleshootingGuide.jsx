import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Error,
  Warning,
  Info,
  Refresh
} from '@mui/icons-material';
import axios from 'axios';

const TroubleshootingGuide = () => {
  const [serverStatus, setServerStatus] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkServerHealth = async () => {
    setLoading(true);
    try {
      // Test basic server connectivity
      const serverResponse = await axios.get(`${import.meta.env.VITE_API_URL}/`, { timeout: 5000 });
      setServerStatus({ status: 'online', message: serverResponse.data });

      // Test database connectivity by fetching statistics
      try {
        const dbResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/statistics`, { timeout: 10000 });
        setDbStatus({ status: 'connected', data: dbResponse.data });
      } catch (dbError) {
        setDbStatus({ status: 'error', error: dbError.message });
      }
    } catch (serverError) {
      setServerStatus({ status: 'offline', error: serverError.message });
      setDbStatus({ status: 'unknown', error: 'Cannot test - server offline' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
      case 'connected':
        return 'success';
      case 'offline':
      case 'error':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
      case 'connected':
        return <CheckCircle color="success" />;
      case 'offline':
      case 'error':
        return <Error color="error" />;
      default:
        return <Warning color="warning" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        System Troubleshooting Guide
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={checkServerHealth}
          disabled={loading}
          startIcon={loading ? <Refresh className="animate-spin" /> : <Refresh />}
        >
          {loading ? 'Checking...' : 'Check System Health'}
        </Button>
      </Box>

      {(serverStatus || dbStatus) && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            System Status
          </Typography>
          
          {serverStatus && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {getStatusIcon(serverStatus.status)}
              <Typography>
                Server: 
                <Chip 
                  label={serverStatus.status.toUpperCase()} 
                  color={getStatusColor(serverStatus.status)}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
            </Box>
          )}

          {dbStatus && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {getStatusIcon(dbStatus.status)}
              <Typography>
                Database: 
                <Chip 
                  label={dbStatus.status.toUpperCase()} 
                  color={getStatusColor(dbStatus.status)}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
            </Box>
          )}

          {dbStatus?.data && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Database is working! Found {dbStatus.data.totalUsers} users, {dbStatus.data.totalPayments} payments.
            </Alert>
          )}

          {(serverStatus?.error || dbStatus?.error) && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Errors:</Typography>
              {serverStatus?.error && <Typography variant="body2">Server: {serverStatus.error}</Typography>}
              {dbStatus?.error && <Typography variant="body2">Database: {dbStatus.error}</Typography>}
            </Alert>
          )}
        </Paper>
      )}

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Common Issues & Solutions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemIcon><Error color="error" /></ListItemIcon>
              <ListItemText
                primary="Internal Server Error"
                secondary="Check if the server is running on port 3000: cd server && npm run dev"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Warning color="warning" /></ListItemIcon>
              <ListItemText
                primary="Database Connection Error"
                secondary="Verify MongoDB connection string in server/.env file"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Info color="info" /></ListItemIcon>
              <ListItemText
                primary="Stripe Payment Errors"
                secondary="Ensure STRIPE_SECRET_KEY is set in server/.env and VITE_STRIPE_PUBLISHABLE_KEY in client/.env"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText
                primary="CORS Issues"
                secondary="Server is configured to accept all origins during development"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Quick Fixes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText
                primary="1. Restart the Server"
                secondary="cd server && npm run dev"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="2. Restart the Client"
                secondary="cd client && npm run dev"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="3. Clear Browser Cache"
                secondary="Press Ctrl+Shift+R (or Cmd+Shift+R on Mac) to hard refresh"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="4. Check Environment Variables"
                secondary="Ensure all required environment variables are set in both client/.env and server/.env"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Environment Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" component="div">
            <strong>Required Client Environment Variables (.env):</strong>
            <List dense>
              <ListItem><ListItemText primary="VITE_API_URL=http://localhost:3000" /></ListItem>
              <ListItem><ListItemText primary="VITE_FIREBASE_API_KEY=..." /></ListItem>
              <ListItem><ListItemText primary="VITE_STRIPE_PUBLISHABLE_KEY=pk_test_..." /></ListItem>
            </List>
            
            <strong>Required Server Environment Variables (.env):</strong>
            <List dense>
              <ListItem><ListItemText primary="MONGODB_URI=mongodb+srv://..." /></ListItem>
              <ListItem><ListItemText primary="STRIPE_SECRET_KEY=sk_test_..." /></ListItem>
              <ListItem><ListItemText primary="PORT=3000" /></ListItem>
            </List>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default TroubleshootingGuide;
