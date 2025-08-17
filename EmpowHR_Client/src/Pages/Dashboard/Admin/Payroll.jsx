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
  TextField,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
  IconButton
} from '@mui/material';
import { 
  Payment, 
  CreditCard, 
  AccountBalanceWallet,
  Close,
  CheckCircle,
  Security,
  Receipt
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import StripeCheckoutPayment from './StripeCheckoutPayment';

// Enhanced Payment Form Component
const PaymentForm = ({ request, onClose, onSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Payment Form, 2: Processing, 3: Success
  const [paymentData, setPaymentData] = useState({
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '12/28',
    cvc: '123',
    cardholderName: 'Admin User'
  });
  const [transactionResult, setTransactionResult] = useState(null);

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handlePayment = async () => {
    setProcessing(true);
    setStep(2);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate transaction ID
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Process the payment on our server
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/process-payment`, {
        requestId: request._id,
        paymentIntentId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        employeeEmail: request.employeeEmail,
        employeeName: request.employeeName,
        amount: request.salary,
        month: request.month,
        year: request.year,
        cardLast4: paymentData.cardNumber.slice(-4).replace(/\s/g, ''),
        fallbackPayment: true,
        transactionId
      });

      setTransactionResult({
        transactionId: response.data.transactionId,
        amount: request.salary,
        employeeName: request.employeeName,
        month: request.month,
        year: request.year,
        processedAt: new Date(),
        cardLast4: paymentData.cardNumber.slice(-4).replace(/\s/g, '')
      });

      setStep(3);
      toast.success('Payment processed successfully!');
      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      setStep(1);
      
      // Handle duplicate payment specifically
      if (error.response?.status === 409) {
        const existingPayment = error.response?.data?.existingPayment;
        if (existingPayment) {
          toast.error(
            `Duplicate payment blocked! Payment already exists (ID: ${existingPayment.transactionId})`,
            { duration: 6000 }
          );
        } else {
          toast.error(error.response?.data?.message || 'Payment already exists for this month');
        }
      } else {
        toast.error(error.response?.data?.message || 'Payment failed');
      }
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentForm = () => (
    <Box>
      <Stack spacing={3}>
        {/* Payment Summary */}
        <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Employee</Typography>
                <Typography variant="body1" fontWeight="medium">{request.employeeName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Amount</Typography>
                <Typography variant="h6" color="primary.main">${request.salary}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Period</Typography>
                <Typography variant="body1">
                  {new Date(0, request.month - 1).toLocaleString('en-US', { month: 'long' })} {request.year}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{request.employeeEmail}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Divider />

        {/* Payment Method */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security color="primary" />
            Payment Method
          </Typography>
          
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    value={paymentData.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    value={paymentData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                    variant="outlined"
                    InputProps={{
                      endAdornment: <CreditCard color="action" />
                    }}
                    inputProps={{ maxLength: 19 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                    variant="outlined"
                    inputProps={{ maxLength: 5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVC"
                    value={paymentData.cvc}
                    onChange={(e) => handleInputChange('cvc', e.target.value.replace(/\D/g, ''))}
                    variant="outlined"
                    inputProps={{ maxLength: 3 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Test Card Info */}
        <Alert severity="info" icon={<Security />}>
          <Typography variant="body2">
            <strong>Test Payment System</strong><br />
            This is a demo payment processor. Use the pre-filled test card details or modify as needed.
            All payments are simulated and no real money will be charged.
          </Typography>
        </Alert>
      </Stack>
    </Box>
  );

  const renderProcessing = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CircularProgress size={60} sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>
        Processing Payment...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait while we process your payment securely.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          Amount: <strong>${request.salary}</strong>
        </Typography>
        <Typography variant="body2">
          Employee: <strong>{request.employeeName}</strong>
        </Typography>
      </Box>
    </Box>
  );

  const renderSuccess = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CheckCircle color="success" sx={{ fontSize: 80, mb: 3 }} />
      <Typography variant="h5" gutterBottom color="success.main">
        Payment Successful!
      </Typography>
      
      <Card variant="outlined" sx={{ mt: 3, textAlign: 'left' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Receipt color="primary" />
            Transaction Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Transaction ID</Typography>
              <Typography variant="body1" fontWeight="medium" sx={{ fontFamily: 'monospace' }}>
                {transactionResult?.transactionId}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Amount</Typography>
              <Typography variant="body1" fontWeight="medium" color="success.main">
                ${transactionResult?.amount}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Employee</Typography>
              <Typography variant="body1">{transactionResult?.employeeName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Period</Typography>
              <Typography variant="body1">
                {new Date(0, transactionResult?.month - 1).toLocaleString('en-US', { month: 'long' })} {transactionResult?.year}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Card Used</Typography>
              <Typography variant="body1">
                **** **** **** {transactionResult?.cardLast4}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Processed At</Typography>
              <Typography variant="body1">
                {transactionResult?.processedAt?.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box>
      {step === 1 && renderPaymentForm()}
      {step === 2 && renderProcessing()}
      {step === 3 && renderSuccess()}

      {step !== 2 && (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <Button onClick={onClose} disabled={processing}>
            {step === 3 ? 'Close' : 'Cancel'}
          </Button>
          {step === 1 && (
            <Button
              variant="contained"
              onClick={handlePayment}
              disabled={processing}
              startIcon={<Payment />}
              size="large"
            >
              Process Payment
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

const Payroll = () => {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // Fetch payroll requests (both pending and completed for better visibility)
  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ['payroll-requests'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/payroll-requests`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 0 // Always fetch fresh data
  });

  const handlePayment = (request) => {
    setSelectedRequest(request);
    setPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = () => {
    queryClient.invalidateQueries(['payroll-requests']);
  };

  const handleCloseDialog = () => {
    setPaymentDialogOpen(false);
    setSelectedRequest(null);
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
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccountBalanceWallet color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h5" gutterBottom>
              Payroll Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Process employee salary payments with secure transaction processing
            </Typography>
          </Box>
        </Box>

        {isLoading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={50} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading payroll requests...
            </Typography>
          </Box>
        ) : requests.length === 0 ? (
          <Box sx={{ p: 4 }}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                No Pending Payroll Requests
              </Typography>
              <Typography variant="body2">
                HR personnel need to submit payment requests for employees before you can process payments.
              </Typography>
            </Alert>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Salary</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Month/Year</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Requested By</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Request Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {request.employeeName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {request.employeeEmail}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {formatCurrency(request.salary)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {new Date(0, request.month - 1).toLocaleString('en-US', { month: 'long' })} {request.year}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{request.requestedBy}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.status.toUpperCase()}
                        color={request.status === 'pending' ? 'warning' : 'success'}
                        variant="filled"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="medium"
                        startIcon={<Payment />}
                        onClick={() => handlePayment(request)}
                        disabled={request.status !== 'pending'}
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 'bold'
                        }}
                      >
                        Process Payment
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Enhanced Payment Dialog */}
      <Dialog 
        open={paymentDialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Security color="primary" sx={{ fontSize: 30 }} />
              <Typography variant="h5" fontWeight="bold">
                Secure Payment Processing
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDialog} size="large">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedRequest && (
            <StripeCheckoutPayment
              request={selectedRequest}
              onClose={handleCloseDialog}
              onSuccess={handlePaymentSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Instructions */}
      <Paper sx={{ mt: 4, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Receipt color="primary" />
          Payment System Features
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ h: '100%', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🔒 Secure Processing
                </Typography>
                <Typography variant="body2">
                  • End-to-end encryption for all transactions<br />
                  • Secure card data handling<br />
                  • PCI compliant payment processing<br />
                  • Real-time fraud detection
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ h: '100%', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🎯 Smart Features
                </Typography>
                <Typography variant="body2">
                  • Duplicate payment prevention<br />
                  • Unique transaction ID generation<br />
                  • Comprehensive payment history<br />
                  • Real-time status updates
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ h: '100%', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  📊 Transaction Tracking
                </Typography>
                <Typography variant="body2">
                  • Complete audit trails<br />
                  • Detailed transaction reports<br />
                  • Employee payment history<br />
                  • Financial analytics integration
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Payroll;
