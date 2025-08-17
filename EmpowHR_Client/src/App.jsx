import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Home from './Pages/Home/Home';
import About from './Pages/About/About';
import Login from './Auth/Login/Login';
import Register from './Auth/Register/Register';
import Contact from './Pages/Contact/Contact';
import Dashboard from './Pages/Dashboard/Dashboard';
import EmployeeDetails from './Pages/Dashboard/HR/EmployeeDetails';
import PaymentSuccess from './Pages/Dashboard/Admin/PaymentSuccess';
import PrivateRoute from './Components/PrivateRoute';
import PublicRoute from './Components/PublicRoute';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { useAuth } from './Context/AuthContext';
import ErrorPage from './Pages/Error/ErrorPage';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <Typography variant="h4">EmpowHR</Typography>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/payment-success"
              element={
                <PrivateRoute>
                  <PaymentSuccess />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/employee-details/:email"
              element={
                <PrivateRoute>
                  <EmployeeDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={
                <ErrorPage />
              }
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
