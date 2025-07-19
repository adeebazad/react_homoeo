import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import DoctorRoute from './components/common/DoctorRoute';
import Header from './components/common/Header';
import Home from './components/home/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PatientRecord from './components/patients/PatientRecord';
import UpdateRequests from './components/patients/UpdateRequests';
import Appointments from './components/appointments/Appointments';
import BlogPost from './components/blog/BlogPost';
import BlogList from './components/blog/BlogList';
import CreateBlogPost from './components/blog/CreateBlogPost';
import PatientRecordList from './components/patients/PatientRecordList';
import DoctorPatientRecord from './components/patients/DoctorPatientRecord';
import AdminPanel from './components/admin/AdminPanel';
import AdminUsers from './components/admin/AdminUsers';
import Profile from './components/auth/Profile';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#388e3c', // Deep green
      contrastText: '#fff',
    },
    secondary: {
      main: '#43a047', // Lighter green
    },
    background: {
      default: '#e8f5e9', // Soft green background
      paper: '#fff',
    },
    info: {
      main: '#b2dfdb', // Teal accent
    },
    success: {
      main: '#66bb6a', // Success green
    },
    warning: {
      main: '#fffde7', // Soft yellow
    },
    error: {
      main: '#e57373', // Soft red
    },
    text: {
      primary: '#222',
      secondary: '#388e3c',
    },
  },
  typography: {
    fontFamily: 'Quicksand, Roboto, Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: 1 },
    h2: { fontWeight: 700, letterSpacing: 1 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: 'none' },
    body1: { fontSize: 18 },
    body2: { fontSize: 16 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 24px 0 rgba(56, 142, 60, 0.08)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/blog/create" element={
              <DoctorRoute>
                <CreateBlogPost />
              </DoctorRoute>
            } />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/medical-records"
              element={
                <PrivateRoute>
                  <PatientRecord />
                </PrivateRoute>
              }
            />
            <Route
              path="/update-requests"
              element={
                <DoctorRoute>
                  <UpdateRequests />
                </DoctorRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <PrivateRoute>
                  <Appointments />
                </PrivateRoute>
              }
            />
            <Route
              path="/blog/create"
              element={
                <DoctorRoute>
                  <BlogPost isCreate={true} />
                </DoctorRoute>
              }
            />
            <Route
              path="/all-patient-records"
              element={
                <DoctorRoute>
                  <PatientRecordList />
                </DoctorRoute>
              }
            />
            <Route
              path="/patient-record/:patientId"
              element={
                <DoctorRoute>
                  <DoctorPatientRecord />
                </DoctorRoute>
              }
            />
            <Route
              path="/admin-panel"
              element={
                <DoctorRoute>
                  <AdminPanel />
                </DoctorRoute>
              }
            />
            <Route
              path="/admin-users"
              element={
                <DoctorRoute>
                  <AdminUsers />
                </DoctorRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
