import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent,
  CardMedia, 
  Typography, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Alert,
  Divider
} from '@mui/material';
import AuthorProfile from './AuthorProfile';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../../services/api';
import moment from 'moment';
import { useAuth } from '../../contexts/AuthContext';
import PortfolioSection from '../portfolio/PortfolioSection';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const isDoctor = user?.role === 'DOCTOR';

  useEffect(() => {
    fetchPosts();
  }, [statusFilter, sortBy]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let url = '/api/blog/posts/?page_size=10&';
      if (statusFilter !== 'all') {
        url += `status=${statusFilter}&`;
      }
      if (sortBy === 'oldest') {
        url += 'ordering=created_at';
      } else {
        url += 'ordering=-created_at';
      }
      if (isDoctor) {
        url += `&author=${user.id}`;
      }
      const response = await api.get(url);
      setPosts(response.data.results || []);
    } catch (error) {
      setError('Failed to fetch blog posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography>Loading...</Typography>
    </Container>
  );

  if (error) return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
        {error}
      </Alert>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#e8f5e9', minHeight: '100vh' }}>
      <PortfolioSection />

      {/* DEBUG: Show current user object */}
      {/* <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', border: '1px solid #eee', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Debug user object: {JSON.stringify(user)}
        </Typography>
      </Box> */}

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" component="h1">
              Health Blog
            </Typography>
          </Grid>
          {isDoctor && (
            <Grid item>
              <Button
                component={Link}
                to="/blog/create"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
              >
                Create Post
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search posts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          {isDoctor && (
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Filter by status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="PUBLISHED">Published</MenuItem>
                  <MenuItem value="DRAFT">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {filteredPosts.length > 0 ? (
        <Grid container spacing={4}>
          {filteredPosts.map(post => (
            <Grid item xs={12} md={6} key={post.id}>
              <Card 
                component={Link} 
                to={`/blog/${post.slug}`}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  textDecoration: 'none',
                  '&:hover': {
                    boxShadow: 6
                  }
                }}
              >
                {post.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image}
                    alt={post.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AuthorProfile author={post.author} />
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {moment(post.created_at).format('MMMM D, YYYY')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {post.summary || post.content.substring(0, 150)}...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm 
              ? "No posts found matching your search."
              : isDoctor 
                ? "You haven't created any blog posts yet."
                : "No blog posts available at the moment."
            }
          </Typography>
          {isDoctor && (
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              component={Link}
              to="/blog/create"
              sx={{ mt: 2 }}
            >
              Create Your First Post
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
};

export default BlogList;