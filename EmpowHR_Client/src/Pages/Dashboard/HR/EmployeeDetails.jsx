import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack, Person, Email, AccountBalance, AttachMoney } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const EmployeeDetails = () => {
  const { email } = useParams();
  const navigate = useNavigate();

  // Fetch employee details
  const { data: employee, isLoading: employeeLoading } = useQuery({
    queryKey: ['employee-details', email],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${email}`);
      return response.data;
    },
    enabled: !!email
  });

  // Fetch employee payment history for chart
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['employee-payments', email],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/payments/${email}`);
      return response.data;
    },
    enabled: !!email
  });

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!payments.length) return [];
    
    return payments.map(payment => ({
      period: `${new Date(0, payment.month - 1).toLocaleString('en-US', { month: 'short' })} ${payment.year}`,
      salary: payment.amount,
      month: payment.month,
      year: payment.year
    })).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }, [payments]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (employeeLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading employee details...</Typography>
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Employee not found</Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Back to Employee List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/dashboard')}
          variant="outlined"
        >
          Back
        </Button>
        <Typography variant="h5">Employee Details</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Employee Information Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                src={employee.photo}
                alt={employee.name}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              >
                {employee.name?.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {employee.name}
              </Typography>
              <Chip 
                label={employee.designation} 
                color="primary" 
                variant="outlined"
                sx={{ mb: 1 }}
              />
              <Chip 
                label={employee.isVerified ? 'Verified' : 'Not Verified'} 
                color={employee.isVerified ? 'success' : 'error'}
                size="small"
              />
            </Box>

            <Box sx={{ space: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {employee.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Current Salary
                  </Typography>
                  <Typography variant="h6" color="primary.main">
                    {formatCurrency(employee.salary)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Bank Account
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {employee.bank_account_no || 'Not provided'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person color="action" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {employee.role}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Payment History Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Salary vs Month and Year
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Payment history showing salary amounts by month and year
            </Typography>

            {paymentsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <CircularProgress />
              </Box>
            ) : chartData.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No payment history available for this employee
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="period" 
                    label={{ value: 'Month & Year', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'Salary ($)', angle: -90, position: 'insideLeft' }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Salary']}
                    labelStyle={{ color: '#000' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="salary" 
                    fill="#1976d2" 
                    name="Salary Amount"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>

          {/* Summary Statistics */}
          {chartData.length > 0 && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">
                      {chartData.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Payments
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {formatCurrency(chartData.reduce((sum, payment) => sum + payment.salary, 0))}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Earned
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {formatCurrency(chartData.reduce((sum, payment) => sum + payment.salary, 0) / chartData.length)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Payment
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDetails;
