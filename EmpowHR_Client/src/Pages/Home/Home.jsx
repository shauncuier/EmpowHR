import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Business,
  People,
  Assignment,
  Payment,
  Star,
  TrendingUp,
  CheckCircle,
  Security,
  Speed,
  Analytics,
  CloudDone,
  PhoneAndroid,
  Group,
  MonetizationOn,
  Timeline,
  VerifiedUser,
  Dashboard,
  AutoGraph
} from '@mui/icons-material';

const Home = () => {
  const services = [
    {
      icon: <Assignment />,
      title: 'Workload Management',
      description: 'Comprehensive worksheet system for tracking employee tasks, hours worked, and productivity metrics with real-time updates.'
    },
    {
      icon: <People />,
      title: 'Employee Management',
      description: 'Complete HR solution with role-based access, employee verification, and streamlined onboarding processes.'
    },
    {
      icon: <Payment />,
      title: 'Secure Payroll System',
      description: 'Stripe-integrated payment processing with automated salary calculations and transparent payment history.'
    },
    {
      icon: <Analytics />,
      title: 'Advanced Analytics',
      description: 'Detailed performance insights, productivity reports, and data-driven decision making tools for managers.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'HR Director at TechCorp',
      message: 'EmpowHR transformed our workforce management. The intuitive dashboard and real-time analytics helped us increase productivity by 45% within just 3 months.',
      avatar: 'SJ',
      company: 'TechCorp Solutions'
    },
    {
      name: 'Michael Chen',
      role: 'Operations Manager',
      message: 'The automated payroll system is incredibly reliable. Our employees love the transparency, and we\'ve eliminated payment errors completely.',
      avatar: 'MC',
      company: 'Digital Dynamics'
    },
    {
      name: 'Emily Rodriguez',
      role: 'CEO & Founder',
      message: 'From startup to 200+ employees, EmpowHR scaled with us perfectly. The role-based permissions and security features give us complete peace of mind.',
      avatar: 'ER',
      company: 'InnovateLabs'
    }
  ];

  const features = [
    { icon: <Security />, title: 'Enterprise Security', description: 'Bank-level encryption and security' },
    { icon: <Speed />, title: 'Lightning Fast', description: 'Real-time updates and instant synchronization' },
    { icon: <CloudDone />, title: 'Cloud-Based', description: 'Access from anywhere, anytime' },
    { icon: <PhoneAndroid />, title: 'Mobile Responsive', description: 'Perfect on all devices and screen sizes' },
    { icon: <VerifiedUser />, title: 'Role-Based Access', description: 'Employee, HR, and Admin dashboards' },
    { icon: <AutoGraph />, title: 'Smart Analytics', description: 'AI-powered insights and reporting' }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Employee Registration',
      description: 'Employees register with role selection, upload profile photos, and complete verification process.',
      icon: <Group />
    },
    {
      step: '02',
      title: 'Work Tracking',
      description: 'Daily work entry with task categorization, hours tracking, and productivity monitoring.',
      icon: <Assignment />
    },
    {
      step: '03',
      title: 'HR Management',
      description: 'HR verifies employees, monitors progress, and creates payment requests for admin approval.',
      icon: <People />
    },
    {
      step: '04',
      title: 'Payment Processing',
      description: 'Secure Stripe-powered salary payments with automated transaction logging and history.',
      icon: <MonetizationOn />
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 10,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Chip 
            label="🚀 Trusted by 500+ Companies Worldwide" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              mb: 3,
              fontSize: '0.9rem'
            }} 
          />
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
            Revolutionize Your Workforce with EmpowHR
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 3, opacity: 0.9, maxWidth: '800px', mx: 'auto' }}>
            The most comprehensive employee workload monitoring and management system designed for modern businesses
          </Typography>
          <Typography variant="body1" sx={{ mb: 5, fontSize: '1.2rem', opacity: 0.8, maxWidth: '600px', mx: 'auto' }}>
            Streamline operations • Boost productivity • Ensure transparency • Scale effortlessly
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100', transform: 'translateY(-2px)' },
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                borderRadius: 2,
                transition: 'all 0.3s ease'
              }}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/contact"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { 
                  borderColor: 'white', 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)'
                },
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                borderRadius: 2,
                transition: 'all 0.3s ease'
              }}
            >
              Schedule Demo
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Highlights */}
      <Container maxWidth="lg" sx={{ py: 6, mt: -3 }}>
        <Grid container spacing={2}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 1 }}>
                  {React.cloneElement(feature.icon, { sx: { fontSize: 40 } })}
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Comprehensive HR Solutions
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem', maxWidth: '600px', mx: 'auto' }}>
            Everything you need to manage your workforce efficiently, from employee onboarding to payment processing
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  '&:hover': { 
                    borderColor: 'primary.main',
                    boxShadow: '0 8px 30px rgba(25,118,210,0.15)',
                    transform: 'translateY(-4px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        width: 60, 
                        height: 60,
                        mt: 1
                      }}
                    >
                      {service.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                        {service.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {service.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              How EmpowHR Works
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
              Simple, efficient workflow designed for maximum productivity
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {workflowSteps.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      fontSize: '2rem'
                    }}
                  >
                    {step.icon}
                  </Avatar>
                  <Chip 
                    label={step.step} 
                    color="primary" 
                    sx={{ 
                      position: 'absolute', 
                      top: -10, 
                      right: '50%', 
                      transform: 'translateX(50%)',
                      fontWeight: 'bold'
                    }} 
                  />
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Trusted by Industry Leaders
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
            See how companies worldwide are transforming their workforce management
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 3,
                  position: 'relative',
                  '&:hover': { 
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    transform: 'translateY(-4px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} sx={{ color: '#ffc107', fontSize: 24 }} />
                  ))}
                </Box>
                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3, lineHeight: 1.6 }}>
                  "{testimonial.message}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 50, height: 50 }}>
                    {testimonial.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                    <Typography variant="caption" color="primary.main" fontWeight="bold">
                      {testimonial.company}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Success Stats Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              Proven Results & Impact
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.2rem', opacity: 0.9 }}>
              Numbers that demonstrate our commitment to your success
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 1 }}>
                  500+
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Companies Trust Us
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                  From startups to enterprises
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 1 }}>
                  50K+
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Employees Managed
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                  Across 25+ countries
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 1 }}>
                  99.9%
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Uptime Guarantee
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                  Enterprise-grade reliability
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 1 }}>
                  24/7
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Expert Support
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                  Always here to help
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
          Ready to Transform Your Business?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, fontSize: '1.2rem', color: 'text.secondary' }}>
          Join thousands of companies already using EmpowHR to streamline operations, boost productivity, and drive growth.
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <List sx={{ display: 'inline-block', textAlign: 'left' }}>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="30-day free trial • No credit card required" />
            </ListItem>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Setup in under 10 minutes • Full support included" />
            </ListItem>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Cancel anytime • Your data is always yours" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/register"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: 2,
              fontSize: '1.1rem',
              '&:hover': { transform: 'translateY(-2px)' },
              transition: 'all 0.3s ease'
            }}
          >
            Start Your Free Trial
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/contact"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: 2,
              fontSize: '1.1rem',
              '&:hover': { transform: 'translateY(-2px)' },
              transition: 'all 0.3s ease'
            }}
          >
            Contact Sales
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
