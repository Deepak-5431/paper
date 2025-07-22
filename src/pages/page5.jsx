// src/components/Page5.jsx

import React, { useState } from 'react';

// Material-UI Imports
import {
  createTheme,
  ThemeProvider,
  CssBaseline, // For basic resets and global background color
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles'; // For accessing theme breakpoints etc.

// Material-UI Icons
// Make sure to install: npm install @mui/icons-material
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PercentIcon from '@mui/icons-material/Percent';
import DownloadIcon from '@mui/icons-material/Download';

// Fontsource for Roboto font
// Make sure to install: npm install @fontsource/roboto
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// 1. Custom Material-UI Theme
const testAnalysisTheme = createTheme({
  palette: {
    primary: {
      main: '#2196F3', // --primary-blue
      dark: '#1a73e8', // --dark-blue
      light: '#e0f2f7', // --light-blue
    },
    secondary: {
      main: '#9c27b0', // --purple
    },
    text: {
      primary: '#333', // --text-color
      secondary: '#666', // --light-text
      dark: '#555', // --dark-grey-text
      light: '#999', // --light-grey-text
    },
    background: {
      default: '#f9f9f9', // --grey-bg
      paper: '#fff', // --card-bg, --header-bg
    },
    success: {
      main: '#4CAF50', // --green
    },
    error: {
      main: '#f44336', // --red
    },
    warning: {
      main: '#FF9800', // --orange
    },
    info: {
      main: '#007bff', // --link-color (used for general info/links)
    },
    custom: { // Custom colors not part of standard MUI palette
      yellow: '#FFC107',
      border: '#ddd',
      lightGrey: '#eee',
      darkGreyBg: '#f2f2f2',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h2: { // Section titles like "Overall Performance Summary"
        fontSize: '22px',
        fontWeight: 600,
        color: '#555',
        marginBottom: '20px',
        borderBottom: '1px solid #ddd',
        paddingBottom: '10px',
        '@media (max-width:768px)': {
            fontSize: '20px',
        },
    },
    h6: { // Sidebar titles like "Top Rankers"
      fontSize: '18px',
      fontWeight: 600,
      color: '#555',
      marginBottom: '15px',
      borderBottom: '1px solid #ddd',
      paddingBottom: '8px',
      '@media (max-width:480px)': {
        fontSize: '16px',
      },
    },
    subtitle1: { // Metric card values (e.g., "49104 / 50526")
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#555',
      lineHeight: 1.2,
      '@media (max-width:480px)': {
        fontSize: '18px',
      },
      '@media (max-width:360px)': {
        fontSize: '16px',
      },
    },
    body1: { // Default text size
        fontSize: '14px',
        lineHeight: 1.6,
        '@media (max-width:480px)': {
          fontSize: '13px',
        },
    },
    body2: { // Smaller descriptive text
        fontSize: '13px',
        '@media (max-width:480px)': {
          fontSize: '12px',
        },
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true, // Typically removes the default Material-UI button shadow
      },
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent uppercase transformation
          fontWeight: 500,
          borderRadius: '5px',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          padding: '8px 15px', // Default padding for all buttons
          // Specific variants will inherit and override this
          '&.MuiButton-containedPrimary': { // Styles for primary contained buttons
            backgroundColor: '#2196F3',
            color: 'white',
            border: '1px solid #2196F3',
            '&:hover': {
              backgroundColor: '#1a73e8',
              borderColor: '#1a73e8',
            },
          },
        },
      },
    },
    MuiTabs: { // Styles for the Tabs container
      styleOverrides: {
        root: {
          borderBottom: '1px solid #ddd',
          marginBottom: '20px',
          flexWrap: 'wrap',
          // MUI's `scrollButtons="auto"` and `variant="scrollable"` handle overflow naturally
        },
      },
    },
    MuiTab: { // Styles for individual Tab components
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent uppercase transformation
          fontWeight: 500,
          padding: '10px 15px',
          fontSize: '15px',
          color: '#666',
          borderBottom: '2px solid transparent', // Underline is part of the border
          transition: 'all 0.2s ease', // Smooth transition for hover/selection
          whiteSpace: 'nowrap',
          flexShrink: 0,
          '&.Mui-selected': {
            color: '#2196F3',
            borderColor: '#2196F3',
            fontWeight: 600,
          },
          '&:hover:not(.Mui-selected)': {
            color: '#333',
          },
          '@media (max-width:768px)': {
            padding: '8px 12px',
            fontSize: '14px',
          },
        },
      },
    },
    MuiSelect: { // Styles for the Select dropdown
      styleOverrides: {
        select: { // Target the internal select element for padding
          padding: '8px 12px',
          fontSize: '14px',
          borderRadius: '5px', // Needs to be on the root too for full effect
        },
        root: { // Target the root component for border and background
            border: '1px solid #ddd',
            borderRadius: '5px',
            backgroundColor: '#fff',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { // Focus border color
                borderColor: '#2196F3',
            },
        },
      },
    },
    MuiPaper: { // Styles for Paper component (used for cards, table, sidebar)
      styleOverrides: {
        root: {
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)', // Soft shadow
          borderRadius: '8px',
          backgroundColor: '#fff',
        },
      },
    },
    MuiTableCell: { // Styles for table cells
      styleOverrides: {
        root: {
          padding: '12px 15px',
          borderBottom: '1px solid #ddd',
          textAlign: 'left',
          whiteSpace: 'nowrap', // Prevent text wrapping in table cells
          '@media (max-width:768px)': {
            padding: '10px 12px',
            fontSize: '13px',
          },
          '@media (max-width:480px)': {
            padding: '8px 10px',
            fontSize: '12px',
          },
        },
        head: { // Styles for table header cells
          backgroundColor: '#e0f2f7',
          color: '#1a73e8',
          fontWeight: 600,
          fontSize: '15px',
        },
      },
    },
    MuiCssBaseline: { // Global HTML/Body styles
      styleOverrides: {
        body: {
          backgroundColor: '#f9f9f9', // Global background color
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          padding: 0,
          fontSize: '14px',
          lineHeight: 1.6,
          color: '#333',
          overflowX: 'hidden', // Prevent horizontal scroll on body itself
        },
      },
    },
  },
});

// 2. Individual Components

// Fixed "Solutions" Button
const SolutionButton = () => {
  const theme = useTheme(); // Hook to access the defined theme

  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        position: 'fixed',
        zIndex: 1000,
        // Mobile styles (fixed at bottom, full width)
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        borderRadius: 0, // No border-radius for full-width bottom bar
        padding: { xs: '15px 20px', md: '8px 15px' }, // Responsive padding
        fontSize: { xs: '16px', md: '14px' }, // Responsive font size
        justifyContent: 'center', // Center content horizontally
        alignItems: 'center', // Center content vertically
        gap: '8px', // Space between icon and text
        backgroundColor: 'primary.dark', // Dark blue background for mobile button
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', // Shadow above the button
        '&:hover': {
          backgroundColor: 'primary.main', // Primary blue on hover for mobile
        },

        // Desktop styles (fixed at top-right)
        [theme.breakpoints.up('md')]: { // Apply these styles from 'md' breakpoint upwards
          top: 15,
          right: 20,
          bottom: 'auto', // Remove bottom fixed property
          left: 'auto', // Remove left fixed property
          width: 'auto', // Auto width
          borderRadius: '5px', // Standard border-radius
          border: '1px solid',
          borderColor: 'primary.light', // Light blue border
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)', // Different shadow for desktop
          backgroundColor: 'primary.main', // Primary blue for desktop button
          '&:hover': {
            backgroundColor: 'primary.dark', // Dark blue on hover for desktop
            borderColor: 'primary.dark',
          },
        },
      }}
    >
      Solutions
    </Button>
  );
};

// Reusable Metric Card
const MetricCard = ({ icon, value, label, color }) => (
  <Paper
    elevation={2} // Corresponds to box-shadow: 0 1px 4px rgba(0,0,0,0.08); from theme paper style
    sx={{
      p: { xs: '12px 15px', md: '15px 20px' }, // Responsive padding inside card
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px', // Space between icon and text content
      minWidth: { xs: 140, sm: 150, md: 160 }, // Minimum width for cards to prevent squishing
      flexShrink: 0, // Prevent cards from shrinking when space is limited (for horizontal scroll)
      backgroundColor: 'background.paper', // White background
    }}
  >
    <Box sx={{
        fontSize: { xs: '32px', md: '38px' }, // Responsive icon size
        color: color, // Dynamic color based on prop
        lineHeight: 1, // Ensure icon sits well vertically
        flexShrink: 0, // Icon should not shrink
    }}>
        {icon}
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', color: 'text.dark', whiteSpace: 'nowrap' }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
        {label}
      </Typography>
    </Box>
  </Paper>
);

// Overall Performance Section
const OverallPerformance = () => {
  const metrics = [
    { icon: <EmojiEventsIcon />, value: '49104 / 50526', label: 'Rank', color: 'secondary.main' },
    { icon: <StarIcon />, value: '0 / 200', label: 'Score', color: 'warning.main' },
    { icon: <EditIcon />, value: '0 / 100', label: 'Attempted', color: 'primary.main' },
    { icon: <CheckCircleIcon />, value: '0%', label: 'Accuracy', color: 'success.main' },
    { icon: <PercentIcon />, value: '2.82%', label: 'Percentile', color: 'error.main' },
  ];

  return (
    <Box component="section">
      <Typography variant="h2">Overall Performance Summary</Typography>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto', // Enable horizontal scroll for cards on small screens
          flexWrap: { xs: 'nowrap', md: 'wrap' }, // No wrap on mobile, wrap on desktop
          gap: { xs: '12px', sm: '15px' }, // Responsive spacing between cards
          pb: { xs: '5px', sm: '10px' }, // Padding at the bottom for scroll visibility
          scrollPaddingX: { xs: '15px', sm: '20px' }, // Padding for smooth scrolling
          justifyContent: { xs: 'flex-start', md: 'center' }, // Center cards on desktop
          mb: { xs: '20px', sm: '40px' }, // Margin below the section

          // Hide scrollbar directly using sx prop
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none', // IE and Edge
          scrollbarWidth: 'none', // Firefox
        }}
      >
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </Box>
    </Box>
  );
};

// Sectional Summary Table
const SectionalSummary = () => {
  const sections = [
    { name: 'General Intelligence and Reasoning', score: '0 / 50', attempted: '0 / 25', accuracy: '0%', time: '00:04 / 60 min' },
    { name: 'General Awareness', score: '0 / 50', attempted: '0 / 25', accuracy: '0%', time: '00:00 / 60 min' },
    { name: 'Quantitative Aptitude', score: '0 / 50', attempted: '0 / 25', accuracy: '0%', time: '00:00 / 60 min' },
    { name: 'English Comprehension', score: '0 / 50', attempted: '0 / 25', accuracy: '0%', time: '00:00 / 60 min' },
  ];
  return (
    <Box component="section">
      <Typography variant="h2">Sectional Summary</Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          mb: '20px',
          flexWrap: 'wrap', // Allow items to wrap on smaller screens
          justifyContent: { xs: 'flex-start', md: 'center' },
        }}
      >
        <Typography variant="body1">Estimated cutoffs:</Typography>
        <Select
            defaultValue="default"
            size="small"
            sx={{ minWidth: 200 }} // Minimum width for the select dropdown
        >
          <MenuItem value="default">Select your category</MenuItem>
          <MenuItem value="general">General</MenuItem>
          <MenuItem value="obc">OBC</MenuItem>
          <MenuItem value="sc">SC</MenuItem>
          <MenuItem value="st">ST</MenuItem>
        </Select>
      </Box>

      {/* Table container, centered on desktop */}
      <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' } }}>
        <TableContainer
            component={Paper} // Render as a Paper component for elevation/shadow
            elevation={2}
            sx={{
                borderRadius: '8px',
                overflowX: 'auto', // Enable horizontal scroll for table
                minWidth: { xs: '450px', sm: '550px', md: '650px' }, // Ensure table has enough width for content
                mb: '30px', // Margin below the table
                backgroundColor: 'background.paper',

                // Hide scrollbar directly using sx prop
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
            }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {['Section Name', 'Score', 'Attempted', 'Accuracy', 'Time'].map((head) => (
                  <TableCell key={head}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sections.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.score}</TableCell>
                  <TableCell>{row.attempted}</TableCell>
                  <TableCell>{row.accuracy}</TableCell>
                  <TableCell>{row.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

// Chapter Analysis Section with Tabs
const ChapterAnalysis = () => {
  const [tab, setTab] = useState(0); // State to control which tab is active (0: Weak, 1: Uncategorized)

  // Sub-component for individual chapter items
  const ChapterItem = ({ name, percent, answered, notAnswered, marked }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile, row on tablet/desktop
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' }, // Align items
        py: '15px', // Vertical padding
        borderBottom: '1px solid',
        borderColor: 'custom.lightGrey', // Light grey separator
        gap: '15px', // Gap between elements
        flexWrap: 'wrap', // Allow content to wrap
        '&:last-child': { borderBottom: 'none' }, // Remove border for the last item
      }}
    >
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '5px', minWidth: { xs: '180px', sm: '180px', md: '200px' } }}>
        <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.dark' }}>
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Correct % {percent}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={percent} // Progress bar value
          sx={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            backgroundColor: 'custom.lightGrey', // Background color of the bar
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'success.main', // Color of the progress fill
              borderRadius: '3px',
            },
            mt: 0.5
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: '8px', flexShrink: 0, mt: { xs: '10px', sm: 0 } }}>
        {/* Avatars for answered, not answered, marked */}
        <Avatar sx={{ bgcolor: 'success.main', width: 28, height: 28, fontSize: '12px', fontWeight: 'bold', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {answered}
        </Avatar>
        <Avatar sx={{ bgcolor: 'error.main', width: 28, height: 28, fontSize: '12px', fontWeight: 'bold', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {notAnswered}
        </Avatar>
        <Avatar sx={{ bgcolor: 'secondary.main', width: 28, height: 28, fontSize: '12px', fontWeight: 'bold', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {marked}
        </Avatar>
      </Box>
    </Box>
  );

  // Sample data for tabs
  const weakChapters = [
    { name: '1. Awards and Honours', percent: 0, answered: 2, notAnswered: 14, marked: 23 },
    { name: '2. Indian Geography', percent: 0, answered: 7, notAnswered: 8, marked: 12 },
    { name: '3. Sports', percent: 0, answered: 1, notAnswered: 4, marked: 5 },
  ];
  const uncategorizedChapters = [
    { name: '1. Art and Culture', percent: 0, answered: 5, notAnswered: 10, marked: 15 },
    // Add more uncategorized chapters if needed
  ];

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: '20px', md: '20px' },
        borderRadius: '8px',
        backgroundColor: 'background.paper',
        flex: 2, // Allows this paper to take up more space in a flex container
        minWidth: { xs: '100%', sm: '300px' }, // Responsive min-width
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' } }}>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} aria-label="Chapter Analysis Tabs">
          <Tab label="Weak Chapters" />
          <Tab label="Uncategorized Chapters" />
        </Tabs>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'center' } }}>
        {tab === 0 && (
          <Box sx={{ width: '100%', maxWidth: { md: '800px' } }}> {/* Constrain width on larger screens */}
            {weakChapters.map((ch) => (<ChapterItem key={ch.name} {...ch} />))}
          </Box>
        )}
        {tab === 1 && (
          <Box sx={{ width: '100%', maxWidth: { md: '800px' } }}>
            {uncategorizedChapters.map((ch) => (<ChapterItem key={ch.name} {...ch} />))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

// Right Sidebar Content
const RightSidebar = () => {
    const rankers = [
        { rank: 1, name: 'Anjali Sharma', score: '198.5', pic: 'https://via.placeholder.com/40/FFC107/FFFFFF?text=AS' },
        { rank: 2, name: 'Rohan Verma', score: '197.0', pic: 'https://via.placeholder.com/40/2196F3/FFFFFF?text=RV' },
        { rank: 3, name: 'Priya Patel', score: '196.5', pic: 'https://via.placeholder.com/40/9c27b0/FFFFFF?text=PP' },
    ];
  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: '20px', md: '20px' },
        borderRadius: '8px',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px', // Space between Top Rankers and Pass Guaranteed sections
        flex: 1, // Allows this paper to take up available space in a flex container
        minWidth: { xs: '100%', sm: '280px' }, // Responsive min-width
        alignItems: { xs: 'stretch', md: 'center' }, // Stretch on mobile, center content on desktop
      }}
    >
      <Box sx={{ width: '100%' }}> {/* Ensure content inside is full width */}
        <Typography variant="h6" sx={{ textAlign: { xs: 'left', md: 'center' } }}>
          Top Rankers
        </Typography>
        <List disablePadding sx={{ width: '100%', maxWidth: { md: '300px' } }}> {/* Constrain list width on larger screens */}
          {rankers.map((ranker) => (
            <ListItem
              key={ranker.rank}
              disableGutters // Remove default horizontal padding
              sx={{
                mb: '15px', // Margin bottom for each list item
                '&:last-child': { mb: 0 }, // No margin for the last item
                justifyContent: { xs: 'flex-start', md: 'center' }
              }}
            >
              <Typography sx={{ mr: '10px', fontWeight: 'bold', color: 'primary.main', minWidth: '25px', textAlign: 'right' }}>
                #{ranker.rank}
              </Typography>
              <ListItemAvatar>
                <Avatar alt={ranker.name} src={ranker.pic} sx={{ width: { xs: 35, md: 40 }, height: { xs: 35, md: 40 }, flexShrink: 0 }} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: { xs: '13px', md: '14px' } }}>{ranker.name}</Typography>}
                secondary={<Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '12px', md: '13px' } }}>Score: {ranker.score}</Typography>}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" sx={{ textAlign: { xs: 'left', md: 'center' } }}>
          Pass Guaranteed
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: '15px', textAlign: { xs: 'left', md: 'center' } }}>
          Download the app to get access to 1000+ Mock Tests
        </Typography>
        <Box sx={{ display: 'flex', gap: '10px', mb: '15px', flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'center' } }}>
            {/* Placeholder images for app stores */}
            <img src="https://via.placeholder.com/120x40?text=Play+Store" alt="Play Store" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            <img src="https://via.placeholder.com/120x40?text=App+Store" alt="App Store" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
        </Box>
        <TextField fullWidth label="Enter Phone Number" variant="outlined" size="small" type="tel" sx={{ mb: '15px' }} />
        <Button fullWidth variant="contained">
          <DownloadIcon sx={{ mr: 1 }} /> Get App Link
        </Button>
      </Box>
    </Paper>
  );
};

// 3. Main Page Component
const Page5 = () => {
  return (
    // ThemeProvider applies the custom theme to all Material-UI components within it
    <ThemeProvider theme={testAnalysisTheme}>
      {/* CssBaseline applies global CSS resets (like box-sizing, etc.) and global body background */}
      <CssBaseline />

      {/* The fixed "Solutions" button */}
      <SolutionButton />

      <Box
        sx={{
          flexGrow: 1, // Allows this Box to take up available vertical space
          display: 'flex',
          flexDirection: 'column', // Stack children vertically
          gap: { xs: '20px', sm: '25px', md: '30px' }, // Responsive vertical spacing between sections
          maxWidth: '1200px', // Max width for the entire content block
          mx: 'auto', // Centers the content block horizontally (margin-left/right auto)
          // Responsive horizontal padding
          px: { xs: '15px', sm: '15px', md: '20px', lg: '40px' },
          // Responsive top padding (to account for potential fixed header, and general top spacing)
          pt: {
            xs: '60px', // Enough space for mobile fixed button (if it were a header)
            md: 'calc(70px + 20px)', // Example: if there's a 70px fixed header + 20px spacing
          },
          // Responsive bottom padding (to account for fixed solution button on mobile)
          pb: {
            xs: '80px', // Space for the fixed solution button at the bottom
            md: '40px', // Standard bottom padding for desktop
          },
        }}
      >
        {/* Grid container for the two-column layout */}
        <Grid container spacing={{ xs: 3, md: 4 }}> {/* Responsive spacing between grid items */}
          {/* Left Column (Main Content Area) */}
          <Grid item xs={12} lg={8}> {/* Full width on mobile/tablet, 8/12 width on large screens */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: '20px', sm: '25px', md: '30px' } }}>
              <OverallPerformance />
              <SectionalSummary />
              <ChapterAnalysis />
              {/* Other sections like Rank Predictor, Compare with Topper, etc., would go here */}
            </Box>
          </Grid>

          {/* Right Column (Sidebar) */}
          <Grid item xs={12} lg={4}> {/* Full width on mobile/tablet, 4/12 width on large screens */}
            <RightSidebar />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Page5;