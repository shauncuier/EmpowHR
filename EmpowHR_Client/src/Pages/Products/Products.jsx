import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Rating,
  Paper
} from '@mui/material';
import { TrendingUp, Star, ShoppingCart } from '@mui/icons-material';

const Products = () => {
  const [sortBy, setSortBy] = useState('name');
  
  // Sample products data - in real app, this would come from API
  const [products] = useState([
    {
      id: 1,
      name: 'Employee Management Pro',
      price: 299,
      originalPrice: 399,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      description: 'Complete employee management solution with advanced analytics and reporting.',
      rating: 4.8,
      reviews: 234,
      category: 'Software',
      featured: true,
      discount: 25
    },
    {
      id: 2,
      name: 'Payroll Processing Suite',
      price: 199,
      originalPrice: 249,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
      description: 'Automated payroll processing with Stripe integration and tax calculations.',
      rating: 4.6,
      reviews: 189,
      category: 'Finance',
      featured: false,
      discount: 20
    },
    {
      id: 3,
      name: 'HR Analytics Dashboard',
      price: 149,
      originalPrice: 199,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      description: 'Real-time HR analytics with customizable charts and performance metrics.',
      rating: 4.7,
      reviews: 156,
      category: 'Analytics',
      featured: true,
      discount: 25
    },
    {
      id: 4,
      name: 'Workforce Monitoring',
      price: 99,
      originalPrice: 129,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      description: 'Track employee productivity and workload with detailed time tracking.',
      rating: 4.5,
      reviews: 298,
      category: 'Productivity',
      featured: false,
      discount: 23
    },
    {
      id: 5,
      name: 'Security & Compliance',
      price: 399,
      originalPrice: 499,
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
      description: 'Enterprise-grade security with role-based access and audit trails.',
      rating: 4.9,
      reviews: 87,
      category: 'Security',
      featured: true,
      discount: 20
    },
    {
      id: 6,
      name: 'Mobile Workforce App',
      price: 79,
      originalPrice: 99,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      description: 'Mobile application for remote workforce management and communication.',
      rating: 4.4,
      reviews: 445,
      category: 'Mobile',
      featured: false,
      discount: 20
    },
    {
      id: 7,
      name: 'Integration Platform',
      price: 249,
      originalPrice: 299,
      image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop',
      description: 'Seamless integration with existing HR systems and third-party tools.',
      rating: 4.6,
      reviews: 123,
      category: 'Integration',
      featured: false,
      discount: 17
    },
    {
      id: 8,
      name: 'AI Performance Insights',
      price: 449,
      originalPrice: 599,
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
      description: 'AI-powered performance analysis and predictive workforce analytics.',
      rating: 4.8,
      reviews: 67,
      category: 'AI',
      featured: true,
      discount: 25
    }
  ]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const ProductCard = ({ product }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'grey.200',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          borderColor: 'primary.main'
        },
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
    >
      {product.featured && (
        <Chip
          label="Featured"
          color="primary"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 1,
            fontWeight: 'bold'
          }}
        />
      )}
      
      {product.discount > 0 && (
        <Chip
          label={`-${product.discount}%`}
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
            fontWeight: 'bold'
          }}
        />
      )}

      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography gutterBottom variant="h6" component="h3" fontWeight="bold">
          {product.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {product.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={product.rating} precision={0.1} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {product.rating} ({product.reviews} reviews)
          </Typography>
        </Box>

        <Chip
          label={product.category}
          variant="outlined"
          size="small"
          sx={{ alignSelf: 'flex-start', mb: 2 }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              ${product.price}
            </Typography>
            {product.originalPrice > product.price && (
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary'
                }}
              >
                ${product.originalPrice}
              </Typography>
            )}
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          startIcon={<ShoppingCart />}
          sx={{
            borderRadius: 2,
            py: 1.5,
            fontWeight: 'bold',
            '&:hover': {
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          See More
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          All Products
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem', maxWidth: '600px', mx: 'auto' }}>
          Discover our comprehensive suite of HR management solutions designed to empower your workforce
        </Typography>
      </Box>

      {/* Filter and Sort Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TrendingUp color="primary" />
            <Typography variant="h6" fontWeight="bold">
              {products.length} Products Available
            </Typography>
          </Box>

          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              label="Sort By"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="name">Name (A-Z)</MenuItem>
              <MenuItem value="price-asc">Price (Low to High)</MenuItem>
              <MenuItem value="price-desc">Price (High to Low)</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Featured Products Banner */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Star color="primary" />
          Featured Products
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Hand-picked solutions for maximum impact on your business
        </Typography>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={4}>
        {sortedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mt: 8, p: 4, bgcolor: 'grey.50', borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Need Help Choosing?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Our experts can help you find the perfect solution for your organization
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 'bold'
          }}
        >
          Contact Sales Team
        </Button>
      </Box>
    </Container>
  );
};

export default Products;
