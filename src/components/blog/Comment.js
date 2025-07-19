import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import moment from 'moment';

const Comment = ({ comment }) => {
  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {comment.author_name} • {moment(comment.created_at).fromNow()}
      </Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        {comment.content}
      </Typography>
    </Card>
  );
};

export default Comment;
