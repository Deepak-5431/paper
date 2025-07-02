import {
  Toolbar, Typography, Button, Box, ThemeProvider,
  createTheme, AppBar, useMediaQuery, IconButton,
  Drawer, Avatar, Divider, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Grid
} from '@mui/material';
import {
  AccessTime, Fullscreen, Pause, PlayArrow,
  Menu as MenuIcon, Bolt, Timer, HourglassEmpty, Block, ChevronLeft
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '10px 0',
          width: 'calc(100% - 20px)',
          left: '10px',
          right: '10px',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const Header2 = () => {
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isPaused, setIsPaused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false); // New state for fullscreen
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isPaused]);

  // Effect to update fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // For Safari
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);   // For Firefox
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);   // For IE/Edge

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setMobileOpen(open);
  };

  // Function to toggle fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Request fullscreen
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message} (${err.name})`);
      });
    } else {
      // Exit fullscreen
      document.exitFullscreen();
    }
  };

  const sections = ['General Intelligence', 'General Awareness', 'English Compr...', 'Reasoning', 'Computer Aptitude'];

  // User profile component (same as in right sidebar)
  const renderUserProfile = () => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pb: 2,
      borderBottom: `1px solid ${theme.palette.divider}`,
    }}>
      <Avatar sx={{
        width: 60,
        height: 60,
        bgcolor: 'primary.main',
        mb: 1,
        fontSize: '24px',
        fontWeight: 'bold',
      }}>
        A
      </Avatar>
      <Typography variant="subtitle1" fontWeight={600}>
        Abhishek Singh
      </Typography>
    </Box>
  );

  // Question status legend (same as in right sidebar)
  const renderQuestionStatusLegend = () => (
    <Box sx={{
      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`,
      pt: 2,
      pb: 2,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      gap: 1,
    }}>
      {[
        { label: 'Answered', color: 'success.main' },
        { label: 'Marked', color: 'info.main' },
        { label: 'Not Visited', color: 'grey.300' },
        { label: 'Answered & Marked', color: 'warning.main' },
        { label: 'Not Answered', color: 'error.main' },
        { label: 'Partially Answered', color: 'primary.main' },
      ].map((item, idx) => (
        <Box key={idx} sx={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '13px',
          flexBasis: 'calc(50% - 8px)',
          maxWidth: 'calc(50% - 8px)',
          whiteSpace: 'nowrap',
        }}>
          <Box sx={{
            width: 16,
            height: 16,
            borderRadius: '3px',
            mr: 1,
            backgroundColor: item.color,
            border: `1px solid ${theme.palette.divider}`,
          }} />
          {item.label}
        </Box>
      ))}
    </Box>
  );

  // Question palette (same as in right sidebar)
  const renderQuestionPalette = () => (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Question Palette
      </Typography>
      <Grid container spacing={1}>
        {Array.from({ length: 24 }, (_, i) => i + 1).map(num => (
          <Grid item xs={2} key={num} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '4px',
                fontWeight: 500,
                cursor: 'pointer',
                backgroundColor: theme.palette.grey[200],
                '&:hover': {
                  backgroundColor: theme.palette.grey[300],
                },
              }}
            >
              {num}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Speed indicators (same as in right sidebar)
  const renderSpeedIndicators = () => (
    <Box sx={{
      borderTop: `1px solid ${theme.palette.divider}`,
      pt: 2,
    }}>
      <Typography variant="subtitle2" gutterBottom>
        Speed Indicators
      </Typography>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1,
      }}>
        {[
          { icon: <Bolt fontSize="small" />, label: 'Fast' },
          { icon: <Timer fontSize="small" />, label: 'Medium' },
          { icon: <HourglassEmpty fontSize="small" />, label: 'Slow' },
          { icon: <Block fontSize="small" />, label: 'Not Rated' },
        ].map((item, index) => (
          <Box key={index} sx={{
            backgroundColor: theme.palette.grey[200],
            padding: theme.spacing(1, 0.5),
            borderRadius: "4px",
            fontSize: "12px",
            color: theme.palette.text.secondary,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            minHeight: "60px",
            flex: "1 1 calc(50% - 4px)",
            maxWidth: "calc(50% - 4px)",
            textAlign: "center",
          }}>
            {item.icon}
            <span>{item.label}</span>
          </Box>
        ))}
      </Box>
    </Box>
  );

  // Sidebar buttons (same as in right sidebar)
  const renderSidebarButtons = () => (
    <Box sx={{
      mt: 'auto',
      borderTop: `1px solid ${theme.palette.divider}`,
      pt: 2,
      pb: 4,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
    }}>
      <Button variant="contained" color="warning" fullWidth>
        View Question Paper
      </Button>
      <Button
        variant="contained"
        sx={{
          backgroundColor: 'grey.300',
          color: 'text.primary',
          '&:hover': { backgroundColor: 'grey.400' },
        }}
        fullWidth
      >
        Instructions
      </Button>
    </Box>
  );

  // Mobile drawer content
  const drawerContent = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        overflowY: 'auto'
      }}
      role="presentation"
    >
      {renderUserProfile()}
      {renderQuestionStatusLegend()}
      {renderQuestionPalette()}
      {renderSpeedIndicators()}
      {renderSidebarButtons()}
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '80px' }}>
        <AppBar position="fixed" sx={{ bgcolor: 'white', color: 'black', boxShadow: 3 }}>
          <Toolbar sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: { xs: 1, md: 0 },
            px: { xs: 1, md: 2 },
          }}>
            {isMobile ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0, pr: 1 }}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ flexShrink: 0 }}
                    onClick={toggleDrawer(true)}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <AccessTime sx={{ mr: 0.5, fontSize: '1rem' }} />
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                      {formatTime(timeLeft)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexGrow: 1,
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  gap: 1,
                  '&::-webkit-scrollbar': { display: 'none' },
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}>
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
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexGrow: 1,
                  }}
                >
                  <Button variant="contained" sx={{ bgcolor: 'grey.700', color: 'white', py: 1, px: 2 }}>
                    SECTIONS
                  </Button>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      flexWrap: 'wrap',
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

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexShrink: 0,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ mr: 1 }} />
                    <Typography variant="h6">{formatTime(timeLeft)}</Typography>
                  </Box>
                  <Button
                    startIcon={<Fullscreen />}
                    onClick={toggleFullScreen} // Attach the toggleFullScreen function here
                    sx={{ minWidth: '120px', px: 2, py: 1 }}
                  >
                    {isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}
                  </Button>
                  <Button
                    startIcon={isPaused ? <PlayArrow /> : <Pause />}
                    onClick={() => setIsPaused(!isPaused)}
                    sx={{ minWidth: '120px', px: 2, py: 1 }}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                </Box>
              </>
            )}
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={toggleDrawer(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 310,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};

export default Header2;