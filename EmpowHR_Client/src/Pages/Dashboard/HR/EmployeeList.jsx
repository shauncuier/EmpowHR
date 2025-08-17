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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  CircularProgress
} from '@mui/material';
import { People, Payment, CheckCircle, Cancel, Visibility } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaymentRequestDialog = ({ employee, open, onClose }) => {
  const { userDetails } = useAuth();
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    }
  });

  const createPaymentRequestMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/payroll-requests`, {
        employeeId: employee._id,
        employeeEmail: employee.email,
        employeeName: employee.name,
        salary: employee.salary,
        month: data.month,
        year: data.year,
        requestedBy: userDetails?.name || 'HR'
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Payment request created successfully!');
      queryClient.invalidateQueries(['employees']);
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create payment request');
    }
  });

  const onSubmit = (data) => {
    createPaymentRequestMutation.mutate(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Payment Request</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Typography variant="body1" gutterBottom>
            Employee: <strong>{employee?.name}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Salary: <strong>${employee?.salary}</strong>
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <Controller
              name="month"
              control={control}
              rules={{ required: 'Month is required', min: 1, max: 12 }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Month"
                  type="number"
                  margin="normal"
                  inputProps={{ min: 1, max: 12 }}
                  error={!!errors.month}
                  helperText={errors.month?.message}
                />
              )}
            />

            <Controller
              name="year"
              control={control}
              rules={{ required: 'Year is required', min: 2020, max: 2030 }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Year"
                  type="number"
                  margin="normal"
                  inputProps={{ min: 2020, max: 2030 }}
                  error={!!errors.year}
                  helperText={errors.year?.message}
                />
              )}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={createPaymentRequestMutation.isPending}
          startIcon={createPaymentRequestMutation.isPending ? <CircularProgress size={20} /> : <Payment />}
        >
          {createPaymentRequestMutation.isPending ? 'Creating...' : 'Create Request'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EmployeeList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // Fetch employees
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/employees`);
      return response.data;
    }
  });

  // Toggle verification mutation
  const toggleVerificationMutation = useMutation({
    mutationFn: async ({ id, isVerified }) => {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${id}/verify`, {
        isVerified: !isVerified
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
      toast.success('Employee verification status updated!');
    },
    onError: () => {
      toast.error('Failed to update verification status');
    }
  });

  const handleVerificationToggle = (employee) => {
    toggleVerificationMutation.mutate({
      id: employee._id,
      isVerified: employee.isVerified
    });
  };

  const handlePaymentRequest = (employee) => {
    setSelectedEmployee(employee);
    setPaymentDialogOpen(true);
  };

  const handleViewDetails = (employee) => {
    navigate(`/dashboard/employee-details/${encodeURIComponent(employee.email)}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Box>
      <Paper>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <People color="primary" />
          <Box>
            <Typography variant="h6">
              Employee Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage employee verification and create payment requests
            </Typography>
          </Box>
        </Box>

        {isLoading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Loading employees...
            </Typography>
          </Box>
        ) : employees.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="info">
              No employees found. Employees will appear here once they register.
            </Alert>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Verified</TableCell>
                  <TableCell>Bank Account</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Pay</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {employee.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {employee.designation}
                      </Typography>
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => handleVerificationToggle(employee)}
                        disabled={toggleVerificationMutation.isPending}
                        color={employee.isVerified ? 'success' : 'error'}
                      >
                        {employee.isVerified ? <CheckCircle /> : <Cancel />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {employee.bank_account_no || 'Not provided'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium" color="primary.main">
                        {formatCurrency(employee.salary)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Payment />}
                        onClick={() => handlePaymentRequest(employee)}
                        disabled={!employee.isVerified}
                      >
                        Pay
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewDetails(employee)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Payment Request Dialog */}
      <PaymentRequestDialog
        employee={selectedEmployee}
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
      />

      {/* Instructions */}
      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Employee Management Instructions
        </Typography>
        <Typography variant="body2" component="ul">
          <li>Click the verification icon to toggle employee verification status</li>
          <li>Only verified employees can receive salary payments</li>
          <li>Click "Pay" to create a payment request for Admin approval</li>
          <li>Payment requests are sent to Admin for processing via Stripe</li>
        </Typography>
      </Paper>
    </Box>
  );
};

export default EmployeeList;
