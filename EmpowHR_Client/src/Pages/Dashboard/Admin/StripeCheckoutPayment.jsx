import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  Security,
  CheckCircle,
  Receipt,
  ExitToApp
} from '@mui/icons-material';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeCheckoutPayment = ({ request, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);

  // Check for successful payment on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const successParam = urlParams.get('success');

    console.log('URL params:', { sessionId, successParam });

    if (successParam === 'true' && sessionId) {
      console.log('Processing successful payment with session:', sessionId);
      handlePaymentSuccess(sessionId);
      
      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  const handlePaymentSuccess = async (sessionId) => {
    try {
      setProcessing(true);
      
      console.log('Confirming payment with session ID:', sessionId);
      
      // Confirm payment with our server
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
          processedAt: paymentData.paymentDate,
          paymentMethod: 'stripe_checkout',
          stripeSessionId: paymentData.stripeSessionId
        });

        setSuccess(true);
        toast.success('Payment completed and recorded successfully!');
        onSuccess();
      } else {
        throw new Error(response.data.message || 'Payment confirmation failed');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      
      if (error.response?.status === 409) {
        toast.error(error.response?.data?.message || 'Payment already exists');
        // Still show success since payment was processed
        setSuccess(true);
        onSuccess();
      } else {
        toast.error(error.response?.data?.message || 'Failed to confirm payment');
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleStripeCheckout = async () => {
    if (loading || processing) return;

    setLoading(true);

    try {
      console.log('Creating Stripe checkout session for:', {
        employee: request.employeeName,
        amount: request.salary,
        month: request.month,
        year: request.year
      });

      // Create checkout session
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-checkout-session`, {
        requestId: request._id,
        employeeEmail: request.employeeEmail,
        employeeName: request.employeeName,
        amount: request.salary,
        month: request.month,
        year: request.year
      });

      const { sessionId } = response.data;

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe redirect error:', error);
        toast.error('Failed to redirect to payment page: ' + error.message);
      }

    } catch (error) {
      console.error('Checkout creation error:', error);
      
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
      } else {
        toast.error(error.response?.data?.message || 'Failed to create payment session. Please try again.');
      }
    } finally {
      setLoading(false);
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

        {/* Stripe Payment Information */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security color="primary" />
            Secure Stripe Payment
          </Typography>
          
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                    alt="Stripe" 
                    style={{ height: '30px' }}
                  />
                  <Typography variant="body1" fontWeight="medium">
                    Powered by Stripe
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  You will be redirected to Stripe's secure checkout page (checkout.stripe.com) to complete your payment.
                  Stripe accepts all major credit and debit cards.
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  {['visa', 'mastercard', 'amex', 'discover'].map((card) => (
                    <Box 
                      key={card}
                      sx={{ 
                        padding: '4px 8px', 
                        border: '1px solid #ddd', 
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        color: 'text.secondary'
                      }}
                    >
                      {card}
                    </Box>
                  ))}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Security Notice */}
        <Alert severity="info" icon={<Security />} sx={{ borderRadius: 2 }}>
          <Typography variant="body2">
            <strong>Secure Payment Processing</strong><br />
            Your payment will be processed securely through Stripe's PCI-compliant payment infrastructure.
            We never store your credit card information.
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
        Please wait while we retrieve your payment details.
      </Typography>
    </Box>
  );

  const renderSuccess = () => (
    <Box sx={{ textAlign: 'center', py: 4, px: 3 }}>
      <CheckCircle color="success" sx={{ fontSize: 100, mb: 3 }} />
      <Typography variant="h4" gutterBottom color="success.main" fontWeight="bold">
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
              <Typography variant="body2" color="text.secondary">Stripe Session ID</Typography>
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
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Customer Email</Typography>
              <Typography variant="body1" fontWeight="medium">{transactionResult?.customerEmail}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box>
      {!success && !processing && renderPaymentForm()}
      {processing && renderProcessing()}
      {success && renderSuccess()}

      {!processing && (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={onClose} 
            disabled={loading}
            size="large"
            sx={{ textTransform: 'none' }}
          >
            {success ? 'Close' : 'Cancel'}
          </Button>
          {!success && (
            <Button
              variant="contained"
              onClick={handleStripeCheckout}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <ExitToApp />}
              size="large"
              sx={{ 
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: 2,
                px: 4
              }}
            >
              {loading ? 'Creating Session...' : 'Pay with Stripe'}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StripeCheckoutPayment;
