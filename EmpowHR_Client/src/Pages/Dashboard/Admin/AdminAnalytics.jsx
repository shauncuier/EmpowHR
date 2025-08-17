import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  People,
  AttachMoney,
  Assignment,
  Download,
  Refresh
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [tabValue, setTabValue] = useState(0);

  // Fetch all users
  const { data: users = [] } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      return response.data;
    }
  });

  // Calculate statistics from users data
  const stats = React.useMemo(() => {
    if (!users || users.length === 0) {
      return {
        totalUsers: 0,
        employees: 0,
        hrPersonnel: 0,
        admins: 0,
        verified: 0,
        fired: 0,
        totalSalary: 0,
        averageSalary: 0
      };
    }

    const totalUsers = users.length;
    const employees = users.filter(user => user.role === 'employee').length;
    const hrPersonnel = users.filter(user => user.role === 'hr').length;
    const admins = users.filter(user => user.role === 'admin').length;
    const verified = users.filter(user => user.isVerified).length;
    const fired = users.filter(user => user.isFired).length;
    const totalSalary = users.reduce((sum, user) => sum + (user.salary || 0), 0);
    const averageSalary = totalUsers > 0 ? totalSalary / totalUsers : 0;

    return {
      totalUsers,
      employees,
      hrPersonnel,
      admins,
      verified,
      fired,
      totalSalary,
      averageSalary
    };
  }, [users]);

  // Fetch all payments
  const { data: allPayments = [] } = useQuery({
    queryKey: ['all-payments'],
    queryFn: async () => {
      const payments = [];
      for (const user of users) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/payments/${user.email}`);
          payments.push(...response.data);
        } catch (error) {
          console.warn(`Could not fetch payments for ${user.email}`);
        }
      }
      return payments;
    },
    enabled: users.length > 0
  });

  // Fetch all worksheets
  const { data: allWorksheets = [] } = useQuery({
    queryKey: ['all-worksheets-analytics'],
    queryFn: async () => {
      const worksheets = [];
      for (const user of users) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/worksheets/${user.email}`);
          worksheets.push(...response.data.map(w => ({ ...w, userName: user.name })));
        } catch (error) {
          console.warn(`Could not fetch worksheets for ${user.email}`);
        }
      }
      return worksheets;
    },
    enabled: users.length > 0
  });

  // Analytics calculations
  const analyticsData = React.useMemo(() => {
    // Role distribution
    const roleDistribution = [
      { name: 'Employees', value: stats?.employees || 0, color: '#0088FE' },
      { name: 'HR Personnel', value: stats?.hrPersonnel || 0, color: '#00C49F' },
      { name: 'Admins', value: stats?.admins || 0, color: '#FFBB28' }
    ];

    // Monthly payment trends (last 6 months)
    const paymentTrends = [];
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthPayments = allPayments.filter(p => 
        p.month === month.getMonth() + 1 && p.year === month.getFullYear()
      );
      
      paymentTrends.push({
        month: month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        amount: monthPayments.reduce((sum, p) => sum + p.amount, 0),
        count: monthPayments.length
      });
    }

    // Task distribution
    const taskDistribution = allWorksheets.reduce((acc, w) => {
      acc[w.task] = (acc[w.task] || 0) + w.hours;
      return acc;
    }, {});

    const taskData = Object.entries(taskDistribution).map(([task, hours]) => ({
      task,
      hours
    }));

    // Employee productivity (top 10)
    const employeeProductivity = allWorksheets.reduce((acc, w) => {
      if (!acc[w.email]) {
        acc[w.email] = { name: w.userName || w.email, hours: 0, tasks: 0 };
      }
      acc[w.email].hours += w.hours;
      acc[w.email].tasks += 1;
      return acc;
    }, {});

    const productivityData = Object.values(employeeProductivity)
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10);

    // Verification status
    const verificationData = [
      { name: 'Verified', value: stats?.verified || 0, color: '#00C49F' },
      { name: 'Unverified', value: (stats?.totalUsers || 0) - (stats?.verified || 0), color: '#FF8042' }
    ];

    return {
      roleDistribution,
      paymentTrends,
      taskData,
      productivityData,
      verificationData
    };
  }, [stats, allPayments, allWorksheets]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Analytics color="primary" />
            <Box>
              <Typography variant="h6">Advanced Analytics</Typography>
              <Typography variant="body2" color="text.secondary">
                Comprehensive insights and data visualization
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Period</InputLabel>
              <Select
                value={selectedPeriod}
                label="Period"
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <MenuItem value="thisWeek">This Week</MenuItem>
                <MenuItem value="thisMonth">This Month</MenuItem>
                <MenuItem value="lastMonth">Last Month</MenuItem>
                <MenuItem value="thisYear">This Year</MenuItem>
              </Select>
            </FormControl>
            <Button startIcon={<Refresh />} variant="outlined">
              Refresh
            </Button>
            <Button startIcon={<Download />} variant="contained">
              Export
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <People color="primary" />
                <Box>
                  <Typography variant="h4" color="primary">
                    {stats?.totalUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AttachMoney color="success" />
                <Box>
                  <Typography variant="h4" color="success.main">
                    {formatCurrency(stats?.totalSalary || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Payroll
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Assignment color="warning" />
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {allWorksheets.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp color="info" />
                <Box>
                  <Typography variant="h4" color="info.main">
                    {formatCurrency(stats?.averageSalary || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Salary
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Paper>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Overview" />
          <Tab label="Payments" />
          <Tab label="Productivity" />
          <Tab label="Tasks" />
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Role Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.roleDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Verification Status</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.verificationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.verificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Payments Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Payment Trends (Last 6 Months)</Typography>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={analyticsData.paymentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'amount' ? formatCurrency(value) : value,
                  name === 'amount' ? 'Total Amount' : 'Payment Count'
                ]}
              />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
              <Line yAxisId="right" type="monotone" dataKey="count" stroke="#ff7300" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </TabPanel>

        {/* Productivity Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Top Employee Productivity</Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsData.productivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#8884d8" name="Hours Worked" />
              <Bar dataKey="tasks" fill="#82ca9d" name="Tasks Completed" />
            </BarChart>
          </ResponsiveContainer>
        </TabPanel>

        {/* Tasks Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Task Distribution</Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsData.taskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="task" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#8884d8">
                {analyticsData.taskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AdminAnalytics;
