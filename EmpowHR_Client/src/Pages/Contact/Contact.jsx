import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Alert
} from '@mui/material';
import { LocationOn, Phone, Email } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccess(false);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contacts`, data);
      toast.success('Message sent successfully!');
      setSuccess(true);
      reset();
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          Get in touch with our team for any questions or support
        </Typography>
      </Box>

      <Grid container spacing={6}>
        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              Get in Touch
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocationOn sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="h6">Our Office</Typography>
                  <Typography variant="body2" color="text.secondary">
                    123 Business Street, Suite 100<br />
                    New York, NY 10001, USA
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Phone sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="h6">Phone</Typography>
                  <Typography variant="body2" color="text.secondary">
                    +1 (555) 123-4567
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Email sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="h6">Email</Typography>
                  <Typography variant="body2" color="text.secondary">
                    support@empowhr.com
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Business Hours
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Send us a Message
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Thank you for your message! We'll get back to you soon.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address'
                  }
                })}
                fullWidth
                label="Email Address"
                type="email"
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                {...register('message', {
                  required: 'Message is required',
                  minLength: {
                    value: 10,
                    message: 'Message must be at least 10 characters'
                  }
                })}
                fullWidth
                label="Message"
                multiline
                rows={6}
                margin="normal"
                error={!!errors.message}
                helperText={errors.message?.message}
                placeholder="Tell us how we can help you..."
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Map or Additional Info Section */}
      <Box sx={{ mt: 8 }}>
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
          }}
        >
          <Typography variant="h5" gutterBottom>
            Why Choose EmpowHR?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join thousands of companies that trust EmpowHR for their workforce management needs.
            Our dedicated support team is here to help you succeed.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Contact;
