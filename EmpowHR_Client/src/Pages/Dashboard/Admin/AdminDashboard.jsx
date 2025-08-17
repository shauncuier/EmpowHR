import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import {
  SupervisorAccount,
  AttachMoney,
  Analytics,
  Assignment,
  Payment,
  Settings,
  Dashboard as DashboardIcon,
  Person
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import AllEmployeeList from './AllEmployeeList';
import Payroll from './Payroll';
import AdminOverview from './AdminOverview';
import WorksheetManagement from './WorksheetManagement';
import PaymentHistory from './PaymentHistory';
import AdminAnalytics from './AdminAnalytics';
import SystemSettings from './SystemSettings';
import ProfileUpdate from '../Profile/ProfileUpdate';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabValue, setTabValue] = useState(0);

  // Handle URL tab parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      const tabIndex = parseInt(tabParam);
      if (tabIndex >= 0 && tabIndex <= 6) {
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
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all employees, process payroll, and oversee company operations
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin dashboard tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            icon={<DashboardIcon />}
            label="Overview"
            id="admin-tab-0"
            aria-controls="admin-tabpanel-0"
          />
          <Tab
            icon={<SupervisorAccount />}
            label="Employee Management"
            id="admin-tab-1"
            aria-controls="admin-tabpanel-1"
          />
          <Tab
            icon={<AttachMoney />}
            label="Payroll Processing"
            id="admin-tab-2"
            aria-controls="admin-tabpanel-2"
          />
          <Tab
            icon={<Assignment />}
            label="Worksheet Management"
            id="admin-tab-3"
            aria-controls="admin-tabpanel-3"
          />
          <Tab
            icon={<Payment />}
            label="Payment History"
            id="admin-tab-4"
            aria-controls="admin-tabpanel-4"
          />
          <Tab
            icon={<Analytics />}
            label="Analytics"
            id="admin-tab-5"
            aria-controls="admin-tabpanel-5"
          />
          <Tab
            icon={<Person />}
            label="Profile"
            id="admin-tab-6"
            aria-controls="admin-tabpanel-6"
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <AdminOverview />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <AllEmployeeList />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Payroll />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <WorksheetManagement />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <PaymentHistory />
      </TabPanel>
      <TabPanel value={tabValue} index={5}>
        <AdminAnalytics />
      </TabPanel>
      <TabPanel value={tabValue} index={6}>
        <ProfileUpdate />
      </TabPanel>
    </Box>
  );
};

export default AdminDashboard;
