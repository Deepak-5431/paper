import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Container,
  Divider,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  Assessment,
  Timeline,
  TrendingUp,
  School,
  EmojiEvents,
  Refresh,
  Home,
  ExitToApp,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#2196F3" },
    secondary: { main: "#6c757d" },
    success: { main: "#4CAF50" },
    error: { main: "#f44336" },
    warning: { main: "#FF9800" },
    info: { main: "#2196F3" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      "@media (max-width:768px)": {
        fontSize: "1.3rem",
      },
    },
    h4: {
      fontSize: "1.3rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.2rem",
      fontWeight: 600,
    },
  },
});

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card
    elevation={3}
    sx={{
      height: "100%",
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      borderLeft: `4px solid ${color}`,
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar sx={{ bgcolor: color, mr: 2 }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>
    </CardContent>
  </Card>
);


const Page6 = () => {
  const navigate = useNavigate();
  const { authState, setAuthState } = useUser();
  
  const [testSummary, setTestSummary] = useState({
    totalTests: 0,
    completedTests: 0,
    averageScore: 0,
    bestScore: 0,
    timeSpent: 0,
    recentTests: []
  });

  const api = React.useMemo(() => {
    const instance = axios.create({ baseURL: "/api" });
    instance.interceptors.request.use((config) => {
      if (authState?.accessToken) {
        config.headers.Authorization = authState.accessToken;
      }
      return config;
    });
    return instance;
  }, [authState]);

  const fetchTestSummary = useCallback(async () => {
    try {
      setTestSummary({
        totalTests: 15,
        completedTests: 12,
        averageScore: 78,
        bestScore: 95,
        timeSpent: 240,
        recentTests: [
          { name: "Mathematics Test", score: 85, date: "2025-08-17" },
          { name: "Science Quiz", score: 92, date: "2025-08-16" },
          { name: "General Knowledge", score: 74, date: "2025-08-15" },
        ]
      });
    } catch (error) {
      console.error("Failed to fetch test summary:", error);
    }
  }, [api]);

  useEffect(() => {
    if (authState?.accessToken) {
      fetchTestSummary();
    }
  }, [authState, fetchTestSummary]);

  const handleLogout = () => {
    // Added confirmation before logging out
    if (window.confirm("Are you sure you want to log out?")) {
      setAuthState(null);
      window.location.href = '/';
    }
  };

  const completionPercentage = testSummary.totalTests > 0 ? (testSummary.completedTests / testSummary.totalTests) * 100 : 0;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflowY: 'auto', 
          bgcolor: 'grey.100'
        }}>
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <Assessment sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Test Summary Dashboard
            </Typography>
            <Button
              color="inherit"
              startIcon={<ExitToApp />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4, mb: 4, background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)" }}>
            <Typography variant="h3" gutterBottom sx={{ color: "primary.main" }}>
              Welcome back, {authState?.user?.name || "Student"}!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Here's your comprehensive test performance summary and analytics.
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Overall Progress: {completionPercentage.toFixed(1)}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={completionPercentage} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Paper>

           <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Tests"
                value={testSummary.totalTests}
                subtitle="Available"
                icon={<School />}
                color={theme.palette.info.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completed"
                value={testSummary.completedTests}
                subtitle="Tests finished"
                icon={<EmojiEvents />}
                color={theme.palette.success.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Average Score"
                value={`${testSummary.averageScore}%`}
                subtitle="Overall performance"
                icon={<TrendingUp />}
                color={theme.palette.warning.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Best Score"
                value={`${testSummary.bestScore}%`}
                subtitle="Highest achievement"
                icon={<Timeline />}
                color={theme.palette.primary.main}
              />
            </Grid>
          </Grid>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <Timeline sx={{ mr: 1 }} />
              Recent Test Performance
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {testSummary.recentTests.length > 0 ? (
              <Grid container spacing={2}>
                {testSummary.recentTests.map((test, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {test.name}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Chip
                            label={`${test.score}%`}
                            color={test.score >= 80 ? "success" : test.score >= 60 ? "warning" : "error"}
                            variant="outlined"
                          />
                          <Typography variant="body2" color="text.secondary">
                            {test.date}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                No recent test data available. Start taking tests to see your performance here!
              </Alert>
            )}
          </Paper>
 
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Home />}
                  onClick={() => navigate('/')}
                  sx={{ py: 1.5 }}
                >
                  Home
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Assessment />}
                  onClick={() => navigate('/select-test')}
                  sx={{ py: 1.5 }}
                >
                  View Tests
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Refresh />}
                  onClick={fetchTestSummary}
                  sx={{ py: 1.5 }}
                >
                  Refresh Data
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  startIcon={<ExitToApp />}
                  onClick={handleLogout}
                  sx={{ py: 1.5 }}
                >
                  Logout
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Page6;