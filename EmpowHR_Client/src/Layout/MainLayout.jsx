import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { Box } from '@mui/material';

const MainLayout = () => {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar />
            <Box component="main">
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
