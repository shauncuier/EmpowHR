import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { People, Assignment, BarChart, Person } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import ProgressMonitoring from './ProgressMonitoring';
import ProfileUpdate from '../Profile/ProfileUpdate';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`hr-tabpanel-${index}`}
      aria-labelledby={`hr-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const HRDashboard = () => {
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
          HR Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage employees, monitor progress, and process payments
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="hr dashboard tabs">
          <Tab 
            icon={<People />} 
            label="Employee List" 
            id="hr-tab-0"
            aria-controls="hr-tabpanel-0"
          />
          <Tab 
            icon={<BarChart />} 
            label="Progress Monitoring" 
            id="hr-tab-1"
            aria-controls="hr-tabpanel-1"
          />
          <Tab 
            icon={<Person />} 
            label="Profile" 
            id="hr-tab-2"
            aria-controls="hr-tabpanel-2"
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <EmployeeList />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ProgressMonitoring />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <ProfileUpdate />
      </TabPanel>
    </Box>
  );
};

export default HRDashboard;
