import React from 'react';
import { Box, Typography, Avatar, Paper, Grid, Button } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

const portfolios = [
  {
    name: 'Dr.Nudrat Fatima',
    title: 'Consultant Homoeopath',
    image: '/Drnudrat.png',
    bio: 'Dr Nudrat Fatima is well Experienced Homoeopath  specializing in Female complaints , paediatric cases . Treats Holistically and Enthisiastically .',
    email: 'drazadhomoeopathy@gmail.com',
    phone: '+91-9891188330',
    Address: 'F- 50/1 shaheen bagh , Abul Fazal Enclave, Jamia Nagar, Okhla, New Delhi - 110025',
  },
  {
    name: 'Dr. Tarique Azad',
    title: 'Senior Consultant',
    image: '/docimage.png',
    bio: 'Dr Azad is Highly experienced Doctor practising since last 10 years Has an expertise in Acute , chronic, Life style disorder,Paediatrics and Geriatric cases.',
    email: 'drazadhomoeopathy@gmail.com',
    phone: '+91-9953314336',
    Address: '159, Street Number 19, Jogabai Extension, Zakir Nagar, Okhla, New Delhi,New Delhi - 110025',
  },
];

const PortfolioSection = () => (
  <Box sx={{ my: 6 }}>
    <Typography variant="h3" align="center" gutterBottom sx={{ color: 'green', fontWeight: 700 }}>
      Meet Our Doctors
    </Typography>
    <Grid container spacing={4} justifyContent="center">
      {portfolios.map((doc, idx) => (
        <Grid item xs={12} md={5} key={idx}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4, bgcolor: 'white', border: '2px solid #43a047' }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar src={doc.image} alt={doc.name} sx={{ width: 120, height: 120, mb: 2, border: '4px solid #43a047' }} />
              <Typography variant="h5" sx={{ color: '#388e3c', fontWeight: 600 }}>{doc.name}</Typography>
              <Typography variant="subtitle1" sx={{ color: '#2e7d32', mb: 2 }}>{doc.title}</Typography>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>{doc.bio}</Typography>
              <Typography variant="body2" align="center" sx={{ mb: 2, color: '#388e3c', fontWeight: 500 }}>
                <strong>Clinic Address:</strong> {doc.Address}
              </Typography>
              <Box display="flex" gap={2} mt={2}>
                <Button href={`mailto:${doc.email}`} color="success" startIcon={<Email />}>
                  Email
                </Button>
                <Button href={undefined} color="success" startIcon={<LocationOn />}>
                  New Delhi,New Delhi - 110025
                </Button>
                <Button href={`tel:${doc.phone}`} color="success" startIcon={<Phone />}>
                  Call
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default PortfolioSection;
