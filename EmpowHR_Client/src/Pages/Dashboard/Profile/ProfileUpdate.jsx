import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Email,
  Work,
  AttachMoney,
  AccountBalance
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../../Context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { canEditUserProfile, PERMISSIONS } from '../../../Utils/rolePermissions';
import PermissionGuard from '../../../Components/PermissionGuard';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProfileUpdate = () => {
  const { user, userDetails } = useAuth();
  const [loading, setLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');

  const { control, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '',
      designation: '',
      salary: 0,
      bank_account_no: '',
      photo: ''
    }
  });

  // Load user data into form
  useEffect(() => {
    if (userDetails) {
      setValue('name', userDetails.name || '');
      setValue('designation', userDetails.designation || '');
      setValue('salary', userDetails.salary || 25000);
      setValue('bank_account_no', userDetails.bank_account_no || '');
      setValue('photo', userDetails.photo || '');
      setPhotoUrl(userDetails.photo || '');
    }
  }, [userDetails, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Update Firebase profile
      if (user) {
        await updateProfile(user, {
          displayName: data.name,
          photoURL: data.photo
        });
      }

      // Update user in database
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${userDetails._id}`, {
        name: data.name,
        designation: data.designation,
        salary: parseInt(data.salary),
        bank_account_no: data.bank_account_no,
        photo: data.photo,
        role: userDetails.role, // Keep existing role
        isVerified: userDetails.isVerified, // Keep verification status
        isFired: userDetails.isFired // Keep employment status
      });

      toast.success('Profile updated successfully!');
      
      // Refresh the page to get updated user data
      window.location.reload();
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setPhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
      );

      const imageUrl = response.data.data.url;
      setValue('photo', imageUrl);
      setPhotoUrl(imageUrl);
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error('Failed to upload photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  // Handle photo URL input
  const handlePhotoUrlSubmit = () => {
    setValue('photo', photoUrl);
    setPhotoDialogOpen(false);
    toast.success('Photo URL updated!');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Person color="primary" />
          <Typography variant="h5">Profile Settings</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Update your personal information and preferences
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Profile Photo Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Profile Photo
              </Typography>
              
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={photoUrl}
                  alt={userDetails?.name}
                  sx={{ width: 120, height: 120, mx: 'auto' }}
                >
                  {userDetails?.name?.charAt(0).toUpperCase()}
                </Avatar>
                
                {photoUploading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      borderRadius: '50%'
                    }}
                  >
                    <CircularProgress color="primary" size={24} />
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<PhotoCamera />}
                  disabled={photoUploading}
                  size="small"
                >
                  Upload Photo
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handlePhotoUpload}
                  />
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => setPhotoDialogOpen(true)}
                  size="small"
                >
                  Enter Photo URL
                </Button>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Supported formats: JPG, PNG, GIF (max 5MB)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Information Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  {/* Name */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: 'Name is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Full Name"
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          InputProps={{
                            startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Email (Read-only) */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={userDetails?.email || ''}
                      disabled
                      InputProps={{
                        startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />
                      }}
                      helperText="Email cannot be changed"
                    />
                  </Grid>

                  {/* Designation */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="designation"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Job Title/Designation"
                          InputProps={{
                            startAdornment: <Work sx={{ color: 'action.active', mr: 1 }} />
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Salary (conditional display for non-employees) */}
                  <PermissionGuard
                    requiredPermissions={[]}
                    fallback={null}
                  >
                    {(userDetails?.role === 'admin' || userDetails?.role === 'hr') && (
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="salary"
                          control={control}
                          rules={{ required: 'Salary is required', min: { value: 1000, message: 'Minimum salary is $1000' } }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Monthly Salary"
                              type="number"
                              error={!!errors.salary}
                              helperText={errors.salary?.message || "Only HR and Admin can edit salary"}
                              InputProps={{
                                startAdornment: <AttachMoney sx={{ color: 'action.active', mr: 1 }} />
                              }}
                            />
                          )}
                        />
                      </Grid>
                    )}
                  </PermissionGuard>

                  {/* Bank Account */}
                  <Grid item xs={12}>
                    <Controller
                      name="bank_account_no"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Bank Account Number"
                          placeholder="Enter your bank account number for salary payments"
                          InputProps={{
                            startAdornment: <AccountBalance sx={{ color: 'action.active', mr: 1 }} />
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Role & Status Info */}
                  <Grid item xs={12}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Role:</strong> {userDetails?.role?.toUpperCase() || 'EMPLOYEE'} | 
                        <strong> Status:</strong> {userDetails?.isVerified ? ' Verified' : ' Pending Verification'} |
                        <strong> Employment:</strong> {userDetails?.isFired ? ' Inactive' : ' Active'}
                        {userDetails?.role === 'employee' && (
                          <><br /><strong>Note:</strong> Contact HR to update your salary or role information</>
                        )}
                      </Typography>
                    </Alert>
                  </Grid>

                  {/* Form Actions */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => reset()}
                        startIcon={<Cancel />}
                        disabled={loading}
                      >
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Update Profile'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Photo URL Dialog */}
      <Dialog open={photoDialogOpen} onClose={() => setPhotoDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Enter Photo URL</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Photo URL"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            sx={{ mt: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Enter a direct link to your profile photo
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePhotoUrlSubmit} variant="contained">
            Update Photo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profile Tips */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Profile Tips
        </Typography>
        <Typography variant="body2" component="ul">
          <li>Keep your profile information up to date for accurate records</li>
          <li>Add a professional photo to help colleagues identify you</li>
          <li>Ensure your bank account number is correct for salary payments</li>
          <li>Contact HR if you need to update your role or verification status</li>
          <li>Your email address is linked to your account and cannot be changed</li>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProfileUpdate;
