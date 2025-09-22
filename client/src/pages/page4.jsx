import  { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

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
  Modal,
  useMediaQuery,
  CssBaseline,
  CircularProgress,
  Alert,
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

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
    MuiTableContainer: {
      styleOverrides: {
        root: {
          marginBottom: '30px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
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


const parseSections = (sectionsString) => {
  if (!sectionsString || !sectionsString.trim()) return [];
  try {
    return sectionsString.split('@@@').map(part => {
      const [name, start, end] = part.split('#@#');
      return {
        name: name.trim().replace(/\r\n/g, ''), 
        start: parseInt(start, 10),
        end: parseInt(end, 10),
      };
    });
  } catch (error) {
    console.error("Failed to parse sections string:", error);
    return [];
  }
};


const Page4 = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const { authState } = useUser();

  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(true);

  const currentTheme = useTheme();
  const isTablet = useMediaQuery(currentTheme.breakpoints.down('md'));
  const isMobile = useMediaQuery(currentTheme.breakpoints.down('sm'));

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL, 
    });
    instance.interceptors.request.use(
      (config) => {
        if (authState?.accessToken) {
          config.headers.Authorization = authState.accessToken;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return instance;
  }, [authState?.accessToken]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!authState?.accessToken) {
        setError("You must be logged in to view the summary.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const [paperDetailsRes, questionsRes] = await Promise.all([
          api.get(`/api/testpaper/${paperId}`),
          api.get(`/api/testpaper/questions/${paperId}?isCompleted=1`)
        ]);

        const paperDetails = paperDetailsRes.data;
        const questionsList = questionsRes.data;

        let finalSummary = [];
        const parsedSections = parseSections(paperDetails.sections);

        if (parsedSections.length > 0) {
          const sectionSummaries = parsedSections.reduce((acc, sec) => {
            acc[sec.name] = {
              questions: (sec.end - sec.start + 1),
              answered: 0,
            };
            return acc;
          }, {});

          questionsList.forEach((question, index) => {
            const questionNumber = index + 1;
            const section = parsedSections.find(s => questionNumber >= s.start && questionNumber <= s.end);

            if (section && question.selectedAnswers !== null) {
              sectionSummaries[section.name].answered++;
            }
          });

          finalSummary = Object.entries(sectionSummaries).map(([sectionName, counts]) => ({
            section: sectionName,
            questions: counts.questions,
            answered: counts.answered,
            notAnswered: counts.questions - counts.answered,
            markedForReview: 0, 
            notVisited: 0,       
          }));

        }
        else {
          const totalQuestions = Number(paperDetails.questions) || questionsList.length;
          const answeredCount = questionsList.filter(q => q.selectedAnswers !== null).length;
          const notAnsweredCount = totalQuestions - answeredCount;

          finalSummary.push({
            section: paperDetails.name || "Overall Summary",
            questions: totalQuestions,
            answered: answeredCount,
            notAnswered: notAnsweredCount,
            markedForReview: 0,
            notVisited: 0,
          });
        }

        setSummaryData(finalSummary);

      } catch (err) {
        console.error("Failed to fetch test summary:", err);
        setError(err.response?.data?.message || "An error occurred while fetching the summary.");
      } finally {
        setLoading(false);
      }
    };

    if (paperId && authState?.accessToken) {
      fetchSummary();
    }
  }, [paperId, api, authState]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
        sx={{
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: 'background.paper',
          border: 'none',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
          outline: 'none'
        }}>
          <Typography
            id="success-modal-title"
            variant="h5"
            component="h2"
            sx={{
              mb: 2,
              color: 'success.main',
              fontWeight: 600
            }}
          >
            Success!
          </Typography>
          <Typography
            id="success-modal-description"
            variant="body1"
            sx={{
              mb: 3,
              color: 'text.primary'
            }}
          >
            Test paper has been submitted successfully.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseModal}
            sx={{
              minWidth: 100,
              py: 1
            }}
          >
            Okay
          </Button>
        </Box>
      </Modal>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        paddingTop: '60px' 
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
            marginTop: { xs: '20px', sm: '40px' }
          }}>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {error && (
              <Box sx={{ my: 4, mx: 2 }}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}

            {!loading && !error && summaryData.length > 0 && (
              <>
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
                      {summaryData.map((row) => (
                        <TableRow
                          key={row.section}
                          sx={{
                            backgroundColor: 'inherit',
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
                    onClick={() => navigate(`/result/${paperId}`)} // Ensure you have a result page route
                    sx={{
                      minWidth: { xs: '120px', sm: '150px' }
                    }}
                  >
                    VIEW RESULT
                  </Button>

                  {/*<Button
                    variant="contained"
                    onClick={() => navigate('/result/:paperId')} 
                    sx={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      minWidth: { xs: '120px', sm: '150px' },
                      '&:hover': {
                        backgroundColor: '#5a6268'
                      }
                    }}
                  >
                    Go To Dashboard
                  </Button>*/}
                </Box>
              </>
            )}
            {!loading && !error && summaryData.length === 0 && (
              <Typography variant="h6" sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>
                No summary data is available for this test.
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Page4;