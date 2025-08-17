import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Business,
  People,
  Timeline,
  Security,
  Star,
  CheckCircle,
  TrendingUp,
  Analytics,
  CloudDone,
  VerifiedUser,
  Assignment,
  Payment,
  Support,
  Language,
  LocationOn,
  Email,
  Phone
} from '@mui/icons-material';

const About = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former HR director with 15+ years experience in workforce management and digital transformation.',
      avatar: 'SJ',
      expertise: ['Strategic Leadership', 'HR Technology', 'Business Development']
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      bio: 'Full-stack engineer and system architect specializing in scalable enterprise solutions.',
      avatar: 'MC',
      expertise: ['System Architecture', 'Cloud Computing', 'Data Security']
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      bio: 'Product strategist focused on user experience and innovative HR technology solutions.',
      avatar: 'ER',
      expertise: ['Product Strategy', 'UX Design', 'Market Research']
    },
    {
      name: 'David Wilson',
      role: 'VP of Engineering',
      bio: 'Lead developer with expertise in modern web technologies and database optimization.',
      avatar: 'DW',
      expertise: ['Software Development', 'Database Design', 'API Architecture']
    }
  ];

  const values = [
    {
      icon: <Security />,
      title: 'Trust & Security',
      description: 'Your data security is our top priority. We implement bank-level encryption and follow industry best practices.'
    },
    {
      icon: <People />,
      title: 'Employee First',
      description: 'Every feature we build focuses on improving the employee experience and workplace satisfaction.'
    },
    {
      icon: <TrendingUp />,
      title: 'Continuous Innovation',
      description: 'We constantly evolve our platform based on user feedback and emerging HR technology trends.'
    },
    {
      icon: <Support />,
      title: 'Exceptional Support',
      description: '24/7 customer support with dedicated success managers for enterprise clients.'
    }
  ];

  const milestones = [
    { year: '2020', title: 'Company Founded', description: 'EmpowHR was established with a vision to revolutionize workforce management' },
    { year: '2021', title: 'First 100 Customers', description: 'Reached our first milestone of 100 satisfied customers across various industries' },
    { year: '2022', title: 'Series A Funding', description: 'Secured $10M Series A funding to accelerate product development and market expansion' },
    { year: '2023', title: 'Global Expansion', description: 'Expanded operations to 25+ countries with localized support and compliance' },
    { year: '2024', title: '500+ Enterprise Clients', description: 'Now serving over 500 companies and 50,000+ employees worldwide' }
  ];

  const achievements = [
    { icon: <Star />, title: 'Industry Awards', count: '15+', description: 'HR Technology awards and recognitions' },
    { icon: <People />, title: 'Employees Managed', count: '50K+', description: 'Active users across all platforms' },
    { icon: <Business />, title: 'Enterprise Clients', count: '500+', description: 'Companies trust our platform' },
    { icon: <Language />, title: 'Global Presence', count: '25+', description: 'Countries with active users' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #00897b 0%, #4db6ac 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            About EmpowHR
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, maxWidth: '800px', mx: 'auto' }}>
            Transforming the future of work through innovative HR technology solutions
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '600px', mx: 'auto' }}>
            Founded in 2020, we've grown from a small startup to a leading HR technology platform trusted by companies worldwide
          </Typography>
        </Container>
      </Box>

      {/* Mission & Vision Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', p: 4, borderRadius: 3 }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 60, height: 60 }}>
                    <Assignment />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    Our Mission
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'text.secondary' }}>
                  To empower organizations with intelligent workforce management solutions that enhance productivity, 
                  ensure transparency, and create better workplace experiences for employees at every level.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', p: 4, borderRadius: 3 }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 60, height: 60 }}>
                    <Timeline />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" color="secondary.main">
                    Our Vision
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'text.secondary' }}>
                  To become the world's most trusted HR technology platform, enabling organizations to build 
                  thriving workplaces where employees feel valued, productive, and connected to their purpose.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Company Values */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              Our Core Values
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
              The principles that guide everything we do
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 3,
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 70,
                      height: 70,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    {value.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {value.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Company Timeline */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Our Journey
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
            Key milestones in our company's growth and evolution
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          {milestones.map((milestone, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 4, alignItems: 'center' }}>
              <Box sx={{ minWidth: 120, textAlign: 'center' }}>
                <Chip
                  label={milestone.year}
                  color="primary"
                  sx={{ fontWeight: 'bold', fontSize: '1rem', px: 2 }}
                />
              </Box>
              <Box sx={{ flex: 1, ml: 4 }}>
                <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.main">
                    {milestone.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {milestone.description}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Team Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              Meet Our Leadership Team
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
              The experienced professionals driving EmpowHR's innovation and growth
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 3,
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
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
                    {member.avatar}
                  </Avatar>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary.main" gutterBottom fontWeight="500">
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                    {member.bio}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {member.expertise.map((skill, skillIndex) => (
                      <Chip
                        key={skillIndex}
                        label={skill}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Achievements Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Our Achievements
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
            Numbers that reflect our commitment to excellence and customer success
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {achievements.map((achievement, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 3,
                  height: '100%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,137,123,0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {React.cloneElement(achievement.icon, { sx: { fontSize: 50, opacity: 0.9 } })}
                </Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {achievement.count}
                </Typography>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {achievement.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {achievement.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Technology & Security */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              Technology & Security
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
              Built with cutting-edge technology and enterprise-grade security
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, height: '100%', borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" color="primary.main">
                  Technology Stack
                </Typography>
                <List>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Modern React & Node.js Architecture"
                      secondary="Scalable, maintainable, and performant codebase"
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Cloud-Native Infrastructure"
                      secondary="AWS-powered with 99.9% uptime guarantee"
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Real-Time Data Processing"
                      secondary="Instant updates and synchronization across all devices"
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="AI-Powered Analytics"
                      secondary="Machine learning for predictive workforce insights"
                    />
                  </ListItem>
                </List>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, height: '100%', borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" color="secondary.main">
                  Security & Compliance
                </Typography>
                <List>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemIcon>
                      <VerifiedUser color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="SOC 2 Type II Certified"
                      secondary="Independently audited security controls and processes"
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemIcon>
                      <VerifiedUser color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="GDPR & CCPA Compliant"
                      secondary="Full compliance with global privacy regulations"
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemIcon>
                      <VerifiedUser color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="End-to-End Encryption"
                      secondary="256-bit SSL encryption for all data transmission"
                    />
                  </ListItem>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemIcon>
                      <VerifiedUser color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Regular Security Audits"
                      secondary="Quarterly penetration testing and vulnerability assessments"
                    />
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Information */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Get In Touch
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
            Ready to transform your workforce management? We'd love to hear from you
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3, height: '100%' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                <LocationOn />
              </Avatar>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Headquarters
              </Typography>
              <Typography variant="body1" color="text.secondary">
                123 Innovation Drive<br />
                San Francisco, CA 94105<br />
                United States
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3, height: '100%' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                <Email />
              </Avatar>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Email Us
              </Typography>
              <Typography variant="body1" color="text.secondary">
                General: info@empowhr.com<br />
                Support: support@empowhr.com<br />
                Sales: sales@empowhr.com
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3, height: '100%' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                <Phone />
              </Avatar>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Call Us
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sales: +1 (555) 123-4567<br />
                Support: +1 (555) 987-6543<br />
                24/7 Emergency: +1 (555) 911-HELP
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, fontSize: '1.2rem', opacity: 0.9 }}>
            Join hundreds of companies already transforming their workforce management with EmpowHR
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
              Contact Sales
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
