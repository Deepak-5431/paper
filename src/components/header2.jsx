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

// ✅ 1. Accept the new `timerColor` prop here
const Header2 = ({ onMenuClick, sections = [], currentSectionName, onSectionClick, timeDisplay, timerColor, isPaused, onPauseToggle }) => {

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);


  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const { authState } = useUser();



  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
      .forEach(event => document.addEventListener(event, handleFullscreenChange));

    return () => {
      ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
        .forEach(event => document.removeEventListener(event, handleFullscreenChange));
    };
  }, []);



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


  const handleSectionButtonClick = (section) => {
    if (onSectionClick) {

      onSectionClick(section.start);
    }
  };



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


              {isDesktop && (
                <>
                  <Button variant="contained" sx={{ bgcolor: 'grey.700', color: 'white' }}>
                    SECTIONS
                  </Button>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {sections.map((section) => (
                      <Button
                        key={section.name}

                        variant={currentSectionName === section.name ? 'contained' : 'outlined'}
                        size="small"
                        sx={{ fontSize: '0.75rem' }}

                        onClick={() => handleSectionButtonClick(section)}
                      >
                        {section.name}
                      </Button>
                    ))}
                  </Box>
                </>
              )}


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

                      variant={currentSectionName === section.name ? 'contained' : 'outlined'}
                      size="small"
                      sx={{
                        flexShrink: 0,
                        fontSize: '0.75rem'
                      }}

                      onClick={() => handleSectionButtonClick(section)}
                    >
                      {section.name}
                    </Button>
                  ))}
                </Box>
              )}
            </Box>


            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
              flexShrink: 0
            }}>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* ✅ 2. Apply the color to the icon */}
                <AccessTime sx={{
                  mr: { xs: 0.5, sm: 1 },
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  color: timerColor
                }} />
                
                {/* ✅ 3. Apply the color to the time display text */}
                <Typography variant="h6" sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 'bold',
                  color: timerColor
                }}>
                  {timeDisplay}
                </Typography>
              </Box>


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
                onClick={onPauseToggle}
                hideTextAt="lg"
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              />
            </Box>
          </Toolbar>
        </AppBar>


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