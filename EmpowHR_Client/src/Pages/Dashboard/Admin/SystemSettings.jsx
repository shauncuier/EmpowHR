import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import {
  Settings,
  Security,
  Notifications,
  Storage,
  Backup,
  Update,
  Warning,
  CheckCircle,
  Info,
  Save,
  RestartAlt
} from '@mui/icons-material';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    autoBackup: true,
    emailNotifications: true,
    systemMaintenance: false,
    debugMode: false,
    autoApproval: false,
    publicRegistration: true,
    maxFileSize: '10',
    sessionTimeout: '60',
    backupFrequency: 'daily'
  });

  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  const handleTextSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.value
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
    // toast.success('Settings saved successfully!');
  };

  const handleBackup = () => {
    // In a real app, this would trigger a backup
    console.log('Starting backup...');
    setBackupDialogOpen(false);
    // toast.success('Backup started successfully!');
  };

  const handleMaintenance = () => {
    // In a real app, this would enable maintenance mode
    console.log('Enabling maintenance mode...');
    setMaintenanceDialogOpen(false);
    setSettings(prev => ({ ...prev, systemMaintenance: true }));
    // toast.warning('System maintenance mode enabled');
  };

  const systemStatus = [
    { label: 'Database Connection', status: 'healthy', icon: <Storage color="success" /> },
    { label: 'API Services', status: 'healthy', icon: <CheckCircle color="success" /> },
    { label: 'File Storage', status: 'healthy', icon: <Backup color="success" /> },
    { label: 'Email Service', status: 'warning', icon: <Warning color="warning" /> },
    { label: 'Payment Gateway', status: 'healthy', icon: <Security color="success" /> }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Settings color="primary" />
            <Box>
              <Typography variant="h6">System Settings</Typography>
              <Typography variant="body2" color="text.secondary">
                Configure system preferences and maintenance options
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* System Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <List>
              {systemStatus.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  <ListItemSecondaryAction>
                    <Chip
                      label={item.status.toUpperCase()}
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Auto Backup"
                  secondary="Automatically backup data daily"
                />
                <ListItemSecondaryAction>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoBackup}
                        onChange={handleSettingChange('autoBackup')}
                      />
                    }
                    label=""
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Send system notifications via email"
                />
                <ListItemSecondaryAction>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={handleSettingChange('emailNotifications')}
                      />
                    }
                    label=""
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Public Registration"
                  secondary="Allow public user registration"
                />
                <ListItemSecondaryAction>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.publicRegistration}
                        onChange={handleSettingChange('publicRegistration')}
                      />
                    }
                    label=""
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Auto Approval"
                  secondary="Automatically approve new employees"
                />
                <ListItemSecondaryAction>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoApproval}
                        onChange={handleSettingChange('autoApproval')}
                      />
                    }
                    label=""
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Session Timeout (minutes)"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={handleTextSettingChange('sessionTimeout')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Max File Size (MB)"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={handleTextSettingChange('maxFileSize')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.debugMode}
                      onChange={handleSettingChange('debugMode')}
                    />
                  }
                  label="Debug Mode"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Maintenance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Maintenance
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Backup />}
                  onClick={() => setBackupDialogOpen(true)}
                >
                  Manual Backup
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  startIcon={<Warning />}
                  onClick={() => setMaintenanceDialogOpen(true)}
                >
                  Enable Maintenance Mode
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<RestartAlt />}
                >
                  Restart System
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Alerts */}
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>System Information:</strong> EmpowHR v1.0.0 | 
              Database: MongoDB | Server: Node.js | 
              Last Backup: {new Date().toLocaleDateString()}
            </Typography>
          </Alert>
          
          {settings.systemMaintenance && (
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>Maintenance Mode Active:</strong> The system is currently in maintenance mode. 
                New user registrations and some features may be disabled.
              </Typography>
            </Alert>
          )}
        </Grid>

        {/* Environment Variables */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Environment Configuration
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="API URL"
                  value="http://localhost:3000"
                  disabled
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Frontend URL"
                  value="http://localhost:5173"
                  disabled
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Database"
                  value="MongoDB (localhost:27017)"
                  disabled
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Environment"
                  value="Development"
                  disabled
                  size="small"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Backup Dialog */}
      <Dialog open={backupDialogOpen} onClose={() => setBackupDialogOpen(false)}>
        <DialogTitle>Manual Backup</DialogTitle>
        <DialogContent>
          <Typography>
            This will create a backup of all system data including users, worksheets, 
            and payment records. The backup will be stored securely and can be used 
            for system restoration if needed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackupDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBackup} variant="contained">
            Start Backup
          </Button>
        </DialogActions>
      </Dialog>

      {/* Maintenance Dialog */}
      <Dialog open={maintenanceDialogOpen} onClose={() => setMaintenanceDialogOpen(false)}>
        <DialogTitle>Enable Maintenance Mode</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography>
              <strong>Warning:</strong> Enabling maintenance mode will:
            </Typography>
            <ul>
              <li>Disable new user registrations</li>
              <li>Show maintenance message to users</li>
              <li>Restrict access to certain features</li>
              <li>Only admins will have full access</li>
            </ul>
          </Alert>
          <Typography>
            Are you sure you want to enable maintenance mode?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMaintenanceDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleMaintenance} variant="contained" color="warning">
            Enable Maintenance
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SystemSettings;
