import React from 'react';
import { useAuth } from '../Context/AuthContext';
import { validateUserAccess } from '../Utils/rolePermissions';
import { Alert, Box } from '@mui/material';

const PermissionGuard = ({ 
  children, 
  requiredPermissions = [], 
  fallback = null, 
  showError = false,
  errorMessage = 'You do not have permission to access this feature.' 
}) => {
  const { userDetails } = useAuth();

  // Check if user has required permissions
  const accessCheck = validateUserAccess(userDetails, requiredPermissions);

  // If user doesn't have access
  if (!accessCheck.hasAccess) {
    // Show error message if requested
    if (showError) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="warning">
            {errorMessage}
          </Alert>
        </Box>
      );
    }

    // Show fallback component if provided
    if (fallback) {
      return fallback;
    }

    // Otherwise, render nothing
    return null;
  }

  // User has access, render children
  return children;
};

export default PermissionGuard;
