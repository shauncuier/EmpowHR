import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { 
  CheckCircle,
  Receipt,
  Home,
  Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [transactionResult, setTransactionResult] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const successParam = searchParams.get('success');

    console.log('Payment success page loaded with params:', { sessionId, successParam });

    if (successParam === 'true' && sessionId) {
      confirmPayment(sessionId);
    } else {
      setError('Invalid payment session');
      setLoading(false);
    }
  }, [searchParams]);

  const confirmPayment = async (sessionId) => {
    try {
      console.log('Confirming payment with session ID:', sessionId);
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/confirm-stripe-payment`, {
        sessionId
      });

      if (response.data.success) {
        const paymentData = response.data.payment;
        
        setTransactionResult({
          transactionId: paymentData.transactionId,
          amount: paymentData.amount,
          employeeName: paymentData.employeeName,
          month: paymentData.month,
          year: paymentData.year,
          processedAt: new Date(paymentData.paymentDate),
          paymentMethod: 'stripe_checkout',
          stripeSessionId: paymentData.stripeSessionId
        });

        setSuccess(true);
        toast.success('Payment completed and recorded successfully!', { 
          duration: 6000,
          position: 'top-center'
        });
      } else {
        throw new Error(response.data.message || 'Payment confirmation failed');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      
      if (error.response?.status === 409) {
        // Payment already exists - still show success
        toast.success('Payment already processed successfully!', { 
          duration: 6000,
          position: 'top-center'
        });
        setSuccess(true);
        setTransactionResult({
          transactionId: 'ALREADY_PROCESSED',
          amount: 0,
          employeeName: 'Employee',
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          processedAt: new Date(),
          paymentMethod: 'stripe_checkout'
        });
      } else {
        setError(error.response?.data?.message || 'Failed to confirm payment');
        toast.error('Failed to confirm payment. Please contact support.', {
          duration: 8000,
          position: 'top-center'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard/admin/payroll');
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}>
        <Card sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <CircularProgress size={60} sx={{ mb: 3, color: 'primary.main' }} />
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Processing Payment...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please wait while we confirm your payment with Stripe.
          </Typography>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3
      }}>
        <Card sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
          <ErrorIcon color="error" sx={{ fontSize: 80, mb: 3 }} />
          <Typography variant="h4" gutterBottom color="error.main" fontWeight="bold">
            Payment Error
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {error}
          </Typography>
          
          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="body2">
              If you were charged, please contact support with your payment details.
              We will investigate and resolve this issue promptly.
            </Typography>
          </Alert>

          <Button 
            variant="contained" 
            onClick={handleGoToDashboard}
            startIcon={<Home />}
            size="large"
            sx={{ textTransform: 'none' }}
          >
            Return to Dashboard
          </Button>
        </Card>
      </Box>
    );
  }

  if (success) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3
      }}>
        <Card sx={{ p: 4, textAlign: 'center', maxWidth: 700 }}>
          <CheckCircle color="success" sx={{ fontSize: 100, mb: 3 }} />
          <Typography variant="h3" gutterBottom color="success.main" fontWeight="bold">
            Payment Successful!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            The salary payment has been processed successfully through Stripe.
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
                    Stripe Checkout
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Processed At</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {transactionResult?.processedAt?.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              onClick={handleGoToDashboard}
              startIcon={<Home />}
              size="large"
              sx={{ 
                textTransform: 'none',
                fontWeight: 'bold',
                px: 4
              }}
            >
              Return to Payroll Dashboard
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }

  return null;
};

export default PaymentSuccess;
