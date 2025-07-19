import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user, checkAuth } = useAuth();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    date_of_birth: '',
    email: '',
  });
  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        date_of_birth: user.date_of_birth || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.patch('/api/accounts/profile/', form);
      setSuccess('Profile updated successfully!');
      checkAuth();
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.patch('/api/accounts/profile/', { email: form.email });
      setSuccess('Email updated successfully!');
      checkAuth();
    } catch (err) {
      setError('Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwords.new_password !== passwords.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/accounts/change-password/', {
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      });
      setSuccess('Password updated successfully!');
      setPasswords({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <CircularProgress />;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Profile</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleProfileUpdate}>
          <TextField fullWidth label="First Name" name="first_name" value={form.first_name} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Address" name="address" value={form.address} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Date of Birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mb: 2 }}>Update Profile</Button>
        </form>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Change Email</Typography>
          <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} sx={{ mb: 2 }} />
          <Button variant="outlined" color="primary" fullWidth onClick={handleEmailUpdate} disabled={loading}>Update Email</Button>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Change Password</Typography>
          <TextField fullWidth label="Old Password" name="old_password" type="password" value={passwords.old_password} onChange={handlePasswordChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="New Password" name="new_password" type="password" value={passwords.new_password} onChange={handlePasswordChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Confirm New Password" name="confirm_password" type="password" value={passwords.confirm_password} onChange={handlePasswordChange} sx={{ mb: 2 }} />
          <Button variant="outlined" color="primary" fullWidth onClick={handlePasswordUpdate} disabled={loading}>Update Password</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
