import React, { useState, useEffect, useCallback } from 'react';
import {
  Toolbar, Typography, Button, Box, ThemeProvider,
  createTheme, AppBar, useMediaQuery, IconButton,
  Drawer, Avatar, Grid
} from '@mui/material';
import {
  AccessTime, Fullscreen,
  Menu as MenuIcon,
  ArrowBack
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#2196F3' },
    secondary: { main: '#007bff' },
    error: { main: '#f44336' },
    success: { main: '#4CAF50' },
    warning: { main: '#FF9800' },
    info: { main: '#9c27b0' },
  },
  typography: { fontFamily: 'Roboto, sans-serif' },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          whiteSpace: 'nowrap',
          fontSize: '0.75rem',
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
          '@media (min-width: 600px)': {
            padding: '0 16px',
          },
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

const statusColors = {
  'answered': '#4CAF50',
  'marked': '#9c27b0',
  'not-visited': '#e0e0e0',
  'answered-marked': '#FF9800',
  'not-answered': '#f44336',
  'thinking': '#2196F3',
  'partially-answered': '#2196F3',
};

const QuestionNumBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$current',
})(({ theme, status, $current }) => ({
  width: '38px',
  height: '38px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '4px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: status === 'answered' ? theme.palette.success.main :
      status === 'marked' ? theme.palette.info.main :
          status === 'not-visited' ? theme.palette.grey[300] :
              status === 'answered-marked' ? theme.palette.warning.main :
                  status === 'not-answered' ? theme.palette.error.main :
                      status === 'partially-answered' ? theme.palette.primary.main :
                          theme.palette.grey[200],
  color: ['answered', 'marked', 'answered-marked', 'not-answered', 'partially-answered'].includes(status) ?
      theme.palette.common.white : theme.palette.text.primary,
  borderColor: status === 'answered' ? theme.palette.success.main :
      status === 'marked' ? theme.palette.info.main :
          status === 'not-visited' ? theme.palette.grey[300] :
              status === 'answered-marked' ? theme.palette.warning.main :
                  status === 'not-answered' ? theme.palette.error.main :
                      status === 'partially-answered' ? theme.palette.primary.main :
                          theme.palette.divider,
  ...($current && {
      border: `2px solid ${theme.palette.primary.main}`,
      boxShadow: `0 0 5px rgba(33, 150, 243, 0.5)`,
  }),
}));

const Header2 = ({

  sections = [],
  currentQuestionNumber,
  onQuestionSelect,
  currentSectionName,
  onSectionClick,
  timeDisplay,
  timerColor,
  questions = [],
  questionStatus = {},
  authState,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
      .forEach(event => document.addEventListener(event, handleFullscreenChange));

    return () => {
      ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
        .forEach(event => document.removeEventListener(event, handleFullscreenChange));
    };
  }, []);

  const toggleDrawer = useCallback((open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setMobileOpen(open);
  }, []);

  const handleQuestionSelect = (questionNumber) => {
      if (onQuestionSelect) {
          onQuestionSelect(questionNumber);
      }
      if (isMobile || isTablet) {
          setMobileOpen(false);
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

  const renderUserProfile = () => {
    const user = authState?.user;
    if (!user) return null;

    return (
      <Box sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Avatar
          src={user?.image}
          alt={user?.name}
          sx={{ width: 60, height: 60, bgcolor: 'primary.main', mb: 1, fontSize: '24px', fontWeight: 'bold' }}
        >
          {!user?.image && user?.name?.[0]}
        </Avatar>
        <Typography variant="subtitle1" fontWeight={600}>
          {user?.name || 'Guest User'}
        </Typography>
        
      </Box>
    );
  };

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
        { label: 'Answered', color: statusColors['answered'] },
        { label: 'Review', color: statusColors['marked'] },
        { label: 'Not Answered', color: statusColors['not-visited'] },
        { label: 'Answer&Review', color: statusColors['answered-marked'] },
   
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
        {questions.map((q, index) => {
          const questionNumber = index + 1;
          const isCurrent = currentQuestionNumber === questionNumber;
          const status = questionStatus[q.id] || 'not-visited';

          return (
            <Grid item xs={2} key={q.id || index}>
              <QuestionNumBox
                $current={isCurrent}
                status={status}
                onClick={() => handleQuestionSelect(questionNumber)}
              >
                {questionNumber}
              </QuestionNumBox>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  const renderSidebarButtons = () => (
    <Box sx={{ mt: 'auto', p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
      
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
    }}
    role="presentation">
      <Box sx={{ p: 2, display: { md: 'none' } }}>
          <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
          }}>
              <Typography variant="h6" fontWeight={600}>
                  Question Status
              </Typography>
              <IconButton onClick={toggleDrawer(false)} sx={{ display: { md: 'none' } }}>
                  <ArrowBack />
              </IconButton>
          </Box>
      </Box>
      {renderUserProfile()}
      {renderQuestionStatusLegend()}
      {questions.length > 0 && renderQuestionPalette()}
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
              flexShrink: 0,
            }}>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime sx={{
                  mr: { xs: 0.5, sm: 1 },
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  color: timerColor,
                }} />
                <Typography variant="h6" sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 'bold',
                  color: timerColor,
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
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={toggleDrawer(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: 280, boxSizing: 'border-box' } }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};

export default Header2;