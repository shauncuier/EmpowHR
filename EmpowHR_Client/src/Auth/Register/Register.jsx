import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Grid
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { Visibility, VisibilityOff, Google, PhotoCamera } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Register = () => {
  const { registerUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      salary: 25000
    }
  });

  const password = watch('password');

  // Password validation functions
  const validatePassword = (value) => {
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Password must contain at least one capital letter';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return 'Password must contain at least one special character';
    }
    return true;
  };

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Image size should be less than 2MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to ImgBB
  const uploadImage = async (file) => {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      let photoURL = '';
      
      // Upload image if selected
      if (imageFile) {
        photoURL = await uploadImage(imageFile);
      }

      const userData = {
        name: data.name,
        role: data.role,
        designation: data.designation,
        salary: parseInt(data.salary),
        bank_account_no: data.bank_account_no,
        photo: photoURL
      };

      await registerUser(data.email, data.password, userData);
      toast.success('Registration successful! Welcome to EmpowHR!');
      
      // Small delay to ensure user state is updated
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register');
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      toast.success('Google sign-in successful! Welcome to EmpowHR!');
      
      // Small delay to ensure user state is updated
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(error.message || 'Failed to sign in with Google');
      toast.error('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Join EmpowHR
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create your account to get started
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            {/* Profile Photo Section */}
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={imagePreview}
                  sx={{ width: 100, height: 100, mb: 2 }}
                />
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="photo-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="photo-upload">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: -10,
                      bgcolor: 'background.paper',
                      boxShadow: 1
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Upload your profile photo (Max 2MB)
              </Typography>
            </Grid>

            {/* Basic Information */}
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('name', { required: 'Name is required' })}
                fullWidth
                label="Full Name"
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            {/* Role Selection */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel>Role</InputLabel>
                <Select
                  {...register('role', { required: 'Role is required' })}
                  label="Role"
                  defaultValue=""
                >
                  <MenuItem value="employee">Employee</MenuItem>
                  <MenuItem value="hr">HR</MenuItem>
                </Select>
                {errors.role && (
                  <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                    {errors.role.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('designation', { required: 'Designation is required' })}
                fullWidth
                label="Designation"
                placeholder="e.g., Sales Assistant, Social Media Executive"
                error={!!errors.designation}
                helperText={errors.designation?.message}
              />
            </Grid>

            {/* Employment Details */}
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('salary', { 
                  required: 'Salary is required',
                  min: { value: 1, message: 'Salary must be greater than 0' }
                })}
                fullWidth
                label="Salary"
                type="number"
                error={!!errors.salary}
                helperText={errors.salary?.message || "Enter your expected salary"}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('bank_account_no', { required: 'Bank account number is required' })}
                fullWidth
                label="Bank Account Number"
                error={!!errors.bank_account_no}
                helperText={errors.bank_account_no?.message}
              />
            </Grid>

            {/* Password Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('password', { validate: validatePassword })}
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                fullWidth
                label="Confirm Password"
                type="password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || uploadingImage}
          >
            {uploadingImage ? 'Uploading Image...' : loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            Continue with Google
          </Button>

          <Box textAlign="center">
            <Typography variant="body2">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
