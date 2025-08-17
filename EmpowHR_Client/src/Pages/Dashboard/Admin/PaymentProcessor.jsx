import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Payment, 
  CreditCard, 
  Security,
  CheckCircle,
  Receipt
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaymentProcessor = ({ request, onClose, onSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Payment Form, 2: Processing, 3: Success
  const [paymentData, setPaymentData] = useState({
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '12/28',
    cvc: '123',
    cardholderName: 'Admin User'
  });
  const [transactionResult, setTransactionResult] = useState(null);
  const [paymentAttempted, setPaymentAttempted] = useState(false);

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
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

  const generateTransactionId = () => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `TXN_${timestamp}_${randomString}`;
  };

  const handlePayment = async () => {
    // Prevent multiple payment attempts
    if (processing || paymentAttempted) {
      console.log('Payment already in progress or attempted');
      return;
    }

    setProcessing(true);
    setPaymentAttempted(true);
    setStep(2);

    try {
      console.log('Starting payment processing for:', {
        employee: request.employeeName,
        amount: request.salary,
        month: request.month,
        year: request.year
      });

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      const transactionId = generateTransactionId();

      // Process the payment on our server
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/process-payment`, {
        requestId: request._id,
        employeeEmail: request.employeeEmail,
        employeeName: request.employeeName,
        amount: request.salary,
        month: request.month,
        year: request.year,
        cardLast4: paymentData.cardNumber.slice(-4).replace(/\s/g, ''),
        transactionId,
        paymentMethod: 'credit_card',
        cardholderName: paymentData.cardholderName
      });

      console.log('Payment processed successfully:', response.data);

      setTransactionResult({
        transactionId: response.data.transactionId || transactionId,
        amount: request.salary,
        employeeName: request.employeeName,
        month: request.month,
        year: request.year,
        processedAt: new Date(),
        cardLast4: paymentData.cardNumber.slice(-4).replace(/\s/g, ''),
        cardholderName: paymentData.cardholderName
      });

      setStep(3);
      toast.success('Payment processed successfully!');
      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      setStep(1);
      setPaymentAttempted(false); // Allow retry on error
      
      if (error.response?.status === 409) {
        const existingPayment = error.response?.data?.existingPayment;
        if (existingPayment) {
          toast.error(
            `Duplicate payment blocked! Payment already exists (Transaction ID: ${existingPayment.transactionId})`,
            { duration: 8000 }
          );
        } else {
          toast.error(error.response?.data?.message || 'Payment already exists for this month');
        }
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || 'Invalid payment data');
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        toast.error('Payment request timed out. Please try again.');
      } else {
        toast.error(error.response?.data?.message || 'Payment processing failed. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentForm = () => (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Payment Summary */}
        <Card variant="outlined" sx={{ bgcolor: 'primary.50', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Receipt color="primary" />
              Payment Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Employee</Typography>
                <Typography variant="h6" fontWeight="medium">{request.employeeName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Amount</Typography>
                <Typography variant="h5" color="primary.main" fontWeight="bold">
                  ${request.salary.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Period</Typography>
                <Typography variant="body1" fontWeight="medium">
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
            Payment Information
          </Typography>
          
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    value={paymentData.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
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

        {/* Security Notice */}
        <Alert severity="info" icon={<Security />} sx={{ borderRadius: 2 }}>
          <Typography variant="body2">
            <strong>Secure Demo Payment System</strong><br />
            This is a demonstration payment processor with full transaction logging.
            Use the pre-filled test card details or modify as needed. No real charges will be made.
          </Typography>
        </Alert>
      </Stack>
    </Box>
  );

  const renderProcessing = () => (
    <Box sx={{ textAlign: 'center', py: 6, px: 3 }}>
      <CircularProgress size={80} sx={{ mb: 4, color: 'primary.main' }} />
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Processing Payment...
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Please wait while we securely process your payment transaction.
      </Typography>
      <Card variant="outlined" sx={{ maxWidth: 400, mx: 'auto', borderRadius: 2 }}>
        <CardContent>
          <Typography variant="body1" gutterBottom>
            <strong>Amount:</strong> ${request.salary.toLocaleString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Employee:</strong> {request.employeeName}
          </Typography>
          <Typography variant="body1">
            <strong>Period:</strong> {new Date(0, request.month - 1).toLocaleString('en-US', { month: 'long' })} {request.year}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );

  const renderSuccess = () => (
    <Box sx={{ textAlign: 'center', py: 4, px: 3 }}>
      <CheckCircle color="success" sx={{ fontSize: 100, mb: 3 }} />
      <Typography variant="h4" gutterBottom color="success.main" fontWeight="bold">
        Payment Successful!
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        The salary payment has been processed successfully.
      </Typography>
      
      <Card variant="outlined" sx={{ mt: 3, textAlign: 'left', borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Receipt color="primary" />
            Transaction Receipt
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Transaction ID</Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
                {transactionResult?.transactionId}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Amount Paid</Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                ${transactionResult?.amount?.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Employee Name</Typography>
              <Typography variant="body1" fontWeight="medium">{transactionResult?.employeeName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Payment Period</Typography>
              <Typography variant="body1" fontWeight="medium">
                {new Date(0, transactionResult?.month - 1).toLocaleString('en-US', { month: 'long' })} {transactionResult?.year}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Payment Method</Typography>
              <Typography variant="body1" fontWeight="medium">
                Credit Card (**** {transactionResult?.cardLast4})
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Processed At</Typography>
              <Typography variant="body1" fontWeight="medium">
                {transactionResult?.processedAt?.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Cardholder Name</Typography>
              <Typography variant="body1" fontWeight="medium">{transactionResult?.cardholderName}</Typography>
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
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={onClose} 
            disabled={processing}
            size="large"
            sx={{ textTransform: 'none' }}
          >
            {step === 3 ? 'Close' : 'Cancel'}
          </Button>
          {step === 1 && (
            <Button
              variant="contained"
              onClick={handlePayment}
              disabled={processing}
              startIcon={<Payment />}
              size="large"
              sx={{ 
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: 2,
                px: 4
              }}
            >
              Process Payment
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PaymentProcessor;
