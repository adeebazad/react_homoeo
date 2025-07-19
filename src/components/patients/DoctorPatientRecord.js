import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { patientService } from '../../services/patient.service';
import { useAuth } from '../../contexts/AuthContext';

const DoctorPatientRecord = () => {
  const { patientId } = useParams();
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'DOCTOR') {
      fetchRecord();
    }
  }, [user, patientId]);

  const fetchRecord = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await patientService.getPatientRecordById(patientId);
      setRecord(data);
    } catch (err) {
      setError('Failed to load patient record');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'DOCTOR') {
    return <Alert severity="error">Access denied. Only doctors can view this page.</Alert>;
  }

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!record) return <Typography>No record found.</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Patient Medical Record
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
            <Typography>{record.current_medications || 'No current medications'}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DoctorPatientRecord;
