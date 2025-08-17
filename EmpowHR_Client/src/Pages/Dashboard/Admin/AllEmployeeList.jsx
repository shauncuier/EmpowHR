import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  ManageAccounts, 
  Edit, 
  Delete, 
  TrendingUp, 
  ViewList, 
  ViewModule,
  PersonOff,
  PersonAdd
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditUserDialog = ({ user, open, onClose }) => {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      role: 'employee',
      designation: '',
      salary: 25000,
      bank_account_no: '',
      isVerified: false,
      isFired: false
    }
  });

  // Update form values when user changes
  React.useEffect(() => {
    if (user && open) {
      setValue('name', user.name || '');
      setValue('role', user.role || 'employee');
      setValue('designation', user.designation || '');
      setValue('salary', user.salary || 25000);
      setValue('bank_account_no', user.bank_account_no || '');
      setValue('isVerified', user.isVerified || false);
      setValue('isFired', user.isFired || false);
    }
  }, [user, open, setValue]);

  const updateUserMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${user._id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('User updated successfully!');
      queryClient.invalidateQueries(['all-users']);
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  });

  const onSubmit = (data) => {
    updateUserMutation.mutate(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit User: {user?.name}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="role"
                control={control}
                rules={{ required: 'Role is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.role}>
                    <InputLabel>Role</InputLabel>
                    <Select {...field} label="Role">
                      <MenuItem value="employee">Employee</MenuItem>
                      <MenuItem value="hr">HR</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="designation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Designation"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="salary"
                control={control}
                rules={{ required: 'Salary is required', min: 1000 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Salary"
                    type="number"
                    error={!!errors.salary}
                    helperText={errors.salary?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="bank_account_no"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Bank Account Number"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="isVerified"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value || false} />}
                    label="Verified"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="isFired"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value || false} />}
                    label="Fired"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={updateUserMutation.isPending}
          startIcon={updateUserMutation.isPending ? <CircularProgress size={20} /> : <Edit />}
        >
          {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AllEmployeeList = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  // Fetch all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      return response.data;
    }
  });

  // Fire/Reinstate user mutation
  const fireUserMutation = useMutation({
    mutationFn: async ({ id, isFired }) => {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${id}/fire`, {
        isFired: !isFired
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-users']);
      toast.success('User status updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update user status');
    }
  });

  // Promote user mutation
  const promoteUserMutation = useMutation({
    mutationFn: async ({ id, newRole }) => {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${id}/promote`, {
        newRole
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['all-users']);
      toast.success('User promoted successfully!');
    },
    onError: () => {
      toast.error('Failed to promote user');
    }
  });

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleFireToggle = (user) => {
    fireUserMutation.mutate({
      id: user._id,
      isFired: user.isFired
    });
  };

  const handlePromote = (user, newRole) => {
    promoteUserMutation.mutate({
      id: user._id,
      newRole
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'hr': return 'warning';
      case 'employee': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Paper>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ManageAccounts color="primary" />
            <Box>
              <Typography variant="h6">
                All Employee Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage all users, roles, and employment status
              </Typography>
            </Box>
          </Box>
          <Box>
            <IconButton 
              onClick={() => setViewMode('table')} 
              color={viewMode === 'table' ? 'primary' : 'default'}
            >
              <ViewList />
            </IconButton>
            <IconButton 
              onClick={() => setViewMode('card')} 
              color={viewMode === 'card' ? 'primary' : 'default'}
            >
              <ViewModule />
            </IconButton>
          </Box>
        </Box>

        {isLoading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Loading users...
            </Typography>
          </Box>
        ) : users.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography variant="body1" color="text.secondary">
              No users found.
            </Typography>
          </Box>
        ) : viewMode === 'table' ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {user.photo && (
                          <img 
                            src={user.photo} 
                            alt={user.name} 
                            style={{ width: 40, height: 40, borderRadius: '50%' }}
                          />
                        )}
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {user.designation}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role.toUpperCase()} 
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(user.salary)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Chip
                          label={user.isVerified ? 'Verified' : 'Unverified'}
                          color={user.isVerified ? 'success' : 'default'}
                          size="small"
                        />
                        {user.isFired && (
                          <Chip
                            label="Fired"
                            color="error"
                            size="small"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color={user.isFired ? 'success' : 'error'}
                          startIcon={user.isFired ? <PersonAdd /> : <PersonOff />}
                          onClick={() => handleFireToggle(user)}
                        >
                          {user.isFired ? 'Rehire' : 'Fire'}
                        </Button>
                        {user.role === 'employee' && (
                          <Button
                            size="small"
                            startIcon={<TrendingUp />}
                            onClick={() => handlePromote(user, 'hr')}
                          >
                            Promote
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Grid container spacing={2} sx={{ p: 2 }}>
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      {user.photo && (
                        <img 
                          src={user.photo} 
                          alt={user.name} 
                          style={{ width: 50, height: 50, borderRadius: '50%' }}
                        />
                      )}
                      <Box>
                        <Typography variant="h6">{user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.designation}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={user.role.toUpperCase()} 
                        color={getRoleColor(user.role)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={user.isVerified ? 'Verified' : 'Unverified'}
                        color={user.isVerified ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(user.salary)}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color={user.isFired ? 'success' : 'error'}
                        onClick={() => handleFireToggle(user)}
                      >
                        {user.isFired ? 'Rehire' : 'Fire'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Edit User Dialog */}
      <EditUserDialog
        user={selectedUser}
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
      />

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {users.filter(u => u.role === 'employee').length}
              </Typography>
              <Typography variant="body2">Employees</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {users.filter(u => u.role === 'hr').length}
              </Typography>
              <Typography variant="body2">HR Personnel</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {users.filter(u => u.isVerified).length}
              </Typography>
              <Typography variant="body2">Verified</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {users.filter(u => u.isFired).length}
              </Typography>
              <Typography variant="body2">Fired</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AllEmployeeList;
