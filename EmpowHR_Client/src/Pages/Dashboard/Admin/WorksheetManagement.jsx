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
  Avatar,
  TablePagination
} from '@mui/material';
import {
  Assignment,
  Edit,
  Delete,
  Add,
  FilterList,
  Search,
  Download,
  Visibility
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

const WorksheetManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedTask, setSelectedTask] = useState('all');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedWorksheet, setSelectedWorksheet] = useState(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch all employees
  const { data: employees = [] } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      return response.data;
    }
  });

  // Fetch all worksheets
  const { data: allWorksheets = [], isLoading } = useQuery({
    queryKey: ['all-worksheets-admin'],
    queryFn: async () => {
      const worksheets = [];
      for (const employee of employees) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/worksheets/${employee.email}`);
          worksheets.push(...response.data.map(w => ({ 
            ...w, 
            employeeName: employee.name, 
            employeeRole: employee.role,
            employeePhoto: employee.photo 
          })));
        } catch (error) {
          console.warn(`Could not fetch worksheets for ${employee.email}`);
        }
      }
      return worksheets.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    enabled: employees.length > 0
  });

  // Update worksheet mutation
  const updateWorksheetMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/worksheets/${selectedWorksheet._id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Worksheet updated successfully!');
      queryClient.invalidateQueries(['all-worksheets-admin']);
      setEditDialogOpen(false);
      reset();
    },
    onError: () => {
      toast.error('Failed to update worksheet');
    }
  });

  // Delete worksheet mutation
  const deleteWorksheetMutation = useMutation({
    mutationFn: async (worksheetId) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/worksheets/${worksheetId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Worksheet deleted successfully!');
      queryClient.invalidateQueries(['all-worksheets-admin']);
    },
    onError: () => {
      toast.error('Failed to delete worksheet');
    }
  });

  // Filter worksheets
  const filteredWorksheets = allWorksheets.filter(worksheet => {
    if (selectedEmployee !== 'all' && worksheet.email !== selectedEmployee) return false;
    if (selectedTask !== 'all' && worksheet.task !== selectedTask) return false;
    return true;
  });

  // Paginated worksheets
  const paginatedWorksheets = filteredWorksheets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const taskTypes = [
    'Sales', 'Support', 'Content Writing', 'Video Editing', 
    'Marketing', 'Development', 'Research'
  ];

  const handleEdit = (worksheet) => {
    setSelectedWorksheet(worksheet);
    reset({
      task: worksheet.task,
      hours: worksheet.hours,
      date: new Date(worksheet.date).toISOString().split('T')[0]
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (worksheetId) => {
    if (window.confirm('Are you sure you want to delete this worksheet entry?')) {
      deleteWorksheetMutation.mutate(worksheetId);
    }
  };

  const onSubmit = (data) => {
    updateWorksheetMutation.mutate(data);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Statistics
  const stats = {
    totalWorksheets: filteredWorksheets.length,
    totalHours: filteredWorksheets.reduce((sum, w) => sum + w.hours, 0),
    avgHours: filteredWorksheets.length > 0 ? 
      (filteredWorksheets.reduce((sum, w) => sum + w.hours, 0) / filteredWorksheets.length).toFixed(1) : 0,
    activeEmployees: new Set(filteredWorksheets.map(w => w.email)).size
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Assignment color="primary" />
            <Box>
              <Typography variant="h6">Worksheet Management</Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor and manage all employee worksheets
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button startIcon={<Download />} variant="outlined">
              Export
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Assignment color="primary" />
                <Box>
                  <Typography variant="h4" color="primary">
                    {stats.totalWorksheets}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Worksheets
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Assignment color="success" />
                <Box>
                  <Typography variant="h4" color="success.main">
                    {stats.totalHours}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Hours
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Assignment color="warning" />
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {stats.avgHours}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Hours
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Assignment color="info" />
                <Box>
                  <Typography variant="h4" color="info.main">
                    {stats.activeEmployees}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Employees
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Employee</InputLabel>
              <Select
                value={selectedEmployee}
                label="Employee"
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <MenuItem value="all">All Employees</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp.email} value={emp.email}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Task Type</InputLabel>
              <Select
                value={selectedTask}
                label="Task Type"
                onChange={(e) => setSelectedTask(e.target.value)}
              >
                <MenuItem value="all">All Tasks</MenuItem>
                {taskTypes.map((task) => (
                  <MenuItem key={task} value={task}>
                    {task}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSelectedEmployee('all');
                setSelectedTask('all');
                setPage(0);
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Worksheets Table */}
      <Paper>
        {isLoading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Loading worksheets...
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Task</TableCell>
                    <TableCell align="right">Hours</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedWorksheets.map((worksheet) => (
                    <TableRow key={worksheet._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={worksheet.employeePhoto} sx={{ width: 32, height: 32 }}>
                            {worksheet.employeeName?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {worksheet.employeeName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {worksheet.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={worksheet.task} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          {worksheet.hours}h
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(worksheet.date)}</TableCell>
                      <TableCell>{formatDate(worksheet.createdAt)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(worksheet)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(worksheet._id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredWorksheets.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </>
        )}
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Worksheet</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="task"
                  control={control}
                  rules={{ required: 'Task is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.task}>
                      <InputLabel>Task Type</InputLabel>
                      <Select {...field} label="Task Type">
                        {taskTypes.map((task) => (
                          <MenuItem key={task} value={task}>
                            {task}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="hours"
                  control={control}
                  rules={{ required: 'Hours is required', min: 1, max: 24 }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Hours"
                      type="number"
                      error={!!errors.hours}
                      helperText={errors.hours?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: 'Date is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.date}
                      helperText={errors.date?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit(onSubmit)}
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

export default WorksheetManagement;
