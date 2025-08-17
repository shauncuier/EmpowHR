import React from 'react';
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
  Chip,
  Pagination,
  Alert
} from '@mui/material';
import { useAuth } from '../../../Context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const PaymentHistory = () => {
  const { user } = useAuth();
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  // Fetch payment history
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments', user?.email],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/payments/${user.email}`);
      return response.data;
    },
    enabled: !!user?.email
  });

  // Sort payments by date (earliest first as per requirement)
  const sortedPayments = [...payments].sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate));

  // Pagination
  const totalPages = Math.ceil(sortedPayments.length / rowsPerPage);
  const paginatedPayments = sortedPayments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Paper>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Payment History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your monthly salary payment records (sorted by earliest payments first)
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Loading payment history...</Typography>
          </Box>
        ) : sortedPayments.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="info">
              No payment history found. Your payment records will appear here once HR processes your salary.
            </Alert>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month, Year</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Transaction ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPayments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {new Date(0, payment.month - 1).toLocaleString('en-US', { month: 'long' })} {payment.year}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {payment.paymentDate ? (
                            new Date(payment.paymentDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          ) : (
                            'Pending'
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium" color="primary.main">
                          {formatCurrency(payment.amount)}
                        </Typography>
                        <Chip
                          label={payment.status || 'paid'}
                          color={getStatusColor(payment.status || 'paid')}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {payment.transactionId}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Summary Card */}
      {sortedPayments.length > 0 && (
        <Paper sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Payments
              </Typography>
              <Typography variant="h6" color="primary.main">
                {sortedPayments.length}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Amount Received
              </Typography>
              <Typography variant="h6" color="success.main">
                {formatCurrency(
                  sortedPayments.reduce((sum, payment) => sum + payment.amount, 0)
                )}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Latest Payment
              </Typography>
              <Typography variant="h6">
                {sortedPayments.length > 0
                  ? new Date(sortedPayments[sortedPayments.length - 1].paymentDate || Date.now()).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })
                  : 'N/A'
                }
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default PaymentHistory;
