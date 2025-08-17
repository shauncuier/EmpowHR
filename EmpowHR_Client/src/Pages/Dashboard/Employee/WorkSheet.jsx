import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../../Context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const WorkSheet = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      task: '',
      hours: '',
      date: new Date()
    }
  });

  const { control: editControl, handleSubmit: handleEditSubmit, setValue, formState: { errors: editErrors } } = useForm();

  // Fetch worksheets
  const { data: worksheets = [], isLoading } = useQuery({
    queryKey: ['worksheets', user?.email],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/worksheets/${user.email}`);
      return response.data;
    },
    enabled: !!user?.email
  });

  // Add worksheet mutation
  const addWorksheetMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/worksheets`, {
        email: user.email,
        ...data
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['worksheets']);
      toast.success('Work entry added successfully!');
      reset();
    },
    onError: () => {
      toast.error('Failed to add work entry');
    }
  });

  // Update worksheet mutation
  const updateWorksheetMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/worksheets/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['worksheets']);
      toast.success('Work entry updated successfully!');
      setEditDialogOpen(false);
      setEditingItem(null);
    },
    onError: () => {
      toast.error('Failed to update work entry');
    }
  });

  // Delete worksheet mutation
  const deleteWorksheetMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/worksheets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['worksheets']);
      toast.success('Work entry deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete work entry');
    }
  });

  const onSubmit = (data) => {
    addWorksheetMutation.mutate(data);
  };

  const onEditSubmit = (data) => {
    updateWorksheetMutation.mutate({
      id: editingItem._id,
      data
    });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setValue('task', item.task);
    setValue('hours', item.hours);
    setValue('date', new Date(item.date));
    setEditDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this work entry?')) {
      deleteWorksheetMutation.mutate(id);
    }
  };

  const taskOptions = [
    'Sales',
    'Support',
    'Content',
    'Paper-work'
  ];

  return (
    <Box>
      {/* Add Work Entry Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add Work Entry
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth error={!!errors.task}>
                <InputLabel>Task Type</InputLabel>
                <Controller
                  name="task"
                  control={control}
                  rules={{ required: 'Task is required' }}
                  render={({ field }) => (
                    <Select {...field} label="Task Type">
                      {taskOptions.map((task) => (
                        <MenuItem key={task} value={task}>
                          {task}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.task && (
                  <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                    {errors.task.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
              <Controller
                name="hours"
                control={control}
                rules={{ 
                  required: 'Hours is required',
                  min: { value: 0.5, message: 'Minimum 0.5 hours' },
                  max: { value: 24, message: 'Maximum 24 hours' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Hours Worked"
                    type="number"
                    inputProps={{ step: 0.5, min: 0.5, max: 24 }}
                    error={!!errors.hours}
                    helperText={errors.hours?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Controller
                name="date"
                control={control}
                rules={{ required: 'Date is required' }}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    customInput={
                      <TextField
                        fullWidth
                        label="Date"
                        error={!!errors.date}
                        helperText={errors.date?.message}
                      />
                    }
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Add />}
                fullWidth
                disabled={addWorksheetMutation.isPending}
              >
                {addWorksheetMutation.isPending ? 'Adding...' : 'Add'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Work Entries Table */}
      <Paper>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Work Entries
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : worksheets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No work entries found. Add your first entry above!
                  </TableCell>
                </TableRow>
              ) : (
                worksheets.map((worksheet) => (
                  <TableRow key={worksheet._id}>
                    <TableCell>{worksheet.task}</TableCell>
                    <TableCell>{worksheet.hours} hrs</TableCell>
                    <TableCell>
                      {new Date(worksheet.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEdit(worksheet)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(worksheet._id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Work Entry</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 1 }}>
            <FormControl fullWidth margin="normal" error={!!editErrors.task}>
              <InputLabel>Task Type</InputLabel>
              <Controller
                name="task"
                control={editControl}
                rules={{ required: 'Task is required' }}
                render={({ field }) => (
                  <Select {...field} label="Task Type">
                    {taskOptions.map((task) => (
                      <MenuItem key={task} value={task}>
                        {task}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <Controller
              name="hours"
              control={editControl}
              rules={{ 
                required: 'Hours is required',
                min: { value: 0.5, message: 'Minimum 0.5 hours' },
                max: { value: 24, message: 'Maximum 24 hours' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Hours Worked"
                  type="number"
                  margin="normal"
                  inputProps={{ step: 0.5, min: 0.5, max: 24 }}
                  error={!!editErrors.hours}
                  helperText={editErrors.hours?.message}
                />
              )}
            />

            <Controller
              name="date"
              control={editControl}
              rules={{ required: 'Date is required' }}
              render={({ field }) => (
                <Box sx={{ mt: 2 }}>
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    customInput={
                      <TextField
                        fullWidth
                        label="Date"
                        error={!!editErrors.date}
                        helperText={editErrors.date?.message}
                      />
                    }
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                  />
                </Box>
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleEditSubmit(onEditSubmit)} 
            variant="contained"
            disabled={updateWorksheetMutation.isPending}
          >
            {updateWorksheetMutation.isPending ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkSheet;
