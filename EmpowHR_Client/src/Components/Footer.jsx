import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Paper
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Email,
  Phone,
  LocationOn,
  Business,
  Security,
  Support
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        mt: 'auto',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              EmpowHR
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Empowering your workforce management for the digital age. Streamline operations, boost productivity, and drive growth.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                size="small" 
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                aria-label="Facebook"
              >
                <Facebook />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                aria-label="Twitter"
              >
                <Twitter />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                aria-label="LinkedIn"
              >
                <LinkedIn />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                aria-label="Instagram"
              >
                <Instagram />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                href="/" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Home
              </Link>
              <Link 
                href="/register" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Register
              </Link>
              <Link 
                href="/login" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Login
              </Link>
              <Link 
                href="/contact" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Contact
              </Link>
              <Link 
                href="/dashboard" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Dashboard
              </Link>
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
                <Business fontSize="small" />
                <Typography variant="body2">Workforce Management</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
                <Security fontSize="small" />
                <Typography variant="body2">Payroll Processing</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
                <Support fontSize="small" />
                <Typography variant="body2">HR Management</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
                <Business fontSize="small" />
                <Typography variant="body2">Employee Analytics</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
                <Email fontSize="small" />
                <Typography variant="body2">support@empowhr.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
                <Phone fontSize="small" />
                <Typography variant="body2">+1 (555) 123-4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2">
                  123 Business Ave, Suite 100<br />
                  New York, NY 10001
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255,255,255,0.2)' }} />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {currentYear} EmpowHR. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Link 
              href="#" 
              color="inherit" 
              underline="hover"
              sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              color="inherit" 
              underline="hover"
              sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              Terms of Service
            </Link>
            <Link 
              href="#" 
              color="inherit" 
              underline="hover"
              sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>

        {/* Technology Credits */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="caption" sx={{ opacity: 0.7, textAlign: 'center', display: 'block' }}>
            Built with ❤️ using React 19, Node.js, MongoDB, Material-UI, and Stripe
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
