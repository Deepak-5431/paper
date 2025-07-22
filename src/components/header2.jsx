import { useUser } from '../context/UserContext';
import {
  Toolbar, Typography, Button, Box, ThemeProvider,
  createTheme, AppBar, useMediaQuery, IconButton,
  Drawer, Avatar, Grid
} from '@mui/material';
import {
  AccessTime, Fullscreen, Pause, PlayArrow,
  Menu as MenuIcon, Bolt, Timer, HourglassEmpty, Block
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  typography: { fontFamily: 'Inter, sans-serif' },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          whiteSpace: 'nowrap',
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
          minHeight: '64px !important',
        },
      },
    },
  },
});

// Helper component for responsive button behavior
const ResponsiveButton = ({ icon, text, hideTextAt = 'lg', ...props }) => {
  const isTextHidden = useMediaQuery(theme.breakpoints.down(hideTextAt));
  return (
    <Button
      startIcon={icon}
      {...props}
      sx={{
        minWidth: isTextHidden ? 'auto' : '120px',
        ...props.sx
      }}
    >
      {!isTextHidden && text}
    </Button>
  );
};

// ✅ UPDATED: Component now accepts props for sections and navigation
const Header2 = ({ onMenuClick, sections = [], currentSectionName, onSectionClick }) => {
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isPaused, setIsPaused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Responsive breakpoints for different screen sizes
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const { authState } = useUser();

  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isPaused]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
      .forEach(event => document.addEventListener(event, handleFullscreenChange));

    return () => {
      ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
        .forEach(event => document.removeEventListener(event, handleFullscreenChange));
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    if (onMenuClick) {
      onMenuClick();
    } else {
      setMobileOpen(open);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err.message));
    } else {
      document.exitFullscreen();
    }
  };

  // ✅ REMOVED: The hardcoded sections array is no longer needed.

  // ✅ NEW: This function will be called when a user clicks a section button.
  const handleSectionButtonClick = (section) => {
    if (onSectionClick) {
      // Pass the STARTING question number of the section.
      onSectionClick(section.start);
    }
  };


  // Render functions for drawer content (no changes needed here)
  const renderUserProfile = () => (
    <Box sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.divider}`
    }}>
      <Avatar
        src={authState.user?.image}
        alt={authState.user?.name}
        sx={{ width: 60, height: 60, bgcolor: 'primary.main', mb: 1, fontSize: '24px', fontWeight: 'bold' }}
      >
        {!authState.user?.image && authState.user?.name?.[0]}
      </Avatar>
      <Typography variant="subtitle1" fontWeight={600}>
        {authState.user?.name || 'Guest User'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {authState.user?.school || ''}
      </Typography>
    </Box>
  );

  const renderQuestionStatusLegend = () => (
    <Box sx={{
      p: 2,
      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      gap: 1
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
          flexBasis: 'calc(50% - 8px)'
        }}>
          <Box sx={{
            width: 16,
            height: 16,
            borderRadius: '3px',
            mr: 1,
            backgroundColor: item.color,
            border: `1px solid ${theme.palette.divider}`
          }} />
          {item.label}
        </Box>
      ))}
    </Box>
  );

  const renderQuestionPalette = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Question Palette
      </Typography>
      <Grid container spacing={1}>
        {Array.from({ length: 24 }, (_, i) => i + 1).map(num => (
          <Grid item xs={2} key={num}>
            <Box sx={{
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
              '&:hover': { backgroundColor: theme.palette.grey[300] }
            }}>
              {num}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderSpeedIndicators = () => (
    <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
      <Typography variant="subtitle2" gutterBottom>Speed Indicators</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
        {[
          { icon: <Bolt fontSize="small" />, label: 'Fast' },
          { icon: <Timer fontSize="small" />, label: 'Medium' },
          { icon: <HourglassEmpty fontSize="small" />, label: 'Slow' },
          { icon: <Block fontSize="small" />, label: 'Not Rated' },
        ].map((item, index) => (
          <Box key={index} sx={{
            backgroundColor: theme.palette.grey[200],
            p: 1,
            borderRadius: "4px",
            fontSize: "12px",
            color: theme.palette.text.secondary,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            minHeight: "60px",
            flex: 1
          }}>
            {item.icon}
            <span>{item.label}</span>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderSidebarButtons = () => (
    <Box sx={{ mt: 'auto', p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
      <Button variant="contained" color="warning" fullWidth sx={{ mb: 1 }}>
        View Question Paper
      </Button>
      <Button
        variant="contained"
        sx={{
          backgroundColor: 'grey.300',
          color: 'text.primary',
          '&:hover': { backgroundColor: 'grey.400' }
        }}
        fullWidth
      >
        Instructions
      </Button>
    </Box>
  );

  const drawerContent = (
    <Box sx={{
      width: 280,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}
      role="presentation">
      {renderUserProfile()}
      {renderQuestionStatusLegend()}
      {renderQuestionPalette()}
      {renderSpeedIndicators()}
      {renderSidebarButtons()}
    </Box>
  );

  // Determine layout based on screen size
  const showCompactLayout = isMobile || isTablet;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '80px' }}>
        <AppBar position="fixed" sx={{ bgcolor: 'white', color: 'black', boxShadow: 3 }}>
          <Toolbar sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            px: { xs: 1, sm: 2 },
            py: { xs: 1, md: 0 }
          }}>

            {/* Left Side - Menu and Sections */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 0,
              flex: showCompactLayout ? 1 : 'auto'
            }}>
              {showCompactLayout && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{ flexShrink: 0 }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              {/* ✅ UPDATED: Dynamic sections for Desktop */}
              {isDesktop && (
                <>
                  <Button variant="contained" sx={{ bgcolor: 'grey.700', color: 'white' }}>
                    SECTIONS
                  </Button>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {sections.map((section) => (
                      <Button
                        key={section.name}
                        // ✅ Highlight the current section
                        variant={currentSectionName === section.name ? 'contained' : 'outlined'}
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                        // ✅ Add click handler
                        onClick={() => handleSectionButtonClick(section)}
                      >
                        {section.name}
                      </Button>
                    ))}
                  </Box>
                </>
              )}

              {/* ✅ UPDATED: Dynamic sections for Mobile/Tablet */}
              {showCompactLayout && (
                <Box sx={{
                  display: 'flex',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  gap: 1,
                  flex: 1,
                  '&::-webkit-scrollbar': { display: 'none' },
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none'
                }}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: 'grey.700',
                      color: 'white',
                      flexShrink: 0,
                      fontSize: '0.75rem'
                    }}
                  >
                    SECTIONS
                  </Button>
                  {sections.map((section) => (
                    <Button
                      key={section.name}
                       // ✅ Highlight the current section
                      variant={currentSectionName === section.name ? 'contained' : 'outlined'}
                      size="small"
                      sx={{
                        flexShrink: 0,
                        fontSize: '0.75rem'
                      }}
                       // ✅ Add click handler
                      onClick={() => handleSectionButtonClick(section)}
                    >
                      {section.name}
                    </Button>
                  ))}
                </Box>
              )}
            </Box>

            {/* Right Side - Timer and Controls */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
              flexShrink: 0
            }}>
              {/* Timer */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime sx={{
                  mr: { xs: 0.5, sm: 1 },
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }} />
                <Typography variant="h6" sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 'bold'
                }}>
                  {formatTime(timeLeft)}
                </Typography>
              </Box>

              {/* Control Buttons */}
              <ResponsiveButton
                icon={<Fullscreen />}
                text={isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}
                onClick={toggleFullScreen}
                hideTextAt="lg"
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              />

              <ResponsiveButton
                icon={isPaused ? <PlayArrow /> : <Pause />}
                text={isPaused ? 'Resume' : 'Pause'}
                onClick={() => setIsPaused(!isPaused)}
                hideTextAt="lg"
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={toggleDrawer(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: 310, boxSizing: 'border-box' } }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};

export default Header2;