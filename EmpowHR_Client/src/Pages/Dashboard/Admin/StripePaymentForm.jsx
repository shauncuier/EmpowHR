import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { Payment, CreditCard } from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RiGdn9VfHwPjb8JUismgu4mJBa1WTlkGatod1c8dQz7QAo9BVbwmhunKAAUu5KxT0apBbPGyoWtOccenckfK6Pm0001Aghs6S');

console.log('Stripe publishable key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Not set');

const CheckoutForm = ({ request, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('Stripe payment submit started');
    console.log('Stripe loaded:', !!stripe);
    console.log('Elements loaded:', !!elements);

    if (!stripe || !elements) {
      console.error('Stripe.js has not loaded yet');
      setError('Payment system not ready. Please try again.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      console.log('Creating payment intent for:', request);
      
      // Create payment intent on the server
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
        amount: request.salary,
        employeeEmail: request.employeeEmail,
        employeeName: request.employeeName
      });

      console.log('Payment intent created:', data);

      if (!data.clientSecret) {
        throw new Error('No client secret received from server');
      }

      // Get the card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      console.log('Confirming card payment...');

      // Confirm the payment with the card element
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: request.employeeName,
              email: request.employeeEmail,
            },
          }
        }
      );

      console.log('Stripe response:', { stripeError, paymentIntent });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded, recording in database...');
        
        // Payment successful, record it in the database
        await axios.post(`${import.meta.env.VITE_API_URL}/api/process-payment`, {
          requestId: request._id,
          paymentIntentId: paymentIntent.id,
          employeeEmail: request.employeeEmail,
          employeeName: request.employeeName,
          amount: request.salary,
          month: request.month,
          year: request.year,
          fallbackPayment: false
        });

        console.log('Payment recorded successfully');
        toast.success('Payment processed successfully!');
        onSuccess();
        onClose();
      } else {
        console.error('Payment not succeeded. Status:', paymentIntent?.status);
        setError(`Payment failed. Status: ${paymentIntent?.status}`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      
      // Handle duplicate payment specifically
      if (err.response?.status === 409) {
        const existingPayment = err.response?.data?.existingPayment;
        if (existingPayment) {
          setError(`Duplicate payment blocked! Payment already exists (Transaction ID: ${existingPayment.transactionId})`);
          toast.error(
            `Duplicate payment blocked! Payment already exists (ID: ${existingPayment.transactionId})`,
            { duration: 6000 }
          );
        } else {
          setError(err.response?.data?.message || 'Payment already exists for this month');
        }
      } else {
        setError(err.response?.data?.message || err.message || 'Payment failed');
      }
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="body1" gutterBottom>
        Processing payment for <strong>{request.employeeName}</strong>
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Amount: <strong>${request.salary}</strong> for {new Date(0, request.month - 1).toLocaleString('en-US', { month: 'long' })} {request.year}
      </Typography>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2, 
          mb: 3,
          backgroundColor: 'grey.50'
        }}
      >
        <CardElement options={cardElementOptions} />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Test Card Numbers:</strong><br />
          • Success: 4242 4242 4242 4242<br />
          • Declined: 4000 0000 0000 0002<br />
          • Use any future expiry date and any 3-digit CVC
        </Typography>
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button 
          onClick={onClose} 
          disabled={processing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || processing}
          startIcon={processing ? <CircularProgress size={20} /> : <CreditCard />}
        >
          {processing ? 'Processing...' : `Pay $${request.salary}`}
        </Button>
      </Box>
    </Box>
  );
};

const StripePaymentForm = ({ request, onSuccess, onClose, open }) => {
  if (!open) return null;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        request={request} 
        onSuccess={onSuccess} 
        onClose={onClose} 
      />
    </Elements>
  );
};

export default StripePaymentForm;
