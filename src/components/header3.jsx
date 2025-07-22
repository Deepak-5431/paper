import { Toolbar, Typography, Button, Box, ThemeProvider, createTheme, AppBar, useMediaQuery, IconButton } from '@mui/material';
import { AccessTime, Fullscreen, Pause, PlayArrow, Menu as MenuIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';

// Define a custom theme to extend or override Material-UI defaults if needed
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Example primary color
    },
    secondary: {
      main: '#dc004e', // Example secondary color
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif', // Using Inter font as per instructions
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Apply rounded corners to buttons
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Apply rounded corners to AppBar for consistent look
          margin: '10px 0', // Add some margin top/bottom for better spacing
          width: 'calc(100% - 20px)', // Adjust width to account for margin
          left: '10px', // Center the app bar
          right: '10px',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Apply rounded corners to Toolbar
        },
      },
    },
  },
});

const Header3 = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Use 'sm' for mobile breakpoint

  // Timer effect
  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isPaused]);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const sections = ['General Intelligence', 'General Awareness', 'Quantitative Ap...', 'English Compr...', 'Reasoning', 'Computer Aptitude'];

  return (
    <ThemeProvider theme={theme}>
      {/* Main container box for the header */}
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100vw' }}>
        <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'black', boxShadow: 3 }}>
          <Toolbar
            sx={{
              display: 'flex',
              flexDirection: 'row', // Main toolbar layout
              justifyContent: 'space-between', // Keep space-between for overall layout
              alignItems: 'center', // Vertically center items
              py: { xs: 1, md: 0 }, // Vertical padding
              px: { xs: 1, md: 2 }, // Horizontal padding
            }}
          >
            {/* Mobile View Specific Layout */}
            {isMobile ? (
  <>
  {/* Fixed menu + timer - OUTSIDE scrollable section */}
  <Box
    sx={{
      position: 'absolute',
      left: 8,
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      zIndex: 10,
      backgroundColor: 'white',
      px: 1,
      py: 0.5,
      borderRadius: 2,
    }}
  >
    <IconButton edge="start" color="inherit">
      <MenuIcon />
    </IconButton>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <AccessTime sx={{ fontSize: '1rem', mr: 0.5 }} />
      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
        {formatTime(timeLeft)}
      </Typography>
    </Box>
  </Box>

  {/* Scrollable button row */}
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      gap: 1,
      ml: 'auto',
      pl: '150px', // Leaves space for fixed timer+menu
      '&::-webkit-scrollbar': { display: 'none' },
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      width: '100%',
    }}
  >
    <Button variant="contained" sx={{ bgcolor: 'grey.700', color: 'white', py: 0.5, px: 1, flexShrink: 0 }}>
      SECTIONS
    </Button>
    {sections.map((section, i) => (
      <Button
        key={i}
        variant={i === 0 ? 'contained' : 'outlined'}
        size="small"
        sx={{
          flexShrink: 0,
          fontSize: '0.75rem',
          px: 1.5,
          py: 0.5,
          borderRadius: 8,
        }}
      >
        {section}
      </Button>
    ))}
  </Box>
</>

) : (
              // Desktop View Layout (remains unchanged)
              <>
                {/* Left section: SECTIONS button and wrapping subjects */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexGrow: 1, // Allow this section to grow on desktop
                  }}
                >
                  <Button variant="contained" sx={{ bgcolor: 'grey.700', color: 'white', py: 1, px: 2 }}>
                    SECTIONS
                  </Button>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      flexWrap: 'wrap', // Allow wrap for desktop view
                      justifyContent: 'flex-start',
                    }}
                  >
                    {sections.map((section, i) => (
                      <Button
                        key={i}
                        variant={i === 0 ? 'contained' : 'outlined'}
                        size="small"
                        sx={{
                          fontSize: '0.75rem',
                          px: 1.5,
                          py: 0.5,
                          minWidth: 'unset',
                        }}
                      >
                        {section}
                      </Button>
                    ))}
                  </Box>
                </Box>

                {/* Right section: Time, Full Screen, Pause/Resume buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexShrink: 0, // Prevent this section from shrinking
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ mr: 1 }} />
                    <Typography variant="h6">{formatTime(timeLeft)}</Typography>
                  </Box>
                  <Button startIcon={<Fullscreen />} sx={{ minWidth: '120px', px: 2, py: 1 }}>
                    Full Screen
                  </Button>
                  <Button startIcon={isPaused ? <PlayArrow /> : <Pause />} onClick={() => setIsPaused(!isPaused)} sx={{ minWidth: '120px', px: 2, py: 1 }}>
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                </Box>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
};

export default Header3;