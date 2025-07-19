import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const CommentForm = ({ postId, onCommentSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim()) {
      await onCommentSubmit({ content, post: postId });
      setContent('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        label="Write a comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!content.trim()}
      >
        Post Comment
      </Button>
    </Box>
  );
};

export default CommentForm;
