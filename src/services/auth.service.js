import api from './api';
import { getCookie } from '../utils/cookies';

// Fetch CSRF token
const fetchCsrfToken = async () => {
  try {
    const response = await api.get('/api/accounts/csrf/');
    await new Promise(resolve => setTimeout(resolve, 100));
    return response;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

// Register new user
const register = async (userData) => {
  try {
    await fetchCsrfToken();

    const requiredData = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'PATIENT',
      first_name: userData.firstName || '',
      last_name: userData.lastName || ''
    };

    const response = await api.post('/api/accounts/register/', requiredData, {
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      }
    });

    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Login and store JWT tokens
const login = async (credentials) => {
  await fetchCsrfToken();

  try {
    const response = await api.post('/api/accounts/token/', credentials, {
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      }
    });

    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Get user profile
      const userResponse = await api.get('/api/accounts/profile/', {
        headers: {
          'Authorization': `Bearer ${response.data.access}`
        }
      });

      return {
        ...response.data,
        user: userResponse.data
      };
    } else {
      throw new Error('No access token received');
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
};

// Get current user profile
const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/accounts/profile/');
    return response.data;
  } catch (error) {
    console.error('Fetch current user error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Refresh JWT access token using refresh token
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await api.post('/api/accounts/token/refresh/', {
      refresh: refreshToken,
    });

    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
    }

    return response.data;
  } catch (error) {
    logout();
    throw error.response?.data || error.message;
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken,
};

export default authService;
