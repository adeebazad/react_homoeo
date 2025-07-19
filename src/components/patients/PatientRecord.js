import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { patientService } from '../../services/patient.service';
import { useAuth } from '../../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const PatientRecord = () => {
  const { user } = useAuth();
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [updateRequest, setUpdateRequest] = useState({
    field_name: '',
    current_value: '',
    requested_value: '',
    reason: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Redirect doctors without patientId to all-patient-records
    if (user?.role === 'DOCTOR' && !patientId) {
      navigate('/all-patient-records', { replace: true });
      return;
    }
    loadPatientRecord();
    // eslint-disable-next-line
  }, [patientId, user]);

  const loadPatientRecord = async () => {
    try {
      let data;
      if (user?.role === 'DOCTOR' && patientId) {
        data = await patientService.getPatientRecordById(patientId);
      } else {
        data = await patientService.getPatientRecord();
      }
      if (data.results && data.results.length > 0) {
        setRecord(data.results[0]);
      } else if (data && data.id) {
        setRecord(data);
      }
    } catch (err) {
      setError('Failed to load patient record');
    }
  };

  const handleUpdateRequest = async (fieldName) => {
    try {
      const currentValue = record[fieldName] || 'Not specified';
      await patientService.createUpdateRequest({
        field_name: fieldName,
        current_value: currentValue,
        requested_value: updateRequest.requested_value,
        reason: updateRequest.reason,
      });
      setSuccess('Update request submitted successfully');
      setUpdateRequest({
        field_name: '',
        current_value: '',
        requested_value: '',
        reason: '',
      });
    } catch (err) {
      setError('Failed to submit update request');
    }
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  if (user?.role !== 'PATIENT' && user?.role !== 'DOCTOR') {
    return (
      <Alert severity="error">
        Access denied. Only patients and doctors can view medical records.
      </Alert>
    );
  }

  if (!record) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Medical Record
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Blood Group</Typography>
            <Typography>{record.blood_group || 'Not specified'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Allergies</Typography>
            <Typography>{record.allergies || 'None reported'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Medical History</Typography>
            <Typography>{record.medical_history || 'No history recorded'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Current Medications</Typography>
            <Typography>
              {record.current_medications || 'No current medications'}
            </Typography>
          </Grid>
        </Grid>

        {/* Only patients can request updates */}
        {user.role === 'PATIENT' && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Request Update
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Value"
                  value={updateRequest.requested_value}
                  onChange={(e) =>
                    setUpdateRequest({
                      ...updateRequest,
                      requested_value: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason for Update"
                  multiline
                  rows={4}
                  value={updateRequest.reason}
                  onChange={(e) =>
                    setUpdateRequest({ ...updateRequest, reason: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={() => handleUpdateRequest('medical_history')}
                >
                  Submit Update Request
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PatientRecord;
