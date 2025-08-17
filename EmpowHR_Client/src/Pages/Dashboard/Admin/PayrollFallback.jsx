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
  Alert,
  CircularProgress,
  Chip,
  TextField
} from '@mui/material';
import { Payment, CreditCard } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaymentForm = ({ request, onClose, onSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242424242424242');
  const [expiryDate, setExpiryDate] = useState('12/25');
  const [cvc, setCvc] = useState('123');

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Simulate payment processing without external Stripe
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

      // Process the payment on our server
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/process-payment`, {
        requestId: request._id,
        paymentIntentId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        employeeEmail: request.employeeEmail,
        employeeName: request.employeeName,
        amount: request.salary,
        month: request.month,
        year: request.year,
        cardLast4: cardNumber.slice(-4),
        fallbackPayment: true
      });

      toast.success('Payment processed successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
      console.error('Payment error:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box>
      <Typography variant="body1" gutterBottom>
        Processing payment for <strong>{request.employeeName}</strong>
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Amount: <strong>${request.salary}</strong> for {new Date(0, request.month - 1).toLocaleString('en-US', { month: 'long' })} {request.year}
      </Typography>
      
      <Box sx={{ my: 3 }}>
        <Typography variant="h6" gutterBottom>Payment Details</Typography>
        
        <TextField
          fullWidth
          label="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          margin="normal"
          placeholder="4242 4242 4242 4242"
        />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            label="Expiry Date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="MM/YY"
            sx={{ flex: 1 }}
          />
          <TextField
            label="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            placeholder="123"
            sx={{ flex: 1 }}
          />
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        This is a test payment system. Use the default values for successful testing.
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onClose} disabled={processing}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handlePayment}
          disabled={processing}
          startIcon={processing ? <CircularProgress size={20} /> : <CreditCard />}
        >
          {processing ? 'Processing...' : 'Process Payment'}
        </Button>
      </Box>
    </Box>
  );
};

const PayrollFallback = () => {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // Fetch payroll requests
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['payroll-requests'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/payroll-requests`);
      return response.data;
    }
  });

  const handlePayment = (request) => {
    setSelectedRequest(request);
    setPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = () => {
    queryClient.invalidateQueries(['payroll-requests']);
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
          <Payment color="primary" />
          <Box>
            <Typography variant="h6">
              Payroll Management (Test Mode)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Process employee salary payments using test payment system
            </Typography>
          </Box>
        </Box>

        {isLoading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Loading payroll requests...
            </Typography>
          </Box>
        ) : requests.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="info">
              No pending payroll requests. HR needs to submit payment requests for employees.
            </Alert>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Month/Year</TableCell>
                  <TableCell>Requested By</TableCell>
                  <TableCell>Request Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {request.employeeName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {request.employeeEmail}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium" color="primary.main">
                        {formatCurrency(request.salary)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(0, request.month - 1).toLocaleString('en-US', { month: 'long' })} {request.year}
                    </TableCell>
                    <TableCell>{request.requestedBy}</TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.status}
                        color={request.status === 'pending' ? 'warning' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Payment />}
                        onClick={() => handlePayment(request)}
                        disabled={request.status !== 'pending'}
                      >
                        Pay
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Process Salary Payment</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <PaymentForm
              request={selectedRequest}
              onClose={() => setPaymentDialogOpen(false)}
              onSuccess={handlePaymentSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Instructions */}
      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Payment Instructions
        </Typography>
        <Typography variant="body2" component="ul">
          <li>Review pending payment requests from HR</li>
          <li>Click "Pay" to process salary payments using test system</li>
          <li>Use default card details: <strong>4242 4242 4242 4242</strong>, <strong>12/25</strong>, <strong>123</strong></li>
          <li>System prevents duplicate payments for the same month/year</li>
          <li>All transactions are logged with unique transaction IDs</li>
          <li>This is a test system - no real money is processed</li>
        </Typography>
      </Paper>
    </Box>
  );
};

export default PayrollFallback;
