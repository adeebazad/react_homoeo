import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import moment from 'moment';

const HomeBlogPreview = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/api/blog/posts/?ordering=-created_at&page_size=3');
        setPosts(response.data.results || []);
      } catch (err) {
        setPosts([]);
      }
    };
    fetchPosts();
  }, []);

  if (!posts.length) return null;

  return (
    <Box sx={{ my: 6 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4, color: 'primary.main', fontWeight: 700 }}>
        Latest Blog Posts
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {posts.map(post => (
          <Grid item xs={12} md={4} key={post.id}>
            <Card component={Link} to={`/blog/${post.slug}`} sx={{ textDecoration: 'none', height: '100%', borderRadius: 3, boxShadow: 3 }}>
              {post.image && (
                <CardMedia component="img" height="180" image={post.image} alt={post.title} sx={{ objectFit: 'cover' }} />
              )}
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {moment(post.created_at).format('MMMM D, YYYY')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.summary || post.content.substring(0, 100)}...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box textAlign="center" mt={4}>
        <Button variant="contained" color="primary" component={Link} to="/blog">
          View All Blog Posts
        </Button>
      </Box>
    </Box>
  );
};

export default HomeBlogPreview;
