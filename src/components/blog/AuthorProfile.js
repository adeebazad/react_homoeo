import React from 'react';
import { Box, Typography, Avatar, Paper, Chip } from '@mui/material';
import { LocalHospital, Person } from '@mui/icons-material';

const AuthorProfile = ({ author, showDetails = false }) => {
  if (!author) return null;

  // fallback for missing names
  const firstName = author.first_name || author.username || 'Doctor';
  const lastName = author.last_name || '';

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box display="flex" alignItems="center">
        <Avatar 
          sx={{ 
            width: showDetails ? 64 : 40, 
            height: showDetails ? 64 : 40,
            bgcolor: author.role === 'DOCTOR' ? 'primary.main' : 'secondary.main',
            mr: 2 
          }}
        >
          {author.role === 'DOCTOR' ? <LocalHospital /> : <Person />}
        </Avatar>
        <Box>
          <Typography variant={showDetails ? "h6" : "subtitle1"}>
            {author.role === 'DOCTOR' ? `Dr. ${firstName} ${lastName}` : `${firstName} ${lastName}`}
          </Typography>
          <Chip
            size="small"
            color={author.role === 'DOCTOR' ? 'primary' : 'secondary'}
            label={author.role === 'DOCTOR' ? 'Doctor' : 'Patient'}
            sx={{ mt: 0.5 }}
          />
          {showDetails && author.role === 'DOCTOR' && author.specialization && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Specialization: {author.specialization}
            </Typography>
          )}
          {showDetails && author.bio && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {author.bio}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default AuthorProfile;
