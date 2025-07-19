import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreateBlogPost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState({
    title: '',
    content: '',
    summary: '',
    status: 'DRAFT',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  // Redirect if not a doctor
  if (user?.role !== 'DOCTOR') {
    navigate('/blog');
    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPost({ ...post, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      if (!post.title.trim()) {
        setError('Title is required');
        return;
      }

      if (!post.content.trim()) {
        setError('Content is required');
        return;
      }

      const formData = new FormData();
      formData.append('title', post.title.trim());
      formData.append('content', post.content.trim());
      formData.append('summary', post.summary.trim());
      formData.append('status', post.status);
      
      if (post.image) {
        // Check file size (max 5MB)
        if (post.image.size > 5 * 1024 * 1024) {
          setError('Image size should be less than 5MB');
          return;
        }
        formData.append('image', post.image);
      }

      await api.post('/api/blog/posts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/blog');
    } catch (err) {
      if (err.response) {
        // Show full backend error message
        setError(JSON.stringify(err.response.data));
      } else if (err.response?.status === 403) {
        setError('Only doctors can create blog posts');
      } else {
        setError(err.message || 'Failed to create blog post');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Blog Post
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Title"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          required
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="Summary"
          value={post.summary}
          onChange={(e) => setPost({ ...post, summary: e.target.value })}
          multiline
          rows={2}
          helperText="A brief summary of your post (optional)"
          sx={{ mb: 3 }}
        />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Content
          </Typography>
          <ReactQuill
            theme="snow"
            value={post.content}
            onChange={value => setPost({ ...post, content: value })}
            style={{ minHeight: 200, marginBottom: 16 }}
          />
          <Button
            variant="text"
            onClick={() => setShowPreview(prev => !prev)}
            sx={{ mt: 1 }}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          {showPreview && (
            <Box sx={{ border: '1px solid #eee', p: 2, mt: 2, background: '#fafafa' }}>
              <Typography variant="h6" gutterBottom>Preview</Typography>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </Box>
          )}
        </Box>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={post.status}
            label="Status"
            onChange={(e) => setPost({ ...post, status: e.target.value })}
          >
            <MenuItem value="DRAFT">Draft</MenuItem>
            <MenuItem value="PUBLISHED">Published</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mb: 3 }}>
          <Button
            component="label"
            variant="outlined"
            sx={{ mb: 1 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          {imagePreview && (
            <Box sx={{ mt: 2 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '300px' }}
              />
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !post.title || !post.content}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Post'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/blog')}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateBlogPost;
