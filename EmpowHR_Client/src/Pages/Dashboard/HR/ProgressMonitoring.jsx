import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  CircularProgress,
  Button,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  TrendingDown,
  AccessTime,
  Assignment,
  Person,
  CalendarToday,
  BarChart,
  PieChart,
  Timeline,
  Refresh,
  FileDownload
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const ProgressMonitoring = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [tabValue, setTabValue] = useState(0);

  // Fetch all employees for progress monitoring
  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/employees`);
      return response.data;
    }
  });

  // Fetch all worksheets for analytics
  const { data: allWorksheets = [], isLoading: worksheetsLoading } = useQuery({
    queryKey: ['all-worksheets'],
    queryFn: async () => {
      const worksheets = [];
      for (const employee of employees) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/worksheets/${employee.email}`);
          worksheets.push(...response.data.map(w => ({ ...w, employeeName: employee.name, employeeRole: employee.role })));
        } catch (error) {
          console.warn(`Could not fetch worksheets for ${employee.email}`);
        }
      }
      return worksheets;
    },
    enabled: employees.length > 0
  });

  // Calculate analytics data
  const analyticsData = React.useMemo(() => {
    if (!allWorksheets.length) return null;

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const filteredWorksheets = allWorksheets.filter(w => {
      const workDate = new Date(w.date);
      switch (selectedPeriod) {
        case 'thisWeek': return workDate >= thisWeek;
        case 'thisMonth': return workDate >= thisMonth;
        case 'lastMonth': return workDate >= lastMonth && workDate < thisMonth;
        default: return true;
      }
    });

    // Task distribution
    const taskDistribution = filteredWorksheets.reduce((acc, w) => {
      acc[w.task] = (acc[w.task] || 0) + w.hours;
      return acc;
    }, {});

    const taskData = Object.entries(taskDistribution).map(([task, hours]) => ({
      task,
      hours,
      percentage: ((hours / filteredWorksheets.reduce((sum, w) => sum + w.hours, 0)) * 100).toFixed(1)
    }));

    // Employee productivity
    const employeeProductivity = filteredWorksheets.reduce((acc, w) => {
      if (!acc[w.email]) {
        acc[w.email] = {
          name: w.employeeName,
          email: w.email,
          totalHours: 0,
          taskCount: 0,
          tasks: {}
        };
      }
      acc[w.email].totalHours += w.hours;
      acc[w.email].taskCount += 1;
      acc[w.email].tasks[w.task] = (acc[w.email].tasks[w.task] || 0) + w.hours;
      return acc;
    }, {});

    const productivityData = Object.values(employeeProductivity).map(emp => ({
      ...emp,
      avgHoursPerTask: emp.taskCount > 0 ? (emp.totalHours / emp.taskCount).toFixed(1) : 0,
      productivity: emp.totalHours > 0 ? Math.min(100, (emp.totalHours / 40) * 100) : 0 // Assuming 40 hours is 100%
    })).sort((a, b) => b.totalHours - a.totalHours);

    // Daily progress (last 7 days)
    const dailyProgress = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayWorksheets = allWorksheets.filter(w => {
        const workDate = new Date(w.date);
        return workDate.toDateString() === date.toDateString();
      });
      
      dailyProgress.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        hours: dayWorksheets.reduce((sum, w) => sum + w.hours, 0),
        tasks: dayWorksheets.length
      });
    }

    // Summary statistics
    const totalHours = filteredWorksheets.reduce((sum, w) => sum + w.hours, 0);
    const totalTasks = filteredWorksheets.length;
    const activeEmployees = new Set(filteredWorksheets.map(w => w.email)).size;
    const avgHoursPerEmployee = activeEmployees > 0 ? (totalHours / activeEmployees).toFixed(1) : 0;

    return {
      taskData,
      productivityData,
      dailyProgress,
      summary: {
        totalHours,
        totalTasks,
        activeEmployees,
        avgHoursPerEmployee
      }
    };
  }, [allWorksheets, selectedPeriod]);

  const isLoading = employeesLoading || worksheetsLoading;

  const getProductivityColor = (productivity) => {
    if (productivity >= 80) return 'success';
    if (productivity >= 60) return 'warning';
    return 'error';
  };

  const getProductivityIcon = (current, previous) => {
    if (current > previous) return <TrendingUp color="success" />;
    if (current < previous) return <TrendingDown color="error" />;
    return <AccessTime color="info" />;
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Analytics color="primary" />
            <Box>
              <Typography variant="h6">Progress Monitoring</Typography>
              <Typography variant="body2" color="text.secondary">
                Track employee productivity and work progress
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
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>
            <IconButton>
              <Refresh />
            </IconButton>
            <Button startIcon={<FileDownload />} variant="outlined">
              Export
            </Button>
          </Box>
        </Box>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading progress data...</Typography>
        </Box>
      ) : !analyticsData ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>No Data Available</Typography>
          <Typography variant="body2" color="text.secondary">
            No work entries found for the selected period.
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AccessTime color="primary" />
                    <Box>
                      <Typography variant="h4" color="primary">
                        {analyticsData.summary.totalHours}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Hours
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
                    <Assignment color="success" />
                    <Box>
                      <Typography variant="h4" color="success.main">
                        {analyticsData.summary.totalTasks}
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
                    <Person color="warning" />
                    <Box>
                      <Typography variant="h4" color="warning.main">
                        {analyticsData.summary.activeEmployees}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Employees
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
                    <BarChart color="info" />
                    <Box>
                      <Typography variant="h4" color="info.main">
                        {analyticsData.summary.avgHoursPerEmployee}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg Hours/Employee
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabs for different views */}
          <Paper>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab icon={<BarChart />} label="Overview" />
              <Tab icon={<Person />} label="Employee Performance" />
              <Tab icon={<PieChart />} label="Task Distribution" />
              <Tab icon={<Timeline />} label="Daily Progress" />
            </Tabs>

            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                  <Typography variant="h6" gutterBottom>Daily Activity</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData.dailyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="hours" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="tasks" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <Typography variant="h6" gutterBottom>Top Performers</Typography>
                  <List>
                    {analyticsData.productivityData.slice(0, 5).map((emp, index) => (
                      <ListItem key={emp.email}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                            {emp.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={emp.name}
                          secondary={`${emp.totalHours}h • ${emp.taskCount} tasks`}
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={`${emp.productivity.toFixed(0)}%`}
                            color={getProductivityColor(emp.productivity)}
                            size="small"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Employee Performance Tab */}
            <TabPanel value={tabValue} index={1}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell align="right">Total Hours</TableCell>
                      <TableCell align="right">Tasks Completed</TableCell>
                      <TableCell align="right">Avg Hours/Task</TableCell>
                      <TableCell align="right">Productivity</TableCell>
                      <TableCell align="right">Progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.productivityData.map((emp) => (
                      <TableRow key={emp.email}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {emp.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {emp.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {emp.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            {emp.totalHours}h
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{emp.taskCount}</TableCell>
                        <TableCell align="right">{emp.avgHoursPerTask}h</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${emp.productivity.toFixed(0)}%`}
                            color={getProductivityColor(emp.productivity)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ width: 120 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={emp.productivity}
                              color={getProductivityColor(emp.productivity)}
                              sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="caption">
                              {emp.productivity.toFixed(0)}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Task Distribution Tab */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Task Hours Distribution</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={analyticsData.taskData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ task, percentage }) => `${task}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="hours"
                      >
                        {analyticsData.taskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Task Breakdown</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={analyticsData.taskData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="task" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="hours" fill="#8884d8">
                        {analyticsData.taskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Daily Progress Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>7-Day Activity Trend</Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.dailyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="hours" fill="#8884d8" name="Hours Worked" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="tasks"
                    stroke="#ff7300"
                    strokeWidth={2}
                    name="Tasks Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabPanel>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default ProgressMonitoring;
