import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h3: {  
      fontSize: '1.5rem',
      fontWeight: 600,
      '@media (max-width:768px)': {  
        fontSize: '1.3rem',
      },
      '@media (max-width:480px)': {  
        fontSize: '1.2rem',
      },
    },
    h4: {  
      fontSize: '1.3rem',
      fontWeight: 600,
      '@media (max-width:480px)': {  
        fontSize: '1.2rem',
      },
    },
    h5: {  
      fontSize: '1.2rem',
      fontWeight: 600,
    },
    h6: { 
      fontSize: '1.2rem',
      fontWeight: 500,
      '@media (max-width:480px)': {
        fontSize: '1rem',
      },
    },
    body1: {  
      fontSize: '1rem',
    },
    body2: { 
      fontSize: '0.95rem',
      '@media (max-width:768px)': {
        fontSize: '0.9rem',
      },
    },
  },
  palette: {
    primary: { main: '#0077B6' },
    success: { main: '#28a745' },
    error: { main: '#dc3545' },
    warning: { main: '#fd7e14' },  
    info: { main: '#6f42c1' },  
    secondary: { main: '#2196f3' },  
    text: {
      primary: '#333333',
      secondary: '#2196f3',
      disabled: '#ffffff',  
    },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff',
    },
    divider: '#dddddd',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Roboto, sans-serif',
          color: '#333333',
          backgroundColor: '#f0f2f5',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          backgroundColor: '#ffffff',
          padding: '30px',
          '@media (max-width:768px)': { padding: '20px' },
          '@media (max-width:480px)': { padding: '15px' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #dddddd',
          padding: '15px 20px',
          '@media (max-width:480px)': {
            flexDirection: 'column',
            gap: '10px',
            padding: '12px 15px',
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          paddingLeft: '0px',  
          paddingRight: '0px',  
          minHeight: 'auto',  
          '@media (min-width:600px)': {  
            paddingLeft: '0px',
            paddingRight: '0px',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          marginBottom: '30px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch', // Fixed the kebab-case warning
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#e0f2f7',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#e0f2f7',
          fontWeight: 600,
          color: '#0077B6',
          padding: '14px 16px',
          textAlign: 'center',
          border: '1px solid #dddddd',
          whiteSpace: 'nowrap',
          fontSize: '0.95rem',  
          '@media (max-width:768px)': {
            padding: '10px 12px',
            fontSize: '0.9rem',
          },
        },
        body: {
          padding: '12px 16px',
          textAlign: 'center',
          border: '1px solid #dddddd',
          fontSize: '0.95rem',
          '@media (max-width:768px)': {
            padding: '10px 12px',
            fontSize: '0.9rem',
          },
        },
      },
    },
  },
});

const Page4 = () => {  
  const tableData = [
    { section: 'General Intelligence and Reasoning', questions: 25, answered: 0, notAnswered: 8, markedForReview: 7, notVisited: 17 },
    { section: 'General Awareness', questions: 25, answered: 0, notAnswered: 9, markedForReview: 1, notVisited: 16 },
    { section: 'Quantitative Aptitude', questions: 25, answered: 0, notAnswered: 1, markedForReview: 0, notVisited: 24 },
    { section: 'English Comprehension', questions: 25, answered: 0, notAnswered: 1, markedForReview: 0, notVisited: 24 },
  ];

  const currentTheme = useTheme();
  const isTablet = useMediaQuery(currentTheme.breakpoints.down('md')); 
  const isMobile = useMediaQuery(currentTheme.breakpoints.down('sm'));  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        width: '100%',
        paddingTop: '60px' // Added padding to account for header
      }}>
        <Box sx={{
          flex: 1,  
          padding: { xs: '15px', sm: '25px 20px' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',  
          overflowY: 'auto',
        }}>
          <Paper sx={{ 
            width: '100%', 
            maxWidth: '900px',
            marginTop: { xs: '20px', sm: '40px' } // Adjusted margin for mobile
          }}>
            <Typography 
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
              component="h2" 
              sx={{ 
                marginBottom: { xs: '20px', sm: '25px' }, 
                textAlign: 'center' 
              }}
            >
              Summary
            </Typography>

            <TableContainer>
              <Table sx={{ 
                minWidth: 600, 
                borderCollapse: 'collapse',
                '@media (max-width:600px)': {
                  minWidth: '100%'
                }
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      textAlign: 'left', 
                      minWidth: { xs: '150px', sm: 'auto' } 
                    }}>
                      Section
                    </TableCell>
                    <TableCell align="center" sx={{ minWidth: { xs: '80px', sm: 'auto' } }}>
                      No. of questions
                    </TableCell>
                    <TableCell align="center" sx={{ minWidth: { xs: '70px', sm: 'auto' } }}>
                      Answered
                    </TableCell>
                    <TableCell align="center" sx={{ minWidth: { xs: '90px', sm: 'auto' } }}>
                      Not Answered
                    </TableCell>
                    <TableCell align="center" sx={{ minWidth: { xs: '110px', sm: 'auto' } }}>
                      Marked for Review
                    </TableCell>
                    <TableCell align="center" sx={{ minWidth: { xs: '90px', sm: 'auto' } }}>
                      Not Visited
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow 
                      key={row.section} 
                      sx={{ 
                        backgroundColor: index % 2 === 0 ? 'inherit' : '#f9f9f9',
                        '&:last-child td': {
                          borderBottom: 'none'
                        }
                      }}
                    >
                      <TableCell sx={{ 
                        textAlign: 'left', 
                        fontWeight: 500, 
                        color: 'text.primary',
                        wordBreak: 'break-word'
                      }}>
                        {row.section}
                      </TableCell>
                      <TableCell align="center">{row.questions}</TableCell>
                      <TableCell align="center" sx={{ color: 'success.main', fontWeight: 700 }}>
                        {row.answered}
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'error.main', fontWeight: 700 }}>
                        {row.notAnswered}
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'info.main', fontWeight: 700 }}>
                        {row.markedForReview}
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                        {row.notVisited}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: '10px', sm: '15px', md: '20px' },
              marginTop: '30px',
              flexWrap: 'wrap',
              paddingBottom: '10px'
            }}>
              <Button 
                variant="contained" 
                color="secondary"
                sx={{
                  minWidth: { xs: '120px', sm: '150px' }
                }}
              >
                Tests
              </Button>
              <Button 
                variant="contained" 
                sx={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  minWidth: { xs: '120px', sm: '150px' },
                  '&:hover': {
                    backgroundColor: '#d32f2f'
                  }
                }}
              >
                Submit
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Page4;