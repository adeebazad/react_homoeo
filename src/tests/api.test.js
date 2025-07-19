import axios from 'axios';

// Configure axios instance for testing
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true
});

const testAPI = async () => {
  try {
    // 1. Test CSRF token endpoint
    console.log('Testing CSRF token endpoint...');
    const csrfResponse = await api.get('/accounts/csrf/');
    console.log('CSRF Token Response:', csrfResponse.status);

    // 2. Test Registration
    console.log('\nTesting registration...');
    const registrationData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test@123456',
      first_name: 'Test',
      last_name: 'User',
      role: 'PATIENT'
    };
    try {
      const registerResponse = await api.post('/accounts/register/', registrationData);
      console.log('Registration Response:', registerResponse.status);
    } catch (error) {
      console.log('Registration error (might be normal if user exists):', error.response?.status);
    }

    // 3. Test Login
    console.log('\nTesting login...');
    const loginResponse = await api.post('/accounts/token/', {
      username: 'testuser',
      password: 'Test@123456'
    });
    console.log('Login Response:', loginResponse.status);
    const token = loginResponse.data.access;

    // Set token for subsequent requests
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // 4. Test Profile
    console.log('\nTesting profile endpoint...');
    const profileResponse = await api.get('/accounts/profile/');
    console.log('Profile Response:', profileResponse.status);

    // 5. Test Blog Posts
    console.log('\nTesting blog posts endpoint...');
    const blogsResponse = await api.get('/blog/');
    console.log('Blog Posts Response:', blogsResponse.status);

    // 6. Test Appointments
    console.log('\nTesting appointments endpoint...');
    const appointmentsResponse = await api.get('/appointments/');
    console.log('Appointments Response:', appointmentsResponse.status);

    // 7. Test Patient Records
    console.log('\nTesting patient records endpoint...');
    const patientRecordsResponse = await api.get('/patient-records/');
    console.log('Patient Records Response:', patientRecordsResponse.status);

    console.log('\nAll tests completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
  }
};

// Run tests
testAPI();
