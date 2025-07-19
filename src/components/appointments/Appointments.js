import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { appointmentService } from '../../services/appointment.service';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [newAppointment, setNewAppointment] = useState({
    doctor: '',
    date: new Date(),
    time: new Date(),
    reason: '',
  });

  useEffect(() => {
    loadAppointments();
    loadDoctors();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments();
      setAppointments(data.results || []);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getDoctors();
      // Handle both paginated and non-paginated responses
      const doctorsList = response.results || response || [];
      setDoctors(Array.isArray(doctorsList) ? doctorsList : []);
    } catch (err) {
      setError('Failed to load doctors');
      console.error('Error loading doctors:', err);
      setDoctors([]); // Ensure doctors is always an array
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newAppointment.doctor) {
      errors.doctor = 'Please select a doctor';
    }
    if (!newAppointment.date) {
      errors.date = 'Please select a date';
    }
    if (!newAppointment.time) {
      errors.time = 'Please select a time';
    }
    if (!newAppointment.reason.trim()) {
      errors.reason = 'Please enter a reason for the appointment';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAppointment = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await appointmentService.createAppointment({
        doctor: newAppointment.doctor,
        date: newAppointment.date.toISOString().split('T')[0],
        time: newAppointment.time.toTimeString().split(' ')[0],
        reason: newAppointment.reason,
      });
      setSuccess('Appointment created successfully');
      setOpen(false);
      loadAppointments();
      // Reset form
      setNewAppointment({
        doctor: '',
        date: new Date(),
        time: new Date(),
        reason: '',
      });
      setFormErrors({});
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      setLoading(true);
      await appointmentService.cancelAppointment(id);
      setSuccess('Appointment cancelled successfully');
      loadAppointments();
    } catch (err) {
      setError('Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (value) => {
    setNewAppointment({ ...newAppointment, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: undefined });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Appointments</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            New Appointment
          </Button>
        </Box>

        {loading && <CircularProgress sx={{ display: 'block', m: 'auto' }} />}

        {!loading && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.doctor_name}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.status}</TableCell>
                    <TableCell>{appointment.reason}</TableCell>
                    <TableCell>
                      {appointment.status === 'PENDING' && (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleCancel(appointment.id)}
                        >
                          Cancel
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

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Appointment</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Doctor"
                value={newAppointment.doctor}
                onChange={(e) => handleInputChange('doctor')(e.target.value)}
                error={!!formErrors.doctor}
                helperText={formErrors.doctor || (doctors.length === 0 && 'Loading doctors...')}
                disabled={loading || doctors.length === 0}
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    Dr. {doctor.first_name} {doctor.last_name}
                  </MenuItem>
                ))}
              </TextField>
              {doctors.length === 0 && !loading && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  No doctors available
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={newAppointment.date}
                  onChange={handleInputChange('date')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formErrors.date}
                      helperText={formErrors.date}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Time"
                  value={newAppointment.time}
                  onChange={handleInputChange('time')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formErrors.time}
                      helperText={formErrors.time}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                multiline
                rows={4}
                value={newAppointment.reason}
                onChange={(e) => handleInputChange('reason')(e.target.value)}
                error={!!formErrors.reason}
                helperText={formErrors.reason}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateAppointment}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Appointments;
