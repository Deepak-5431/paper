import { useUser } from '../context/UserContext';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, ThemeProvider, createTheme, CssBaseline, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, CircularProgress, Alert
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4285f4',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontSize: '1.125rem', fontWeight: 500 },
    h2: {
      fontSize: '1.625rem', fontWeight: 600,
      borderBottom: '1px solid #e0e0e0', paddingBottom: '10px', marginBottom: '15px',
    },
    body1: {}
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: '48px', textTransform: 'none', fontWeight: 500,
          fontSize: '1rem', padding: '10px 20px', whiteSpace: 'nowrap',
        },
      },
    },
  },
});

const Page1 = () => {
  const navigate = useNavigate();
  const { setAuthState } = useUser();

  const [isloggedin, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");

    try {
      const payload = {
        user: loginData.username,
        password: loginData.password,
        fcmId: "60",
        androidVersion: "9",
        androidVersionCode: "28",
        appVersion: "1.0",
        appVersionCode: "1"
      };


      const apiUrl = '/api/login'; 
      const { data } = await axios.post(apiUrl, payload);

      if (data.access_token) {
        const userData = {
          id: data.userId,
          username: data.userName,
          name: `${data.firstName} ${data.lastName}`,
          role: data.loginType,
          school: data.schoolName,
          image: data.loginImage
        };

        setAuthState({
          user: userData,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });

        navigate('/select-test');
        setIsLoggedIn(true);
        setLoginOpen(false);
        setLoginData({ username: "", password: "" });
        setLoginError("");
      } else {
        setLoginError("Invalid credentials or missing token.");
      }
    } catch (err) {
      console.error("Login API call failed:", err.response?.data || err.message || err);
      if (err.response && err.response.data && err.response.data.message) {
        setLoginError(err.response.data.message);
      } else if (err.response && err.response.status) {
        setLoginError(`Login failed with status ${err.response.status}: ${err.response.statusText || 'Unknown error'}`);
      } else if (err.request) {
        setLoginError("Network error: Could not connect to the server.");
      } else {
        setLoginError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Dialog
        open={loginOpen}
        onClose={() => {}}
        disableEscapeKeyDown
      >
        <DialogTitle>Login Required to Access Instructions</DialogTitle>
        <form onSubmit={handleLogin}>
          <DialogContent dividers>
            {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}
            <TextField
              autoFocus
              margin="dense"
              label="Username"
              name="username"
              type="text"
              fullWidth
              variant="outlined"
              value={loginData.username}
              onChange={handleLoginChange}
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Password"
              name="password"
              type="password"
              fullWidth
              variant="outlined"
              value={loginData.password}
              onChange={handleLoginChange}
              disabled={loading}
            />
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Logging In...' : 'Login'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default'
      }}>
        {!loginOpen && <CircularProgress />}
      </Box>
    </ThemeProvider>
  );
};

export default Page1;