import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Avatar,
  IconButton,
  Button,
  LinearProgress,
  Divider,
  Alert
} from '@mui/material';
import {
  Dashboard,
  People,
  AttachMoney,
  Assignment,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Schedule,
  Notifications,
  PersonAdd,
  Payment,
  Analytics,
  Work
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const AdminOverview = () => {
  // Fetch users data directly from /api/users endpoint
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      return response.data;
    },
    refetchOnWindowFocus: false
  });

  // Fetch recent payroll requests
  const { data: payrollRequests = [], isLoading: payrollLoading } = useQuery({
    queryKey: ['payroll-requests'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/payroll-requests`);
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

  const statsLoading = usersLoading;

  // Mock activities based on available data
  const activities = React.useMemo(() => {
    const mockActivities = [];
    
    // Recent user registrations
    if (users && users.length > 0) {
      const recentUsers = users
        .filter(user => user.createdAt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      recentUsers.forEach((user, index) => {
        mockActivities.push({
          id: `user_${user._id || index}`,
          type: 'user_registered',
          message: `New ${user.role} ${user.name} registered`,
          time: user.createdAt,
          icon: 'PersonAdd',
          color: 'success'
        });
      });
    }

    // Recent payroll requests
    if (payrollRequests && payrollRequests.length > 0) {
      const recentRequests = payrollRequests
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      recentRequests.forEach((request, index) => {
        mockActivities.push({
          id: `request_${request._id || index}`,
          type: 'payroll_request',
          message: `Payroll request for ${request.employeeName} by ${request.requestedBy}`,
          time: request.createdAt,
          icon: 'AttachMoney',
          color: 'warning'
        });
      });
    }

    // Sort all activities by time
    return mockActivities.sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [users, payrollRequests]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMinutes = Math.floor((now - past) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const getIconByType = (iconName, color) => {
    const iconProps = { color };
    switch (iconName) {
      case 'PersonAdd': return <PersonAdd {...iconProps} />;
      case 'Payment': return <Payment {...iconProps} />;
      case 'Assignment': return <Assignment {...iconProps} />;
      case 'AttachMoney': return <AttachMoney {...iconProps} />;
      default: return <CheckCircle {...iconProps} />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Admin Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome to the admin dashboard. Here's an overview of your system with real-time data.
        </Typography>
        {/* Statistics loaded message disabled for production */}
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="primary">
                    {statsLoading ? '...' : stats?.totalUsers || 0}
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
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <Work />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="success.main">
                    {statsLoading ? '...' : stats?.employees || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Employees
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
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {statsLoading ? '...' : stats?.verified || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verified Users
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
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h4" color="info.main">
                    {statsLoading ? '...' : formatCurrency(stats?.totalSalary || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Payroll
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Statistics Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="primary">
                {statsLoading ? '...' : stats?.totalPayments || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Payments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="success.main">
                {statsLoading ? '...' : formatCurrency(stats?.totalPaid || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Paid Out
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="info.main">
                {statsLoading ? '...' : stats?.totalWorksheets || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Work Entries
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="warning.main">
                {statsLoading ? '...' : Math.round(stats?.totalHours || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Hours Logged
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* System Health */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Health
            </Typography>
            {stats ? (
              <>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Employee Verification Rate</Typography>
                    <Typography variant="body2">
                      {stats.totalUsers > 0 ? `${((stats.verified / stats.totalUsers) * 100).toFixed(1)}%` : '0%'}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.totalUsers > 0 ? (stats.verified / stats.totalUsers) * 100 : 0} 
                    color="success"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">HR Personnel Ratio</Typography>
                    <Typography variant="body2">
                      {stats.totalUsers > 0 ? `${((stats.hrPersonnel / stats.totalUsers) * 100).toFixed(1)}%` : '0%'}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.totalUsers > 0 ? (stats.hrPersonnel / stats.totalUsers) * 100 : 0} 
                    color="warning"
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Active Employment Rate</Typography>
                    <Typography variant="body2">
                      {stats.totalUsers > 0 ? `${(((stats.totalUsers - (stats.fired || 0)) / stats.totalUsers) * 100).toFixed(1)}%` : '100%'}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.totalUsers > 0 ? ((stats.totalUsers - (stats.fired || 0)) / stats.totalUsers) * 100 : 100} 
                    color="primary"
                  />
                </Box>
              </>
            ) : (
              <Alert severity="info">Loading system health data...</Alert>
            )}
          </Paper>
        </Grid>

        {/* Pending Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pending Actions
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Schedule color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Payroll Requests"
                  secondary={`${payrollRequests.length} requests pending approval`}
                />
                <ListItemSecondaryAction>
                  <Chip 
                    label={payrollRequests.length} 
                    color={payrollRequests.length > 0 ? 'warning' : 'default'}
                    size="small"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <People color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="Unverified Employees"
                  secondary={`${stats ? stats.totalUsers - stats.verified : 0} employees need verification`}
                />
                <ListItemSecondaryAction>
                  <Chip 
                    label={stats ? stats.totalUsers - stats.verified : 0} 
                    color={(stats?.totalUsers - stats?.verified) > 0 ? 'error' : 'default'}
                    size="small"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Analytics color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Average Productivity"
                  secondary={`${stats?.averageHours ? Math.round(stats.averageHours) : 0} hours per entry`}
                />
                <ListItemSecondaryAction>
                  <Chip label="Active" color="success" size="small" />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent System Activities
            </Typography>
            {statsLoading ? (
              <Alert severity="info">Loading recent activities...</Alert>
            ) : activities.length === 0 ? (
              <Alert severity="info">No recent activities found. Start using the system to see activities here.</Alert>
            ) : (
              <List>
                {activities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>
                        {getIconByType(activity.icon, activity.color)}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.message}
                        secondary={getTimeAgo(activity.time)}
                      />
                    </ListItem>
                    {index < activities.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button variant="outlined" size="small">
                View All Activities
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  startIcon={<PersonAdd />}
                  fullWidth
                  onClick={() => window.open('/register', '_blank')}
                >
                  Add Employee
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  color="success"
                  startIcon={<Payment />}
                  fullWidth
                  disabled={payrollRequests.length === 0}
                >
                  Process Payroll ({payrollRequests.length})
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  color="warning"
                  startIcon={<Analytics />}
                  fullWidth
                >
                  View Reports
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  color="info"
                  startIcon={<Notifications />}
                  fullWidth
                >
                  System Status
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminOverview;
