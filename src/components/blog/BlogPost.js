import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Paper
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import moment from 'moment';
import api from '../../services/api';
import Comment from './Comment';
import CommentForm from './CommentForm';
import AuthorProfile from './AuthorProfile';
import { useAuth } from '../../contexts/AuthContext';

const BlogPost = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    image: null,
  });
  const isDoctor = user?.role === 'DOCTOR';

  useEffect(() => {
    loadBlogPosts();
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog/');
      const data = await response.json();
      setPosts(data.results || []);
    } catch (err) {
      // setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/blog/posts/${slug}/`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('content', newPost.content);
      if (newPost.image) {
        formData.append('image', newPost.image);
      }

      const response = await fetch('/api/blog/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      setOpen(false);
      loadBlogPosts();
    } catch (err) {
      setError('Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewPost({ ...newPost, image: e.target.files[0] });
    }
  };

  const handleCommentSubmit = async (commentData) => {
    try {
      const response = await api.post('/api/blog/comments/', commentData);
      setPost((prev) => ({
        ...prev,
        comments: [...prev.comments, response.data],
      }));
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (loading) return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography>Loading...</Typography>
    </Container>
  );
  
  if (error) return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
        {error}
      </Alert>
    </Container>
  );

  if (!post && !loading) return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" py={4}>
        <Typography variant="h5" gutterBottom>
          Post not found
        </Typography>
        <Button component={Link} to="/blog" variant="contained" color="primary" sx={{ mt: 2 }}>
          Back to Blog
        </Button>
      </Box>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {post?.image && (
            <Paper sx={{ mb: 3 }}>
              <img
                src={post.image}
                alt={post.title}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
              />
            </Paper>
          )}
          
          <Typography variant="h4" component="h1" gutterBottom>
            {post?.title}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Published {moment(post?.created_at).format('MMMM D, YYYY')}
          </Typography>

          <Typography
            variant="body1"
            sx={{ mt: 3 }}
            dangerouslySetInnerHTML={{ __html: post?.content }}
          />

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Comments
          </Typography>

          {isAuthenticated ? (
            <CommentForm postId={post?.id} onCommentSubmit={handleCommentSubmit} />
          ) : (
            <Alert severity="info" sx={{ mb: 3 }}>
              Please <Link to="/login">login</Link> to leave a comment
            </Alert>
          )}

          <Box sx={{ mt: 4 }}>
            {post?.comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
            {post?.comments.length === 0 && (
              <Typography color="text.secondary">
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <AuthorProfile author={post?.author} showDetails={true} />
          
          {isDoctor && (
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<AddIcon />}
                component={Link}
                to="/blog/create"
              >
                Write New Post
              </Button>
            </Box>
          )}

          {post?.author?.id === user?.id && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                color="primary"
                component={Link}
                to={`/blog/edit/${post.slug}`}
              >
                Edit Post
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default BlogPost;
