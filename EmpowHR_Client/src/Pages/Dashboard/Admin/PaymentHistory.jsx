import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Avatar,
  TablePagination,
  TextField
} from '@mui/material';
import {
  Payment,
  Download,
  FilterList,
  Search,
  AttachMoney,
  Receipt,
  TrendingUp
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const PaymentHistory = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  // Fetch all employees
  const { data: employees = [] } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      return response.data;
    }
  });

  // Fetch all payments
  const { data: allPayments = [], isLoading } = useQuery({
    queryKey: ['all-payments'],
    queryFn: async () => {
      const payments = [];
      for (const employee of employees) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/payments/${employee.email}`);
          payments.push(...response.data.map(p => ({ 
            ...p, 
            employeeDetails: employee
          })));
        } catch (error) {
          console.warn(`Could not fetch payments for ${employee.email}`);
        }
      }
      return payments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
    },
    enabled: employees.length > 0
  });

  // Filter payments
  const filteredPayments = allPayments.filter(payment => {
    if (selectedEmployee !== 'all' && payment.employeeEmail !== selectedEmployee) return false;
    if (selectedMonth !== 'all' && payment.month !== parseInt(selectedMonth)) return false;
    if (selectedYear !== 'all' && payment.year !== parseInt(selectedYear)) return false;
    return true;
  });

  // Paginated payments
  const paginatedPayments = filteredPayments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  // Statistics
  const stats = {
    totalPayments: filteredPayments.length,
    totalAmount: filteredPayments.reduce((sum, p) => sum + p.amount, 0),
    avgPayment: filteredPayments.length > 0 ? 
      filteredPayments.reduce((sum, p) => sum + p.amount, 0) / filteredPayments.length : 0,
    uniqueEmployees: new Set(filteredPayments.map(p => p.employeeEmail)).size
  };

  // Generate year options (current year and 2 years back)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 3 }, (_, i) => currentYear - i);

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Payment color="primary" />
            <Box>
              <Typography variant="h6">Payment History</Typography>
              <Typography variant="body2" color="text.secondary">
                Complete payment records and transaction history
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button startIcon={<Download />} variant="outlined">
              Export
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Receipt color="primary" />
                <Box>
                  <Typography variant="h4" color="primary">
                    {stats.totalPayments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Payments
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
                    {formatCurrency(stats.totalAmount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
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
                <TrendingUp color="warning" />
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {formatCurrency(stats.avgPayment)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Payment
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
                <Payment color="info" />
                <Box>
                  <Typography variant="h4" color="info.main">
                    {stats.uniqueEmployees}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Paid Employees
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Employee</InputLabel>
              <Select
                value={selectedEmployee}
                label="Employee"
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <MenuItem value="all">All Employees</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp.email} value={emp.email}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <MenuItem value="all">All Months</MenuItem>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <MenuItem key={month} value={month.toString()}>
                    {getMonthName(month)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <MenuItem value="all">All Years</MenuItem>
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year.toString()}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSelectedEmployee('all');
                setSelectedMonth('all');
                setSelectedYear('all');
                setPage(0);
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Payments Table */}
      <Paper>
        {isLoading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Loading payment history...
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Payment Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPayments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={payment.employeeDetails?.photo} sx={{ width: 32, height: 32 }}>
                            {payment.employeeName?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {payment.employeeName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {payment.employeeEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium" color="success.main">
                          {formatCurrency(payment.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {getMonthName(payment.month)} {payment.year}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {payment.transactionId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(payment.paymentDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={payment.status.toUpperCase()} 
                          color="success" 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredPayments.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default PaymentHistory;
