import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Group, Article, MedicalInformation, EventNote } from '@mui/icons-material';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role !== 'ADMIN' && user?.role !== 'DOCTOR') {
    return <Alert severity="error">Access denied. Only admins and doctors can access the admin panel.</Alert>;
  }

  const features = [
    {
      title: 'Manage Users',
      description: 'View, edit, or remove users',
      icon: <Group sx={{ fontSize: 40 }} />,
      onClick: () => navigate('/admin-users'),
    },
    {
      title: 'Manage Blog Posts',
      description: 'View and moderate blog posts',
      icon: <Article sx={{ fontSize: 40 }} />,
      onClick: () => navigate('/blog'),
    },
    {
      title: 'Patient Records',
      description: 'View and manage all patient records',
      icon: <MedicalInformation sx={{ fontSize: 40 }} />,
      onClick: () => navigate('/all-patient-records'),
    },
    {
      title: 'Appointments',
      description: 'View and manage appointments',
      icon: <EventNote sx={{ fontSize: 40 }} />,
      onClick: () => navigate('/appointments'),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Admin Panel
      </Typography>
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" fullWidth onClick={feature.onClick}>
                  Access
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminPanel;
