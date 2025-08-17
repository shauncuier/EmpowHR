import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import toast from 'react-hot-toast';
import { Menu as MenuIcon, Dashboard, ContactMail, Person } from '@mui/icons-material';

const Navbar = () => {
    const { user, userDetails, logoutUser } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            toast.success('Logged out successfully!');
            navigate('/');
        } catch (error) {
            toast.error('Error logging out');
        }
        handleMenuClose();
    };

    const menuItems = [
        { label: 'Home', path: '/' },
        { label: 'Contact Us', path: '/contact' },
        ...(user ? [{ label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> }] : [])
    ];

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
            <Toolbar>
                {/* Logo */}
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        flexGrow: isMobile ? 1 : 0,
                        textDecoration: 'none',
                        color: 'inherit',
                        fontWeight: 'bold',
                        mr: 4
                    }}
                >
                    EmpowHR
                </Typography>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                        {menuItems.map((item) => (
                            <Button
                                key={item.path}
                                color="inherit"
                                component={Link}
                                to={item.path}
                                startIcon={item.icon}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                )}

                {/* Mobile Menu Button */}
                {isMobile && (
                    <IconButton
                        color="inherit"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                {/* Auth Buttons / User Profile */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {user ? (
                        <>
                            <Typography variant="body2" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
                                {user.displayName || userDetails?.name || 'User'}
                            </Typography>
                            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                                <Avatar
                                    alt={user.displayName || 'User'}
                                    src={user.photoURL || userDetails?.photo}
                                    sx={{ width: 40, height: 40 }}
                                />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
                                    <Dashboard sx={{ mr: 1 }} />
                                    Dashboard
                                </MenuItem>
                                <MenuItem onClick={() => { 
                                    if (userDetails?.role === 'admin') {
                                        navigate('/dashboard?tab=6'); // Profile tab for admin
                                    } else if (userDetails?.role === 'hr') {
                                        navigate('/dashboard?tab=2'); // Profile tab for HR
                                    } else {
                                        navigate('/dashboard?tab=2'); // Profile tab for employee
                                    }
                                    handleMenuClose(); 
                                }}>
                                    <Person sx={{ mr: 1 }} />
                                    Profile
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/login"
                                variant="outlined"
                                sx={{ borderColor: 'white', '&:hover': { borderColor: 'white' } }}
                            >
                                Login
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/register"
                                variant="contained"
                                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                            >
                                Register
                            </Button>
                        </Box>
                    )}
                </Box>
            </Toolbar>

            {/* Mobile Menu */}
            {isMobile && mobileMenuOpen && (
                <Box sx={{ bgcolor: 'primary.dark', p: 2 }}>
                    {menuItems.map((item) => (
                        <Button
                            key={item.path}
                            color="inherit"
                            component={Link}
                            to={item.path}
                            fullWidth
                            sx={{ justifyContent: 'flex-start', mb: 1 }}
                            startIcon={item.icon}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>
            )}
        </AppBar>
    );
};

export default Navbar;
