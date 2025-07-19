import React, { useEffect, useState } from 'react';
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
  CircularProgress,
  Alert,
  Button,
  Box
} from '@mui/material';
import { patientService } from '../../services/patient.service';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const PatientRecordList = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'DOCTOR') {
      fetchRecords();
    }
  }, [user]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await patientService.getAllPatientRecords();
      setRecords(data.results || data); // handle both paginated and non-paginated
    } catch (err) {
      setError('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'DOCTOR') {
    return <Alert severity="error">Access denied. Only doctors can view all patient records.</Alert>;
  }

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh"><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          All Patient Medical Records
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Blood Group</TableCell>
                <TableCell>Allergies</TableCell>
                <TableCell>Medical History</TableCell>
                <TableCell>Current Medications</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell>
                    <Link to={`/patient-record/${rec.patient}`}>{rec.patient_name || rec.patient || 'N/A'}</Link>
                  </TableCell>
                  <TableCell>{rec.blood_group || '-'}</TableCell>
                  <TableCell>{rec.allergies || '-'}</TableCell>
                  <TableCell>{rec.medical_history || '-'}</TableCell>
                  <TableCell>{rec.current_medications || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default PatientRecordList;
