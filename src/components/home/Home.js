import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Paper,
} from '@mui/material';
import {
  Healing,
  LocalHospital,
  PersonAdd,
  ArticleOutlined,
  CalendarMonth,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PortfolioSection from '../portfolio/PortfolioSection';
import { keyframes } from '@mui/system';
import HomeBlogPreview from './HomeBlogPreview';

// Animation for fade-in
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: none; }
`;

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Healing sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Holistic Treatment',
      description: 'Experience the power of natural healing with our homeopathic treatments',
    },
    {
      icon: <LocalHospital sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Expert Doctors',
      description: 'Qualified and experienced homeopathic practitioners',
    },
    {
      icon: <CalendarMonth sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Easy Appointments',
      description: 'Book your appointments online with our simple scheduling system',
    },
    {
      icon: <ArticleOutlined sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Health Blog',
      description: 'Stay informed with our latest health tips and articles',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure Records',
      description: 'Your medical records are safe and easily accessible',
    },
    {
      icon: <PersonAdd sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Easy Registration',
      description: 'Quick and simple registration process for new patients',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)', minHeight: '100vh', fontFamily: '"Quicksand", "Roboto", sans-serif' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: 380,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'url(/images/clinic-hero.jpg), url(/images/leaf-overlay.png) center/cover no-repeat',
          borderRadius: 4,
          mb: 6,
          overflow: 'hidden',
          animation: `${fadeIn} 1.2s ease`,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(56, 142, 60, 0.55)',
            zIndex: 1,
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff' }}>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, letterSpacing: 1, fontFamily: 'Quicksand, Roboto, sans-serif' }}>
            Welcome to Dr Azad Homoeopathic Clinic
          </Typography>
          <Typography variant="h5" sx={{ mb: 2, fontFamily: 'Quicksand, Roboto, sans-serif' }}>
            Healing with Care, Science, and Compassion
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 500, fontFamily: 'Quicksand, Roboto, sans-serif' }}>
            You’re in safe hands. Experience the power of holistic healing.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ borderRadius: 8, fontWeight: 700, px: 5, py: 1.5, fontSize: 20, boxShadow: '0 4px 24px 0 rgba(56, 142, 60, 0.18)' }}
            onClick={() => navigate('/appointments')}
          >
            Book Appointment
          </Button>
        </Box>
      </Box>
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                elevation={6}
                sx={{
                  borderRadius: 4,
                  p: 2,
                  minHeight: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: '#fff',
                  boxShadow: '0 4px 24px 0 rgba(56, 142, 60, 0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  animation: `${fadeIn} 1.2s ${0.2 + idx * 0.1}s both`,
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.03)',
                    boxShadow: '0 8px 32px 0 rgba(56, 142, 60, 0.18)',
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, mb: 1, fontFamily: 'Quicksand, Roboto, sans-serif' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" sx={{ fontFamily: 'Quicksand, Roboto, sans-serif' }}>
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <HomeBlogPreview />
      {/* Doctor Portfolio Section with highlight */}
      <Box sx={{ bgcolor: '#f1f8e9', py: 6, mt: 6 }}>
        <Container maxWidth="lg">
          <PortfolioSection />
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
