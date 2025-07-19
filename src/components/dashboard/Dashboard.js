import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  CardMedia,
} from '@mui/material';
import {
  CalendarMonth,
  MedicalInformation,
  ArticleOutlined,
  Person,
  Update,
  AdminPanelSettings,
} from '@mui/icons-material';

const DashboardCard = ({ title, description, icon, onClick }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        {icon}
      </Box>
      <Typography gutterBottom variant="h5" component="h2" align="center">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        {description}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" fullWidth onClick={onClick}>
        Access
      </Button>
    </CardActions>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDoctor = user?.role === 'DOCTOR';

  const commonFeatures = [
    {
      title: 'Blog Posts',
      description: 'Read health tips and medical articles',
      icon: <ArticleOutlined sx={{ fontSize: 40 }} />,
      onClick: () => navigate('/blog'),
    },
    {
      title: 'Appointments',
      description: isDoctor ? 'View and manage appointments' : 'Schedule and manage your appointments',
      icon: <CalendarMonth sx={{ fontSize: 40 }} />,
      onClick: () => navigate('/appointments'),
    },
    {
      title: 'Medical Records',
      description: isDoctor ? 'View patient records' : 'View your medical history',
      icon: <MedicalInformation sx={{ fontSize: 40 }} />,
      onClick: () => navigate('/medical-records'),
    },
  ];

  const doctorFeatures = [
    {
      title: 'Update Requests',
      description: 'Review and manage patient update requests',
      icon: <Update sx={{ fontSize: 40 }} />,
      onClick: () => navigate('/update-requests'),
    },
    {
      title: 'Write Blog',
      description: 'Create and manage blog posts',
      icon: <ArticleOutlined sx={{ fontSize: 40 }} />,
      onClick: () => navigate('/blog/create'),
    },
    {
      title: 'Admin Panel',
      description: 'Access administrative controls',
      icon: <AdminPanelSettings sx={{ fontSize: 40 }} />,
      onClick: () => navigate('/admin'),
    },
  ];

  const patientFeatures = [
    {
      title: 'Profile',
      description: 'Update your personal information',
      icon: <Person sx={{ fontSize: 40 }} />,
      onClick: () => navigate('/profile'),
    },
  ];

  const features = isDoctor 
    ? [...commonFeatures, ...doctorFeatures]
    : [...commonFeatures, ...patientFeatures];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Welcome, {user?.first_name || 'User'}
      </Typography>
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <DashboardCard {...feature} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
