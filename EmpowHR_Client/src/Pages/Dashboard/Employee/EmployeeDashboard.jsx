import React from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { Assignment, Payment, Person } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import WorkSheet from './WorkSheet';
import PaymentHistory from './PaymentHistory';
import ProfileUpdate from '../Profile/ProfileUpdate';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`employee-tabpanel-${index}`}
      aria-labelledby={`employee-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const EmployeeDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabValue, setTabValue] = useState(0);

  // Handle URL tab parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      const tabIndex = parseInt(tabParam);
      if (tabIndex >= 0 && tabIndex <= 2) {
        setTabValue(tabIndex);
      }
    }
  }, [searchParams]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchParams({ tab: newValue.toString() });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Employee Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your work and track your payments
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="employee dashboard tabs">
          <Tab 
            icon={<Assignment />} 
            label="Work-sheet" 
            id="employee-tab-0"
            aria-controls="employee-tabpanel-0"
          />
          <Tab 
            icon={<Payment />} 
            label="Payment History" 
            id="employee-tab-1"
            aria-controls="employee-tabpanel-1"
          />
          <Tab 
            icon={<Person />} 
            label="Profile" 
            id="employee-tab-2"
            aria-controls="employee-tabpanel-2"
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <WorkSheet />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <PaymentHistory />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <ProfileUpdate />
      </TabPanel>
    </Box>
  );
};

export default EmployeeDashboard;
