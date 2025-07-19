import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  CalendarMonth,
  MedicalInformation,
  ArticleOutlined,
  Person,
  Dashboard,
  Logout,
  Update,
  AdminPanelSettings,
  Home,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../logo.png'; // Adjust the path as necessary

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isDoctor = user?.role === 'DOCTOR';

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const commonMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Blog', icon: <ArticleOutlined />, path: '/blog' },
    { text: 'Appointments', icon: <CalendarMonth />, path: '/appointments' },
  ];

  const doctorMenuItems = [
    ...commonMenuItems,
    { text: 'Patient Records', icon: <MedicalInformation />, path: '/medical-records' },
    { text: 'Update Requests', icon: <Update />, path: '/update-requests' },
    { text: 'Create Blog Post', icon: <ArticleOutlined />, path: '/blog/create' },
    { text: 'Admin Panel', icon: <AdminPanelSettings />, path: '/admin' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
  ];

  const patientMenuItems = [
    ...commonMenuItems,
    { text: 'Medical Records', icon: <MedicalInformation />, path: '/medical-records' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
  ];

  const guestMenuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Blog', icon: <ArticleOutlined />, path: '/blog' },
  ];

  const menuItems = user 
    ? (isDoctor ? doctorMenuItems : patientMenuItems)
    : guestMenuItems;

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate(user ? '/dashboard' : '/') }>
            <img src={logo} alt="Dr Azad Homoeopathy Clinic Logo" style={{ height: 40, marginRight: 12 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 700, color: '#388e3c', letterSpacing: 1, display: { xs: 'none', sm: 'block' } }}
            >
              Dr Azad Homoeopathy Clinic
            </Typography>
          </Box>
          {user ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            {user && (
              <>
                <Divider />
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
