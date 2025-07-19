import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { patientService } from '../../services/patient.service';
import { useAuth } from '../../contexts/AuthContext';

const UpdateRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const isDoctor = user?.role === 'DOCTOR';

  useEffect(() => {
    loadUpdateRequests();
  }, []);

  const loadUpdateRequests = async () => {
    try {
      setLoading(true);
      const data = await patientService.getUpdateRequests();
      setRequests(data.results || []);
    } catch (err) {
      setError('Failed to load update requests');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleApprove = async () => {
    try {
      await patientService.approveUpdateRequest(selectedRequest.id);
      setSuccess('Update request approved successfully');
      setDialogOpen(false);
      loadUpdateRequests();
    } catch (err) {
      setError('Failed to approve update request');
    }
  };

  const handleReject = async () => {
    try {
      await patientService.rejectUpdateRequest(selectedRequest.id);
      setSuccess('Update request rejected successfully');
      setDialogOpen(false);
      loadUpdateRequests();
    } catch (err) {
      setError('Failed to reject update request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'success.main';
      case 'REJECTED':
        return 'error.main';
      default:
        return 'warning.main';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Update Requests
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Field</TableCell>
                  <TableCell>Current Value</TableCell>
                  <TableCell>Requested Value</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.patient_name}</TableCell>
                    <TableCell>{request.field_name}</TableCell>
                    <TableCell>{request.current_value}</TableCell>
                    <TableCell>{request.requested_value}</TableCell>
                    <TableCell>
                      <Typography color={getStatusColor(request.status)}>
                        {request.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {request.status === 'PENDING' && isDoctor && (
                        <Button
                          variant="outlined"
                          onClick={() => handleViewRequest(request)}
                        >
                          Review
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Review Update Request</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Patient: {selectedRequest.patient_name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Field: {selectedRequest.field_name}
              </Typography>
              <TextField
                fullWidth
                label="Current Value"
                value={selectedRequest.current_value}
                multiline
                rows={2}
                sx={{ mb: 2 }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                label="Requested Value"
                value={selectedRequest.requested_value}
                multiline
                rows={2}
                sx={{ mb: 2 }}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                label="Reason"
                value={selectedRequest.reason}
                multiline
                rows={3}
                InputProps={{ readOnly: true }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleReject} color="error">
            Reject
          </Button>
          <Button onClick={handleApprove} color="primary" variant="contained">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UpdateRequests;
