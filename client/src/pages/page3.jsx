import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Radio, FormControlLabel, Select, MenuItem, 
  IconButton, Grid, Paper, Modal, Avatar, Tooltip
} from '@mui/material';
import { 
  Menu as MenuIcon,  Language, Report,  Bolt, Eject,
  Timer, HourglassEmpty, Block, ArrowBack, Sort
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header2 from "../components/header2"
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#007bff',
    },
    error: {
      main: '#f44336',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    info: {
      main: '#9c27b0',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});


const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[100],
  overflow: 'hidden',
}));

const BottomNav = styled(Paper)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.grey[100],
  borderTop: `1px solid ${theme.palette.divider}`,
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  zIndex: 10,
  height: '70px',
  [theme.breakpoints.down('md')]: {
    height: '60px',
    padding: theme.spacing(1),
  },
}));

const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  height: 'calc(100vh - 70px)', 
  marginBottom: '70px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: '100vh',
    marginBottom: 0,
  },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 3,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('md')]: {
    flex: 1,
    width: '100%',
    borderRight: 'none',
  },
}));

const ScrollableContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  padding: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    paddingBottom: '60px',
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
  },
}));

const RightSidebar = styled(Box)(({ theme, open }) => ({
  flex: 1,
  minWidth: '280px',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  [theme.breakpoints.down('md')]: {
    position: 'fixed',
    top: 0,
    right: open ? 0 : '-280px',
    width: '260px',
    height: '100%',
    zIndex: 102,
    boxShadow: theme.shadows[3],
    borderLeft: `1px solid ${theme.palette.divider}`,
    transition: 'right 0.3s ease-in-out',
  },
}));

const SidebarOverlay = styled(Box)(({ theme, open }) => ({
  display: open ? 'flex' : 'none',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 101,
  opacity: open ? 1 : 0,
  visibility: open ? 'visible' : 'hidden',
  transition: 'opacity 0.3s ease-in-out',
}));

const QuestionNumBox = styled(Box)(({ theme, status, current }) => ({
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
  backgroundColor: status === 'correct' ? theme.palette.success.main :
    status === 'marked' ? theme.palette.info.main :
    status === 'unattempted' ? theme.palette.grey[300] :
    status === 'marked-answered' ? theme.palette.warning.main :
    status === 'incorrect' ? theme.palette.error.main :
    status === 'partially-correct' ? theme.palette.primary.main :
    theme.palette.grey[200],
  color: ['correct', 'marked', 'marked-answered', 'incorrect', 'partially-correct'].includes(status) ? 
    theme.palette.common.white : theme.palette.text.primary,
  borderColor: status === 'correct' ? theme.palette.success.main :
    status === 'marked' ? theme.palette.info.main :
    status === 'unattempted' ? theme.palette.grey[300] :
    status === 'marked-answered' ? theme.palette.warning.main :
    status === 'incorrect' ? theme.palette.error.main :
    status === 'partially-correct' ? theme.palette.primary.main :
    theme.palette.divider,
  ...(current && {
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: `0 0 5px rgba(33, 150, 243, 0.5)`,
  }),
  [theme.breakpoints.down('md')]: {
    width: '35px',
    height: '35px',
    fontSize: '13px',
  },
}));

const IndicatorItem = styled(Box)(({ theme }) => ({
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
  fontWeight: "normal",
  "& .MuiSvgIcon-root": {
    color: theme.palette.text.secondary,
    fontSize: "18px",
  },
  [theme.breakpoints.down("md")]: {
    minHeight: "50px",
    padding: "6px 4px",
  },
}));

const PopupMenu = styled(Box)(({ theme, open }) => ({
  display: open ? 'flex' : 'none',
  position: 'absolute',
  bottom: '60px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  borderRadius: '8px',
  padding: theme.spacing(2),
  minWidth: '200px',
  zIndex: 1001,
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

const MenuButton = styled(Button)(({ theme, colorvariant }) => ({
  padding: theme.spacing(1.5, 2.5),
  fontSize: '16px',
  color: theme.palette.common.white,
  borderRadius: '5px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  transition: 'background-color 0.3s, transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  ...(colorvariant === 'red' && {
    background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
    '&:hover': {
      background: 'linear-gradient(135deg, #e55a5a, #e57c49)',
    },
  }),
  ...(colorvariant === 'blue' && {
    background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    '&:hover': {
      background: 'linear-gradient(135deg, #4398e0, #00d4e0)',
    },
  }),
  ...(colorvariant === 'green' && {
    background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
    '&:hover': {
      background: 'linear-gradient(135deg, #27ae60, #219653)',
    },
  }),
  ...(colorvariant === 'yellow' && {
    background: 'linear-gradient(135deg, #f1c40f, #f39c12)',
    '&:hover': {
      background: 'linear-gradient(135deg, #d4ac0d, #d68910)',
    },
  }),
  ...(colorvariant === 'simple' && {
    background: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    textTransform: 'none',
    fontWeight: 'normal',
    '&:hover': {
      background: theme.palette.primary.light,
    },
  }),
  ...(colorvariant === 'simpleRed' && {
    background: theme.palette.error.main,
    color: theme.palette.common.white,
    textTransform: 'none',
    fontWeight: 'normal',
    '&:hover': {
      background: theme.palette.error.dark,
    },
  }),
}));

const Page3 = () => {

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); 
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [questionStatus, setQuestionStatus] = useState({
    1: 'current',
    2: 'correct',
    3: 'marked',
    4: 'marked-answered',
    5: 'unattempted',
    6: 'unattempted',
    7: 'incorrect',
    8: 'unattempted',
    9: 'unattempted',
    10: 'unattempted',
  });

  
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timerInterval);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);






  
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.getElementById('popupMenu');
      const popupBtn = document.querySelector('.popup-btn');
      if (menu && popupBtn && !menu.contains(event.target) && !popupBtn.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  
  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));

    
    if (!questionStatus[questionId] || questionStatus[questionId] === 'unattempted') {
      setQuestionStatus(prev => ({
        ...prev,
        [questionId]: 'correct', 
      }));
    }
  };

  
  const navigateToQuestion = (questionId) => {
    setCurrentQuestion(questionId);
    setQuestionStatus(prev => ({
      ...prev,
      [questionId]: 'current',
      [currentQuestion]: prev[currentQuestion] === 'current' ? 'unattempted' : prev[currentQuestion],
    }));
  };

  
  const markForReview = () => {
    setQuestionStatus(prev => ({
      ...prev,
      [currentQuestion]: prev[currentQuestion] === 'correct' ? 'marked-answered' : 'marked',
    }));
  };

  
  const clearResponse = () => {
    const newAnswers = { ...answers };
    delete newAnswers[currentQuestion];
    setAnswers(newAnswers);
    setQuestionStatus(prev => ({
      ...prev,
      [currentQuestion]: 'unattempted',
    }));
  };

  
  const handleSubmitTest = () => {
    
    setSubmitModalOpen(true);
    
  };

  
  const confirmSubmit = () => {
    
    setSubmitModalOpen(false);
    alert('Test Submitted!');
    navigate('/page4')
  };

  
  const questions = [
    {
      id: 1,
      type: 'MCQ',
      text: 'A sum of money, at simple interest, doubles in 10 years. In how many years will it triple?',
      note: 'Note: You can use the virtual keyboard for numerical input questions.',
      options: ['20 years', '15 years', '30 years', '25 years'],
      marks: { positive: 2, negative: 0.5 },
    },
    {
      id: 2,
      type: 'MCQ',
      text: 'What is the capital of France?',
      options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    },
    {
      id: 3,
      type: 'MCQ',
      text: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    },
    {
      id: 4,
      type: 'MCQ',
      text: 'What is the largest ocean on Earth?',
      options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    },
    {
      id: 5,
      type: 'MCQ',
      text: 'Who painted the Mona Lisa?',
      options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Claude Monet'],
    },
    {
      id: 6,
      type: 'MCQ',
      text: 'Which animal lays the largest eggs?',
      options: ['Hummingbird', 'Ostrich', 'Chicken', 'Eagle'],
    },
    {
      id: 7,
      type: 'MCQ',
      text: 'What is the chemical symbol for water?',
      options: ['O2', 'H2O', 'CO2', 'NaCl'],
    },
    {
      id: 8,
      type: 'MCQ',
      text: 'How many continents are there in the world?',
      options: ['5', '6', '7', '8'],
    },
    {
      id: 9,
      type: 'MCQ',
      text: 'What is the largest planet in our solar system?',
      options: ['Mars', 'Jupiter', 'Saturn', 'Neptune'],
    },
    {
      id: 10,
      type: 'MCQ',
      text: 'Which is the longest river in the world?',
      options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer>
       <Header2/ >
        <MainContainer>
          <LeftPanel>
            <ScrollableContent>

            
             




              {questions.map((question, index) => (
                <Box 
                  key={question.id} 
                  sx={{ 
                    mb: 5,
                    display: currentQuestion === question.id ? 'block' : 'none',
                  }}
                >
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2,
                    pb: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    flexWrap: 'wrap',
                    gap: 1,
                  }}>
                    <Typography variant="h6" fontWeight={600}>
                      Question #{question.id}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      {question.marks && (
                        <Typography variant="body2" color="text.secondary">
                          Marks: <Typography component="span" color="success.main" fontWeight="bold">
                            +{question.marks.positive}
                          </Typography> / <Typography component="span" color="error.main" fontWeight="bold">
                            -{question.marks.negative}
                          </Typography>
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Language fontSize="small" color="action" />
                        <Select
                          size="small"
                          defaultValue="English"
                          sx={{ fontSize: '13px', minWidth: '100px' }}
                        >
                          <MenuItem value="English">English</MenuItem>
                          <MenuItem value="Hindi">Hindi</MenuItem>
                        </Select>
                      </Box>
                      
                      <Button 
                        size="small" 
                        color="primary"
                        sx={{ fontSize: '13px', minWidth: 0 }}
                        startIcon={<Report fontSize="small" />}
                      >
                        Report
                      </Button>
                    </Box>
                  </Box>
                  
                  
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      Type: {question.type}
                    </Typography>
                    
                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                      {question.text}
                    </Typography>
                    
                    {question.note && (
                      <Box sx={{ 
                        fontSize: '13px',
                        color: 'text.secondary',
                        mt: 1,
                        p: 1,
                        borderLeft: `3px solid ${theme.palette.warning.main}`,
                        backgroundColor: '#fffde7',
                        borderRadius: '3px',
                      }}>
                        {question.note}
                      </Box>
                    )}
                    
                    
                    <Box sx={{ mt: 2 }}>
                      {question.options.map((option, idx) => (
                        <FormControlLabel
                          key={idx}
                          control={
                            <Radio 
                              checked={answers[question.id] === option}
                              onChange={() => handleAnswerSelect(question.id, option)}
                              color="primary"
                              size="small"
                            />
                          }
                          label={option}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            mb: 1,
                            '& .MuiTypography-root': { fontSize: '15px' },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              ))}
            </ScrollableContent>
          </LeftPanel>

          
          
          <SidebarOverlay open={sidebarOpen} onClick={toggleSidebar} />
          <RightSidebar open={sidebarOpen}>
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
              
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
                  { label: 'Marked for review', color: 'info.main' },
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
              
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Question Palette
                </Typography>
                
                <Grid container spacing={1}>
                  {Array.from({ length: 24 }, (_, i) => i + 1).map(num => (
                    <Grid item xs={2} key={num} sx={{ minWidth: 0 }}>
                      <QuestionNumBox 
                        status={questionStatus[num] || 'unattempted'}
                        current={currentQuestion === num}
                        onClick={() => navigateToQuestion(num)}
                      >
                        {num}
                      </QuestionNumBox>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Speed Indicators */}
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
                  <IndicatorItem active={false}>
                    <Bolt fontSize="small" />
                    <span>Fast</span>
                  </IndicatorItem>
                  <IndicatorItem active={true}>
                    <Timer fontSize="small" />
                    <span>Medium</span>
                  </IndicatorItem>
                  <IndicatorItem active={false}>
                    <HourglassEmpty fontSize="small" />
                    <span>Slow</span>
                  </IndicatorItem>
                  <IndicatorItem active={false}>
                    <Block fontSize="small" />
                    <span>Not Rated</span>
                  </IndicatorItem>
                </Box>
              </Box>

              {/* Sidebar Buttons */}
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
                  onClick={()=>navigate('/')}
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
            </Box>
          </RightSidebar>
        </MainContainer>

        {/* Footer */}
        <BottomNav elevation={3}>
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            flexGrow: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
            <Button 
              variant="outlined" 
              color='black'
              startIcon={<ArrowBack />}
              disabled={currentQuestion === 1}
              onClick={() => navigateToQuestion(currentQuestion - 1)}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Previous
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={clearResponse}
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                whiteSpace: 'nowrap',
                backgroundColor:'white'
              }}
            >
              Clear Response
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={markForReview}
              
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                whiteSpace: 'nowrap',
              }}
            >
              Mark for review
            </Button>
          </Box>
          
          {/* Mobile popup menu */}
          <Box sx={{ 
            position: 'relative',
            display: { xs: 'block', md: 'none' },
            mr: { xs: 1, sm: 2 },
          }}>
            <Tooltip title="Quick actions">
              <IconButton 
                color="primary" 
                onClick={toggleMenu}
                sx={{ 
                  backgroundColor: 'black',
                  color: 'common.white',
                  marginRight:'50px',
                  '&:hover': { backgroundColor: 'primary.dark' },
                  width: 48,
                  height: 48,
                }}
              >
                <Eject />
              </IconButton>
            </Tooltip>
            
            <PopupMenu id="popupMenu" open={menuOpen}>
              <MenuButton 
                colorvariant="simpleRed"
                onClick={() => {
                  handleSubmitTest();
                  setMenuOpen(false);
                }}
              >
                Submit
              </MenuButton>
              <MenuButton 
                sx={{ color: '#2196f3',
                  backgroundColor: '#ffffff',
                  border: '1px solid #2196f3', }}
                onClick={() => {
                  markForReview();
                  setMenuOpen(false);
                }}
              >
                Mark For Preview
              </MenuButton>
              <MenuButton 
                  sx={{ color: '#2196f3',
                  backgroundColor: '#ffffff',
                  border: '1px solid #2196f3', }}
                onClick={() => {
                  clearResponse();
                  setMenuOpen(false);
                }}
              >
                Clear Response
              </MenuButton>
            </PopupMenu>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 15,
            alignItems: 'center',
          }}>
            <Button 
              variant="contained" 
              color="primary"
              sx={{ 
                mr: { md: 1 },
                whiteSpace: 'nowrap',
              }}
            >
              Save & Next
            </Button>
            
            <Button 
              variant="contained" 
              color="error"
              
              sx={{ 
                display: { xs: 'none', md: 'block' },
                whiteSpace: 'nowrap', marginRight:'30px',
              }}
              onClick={handleSubmitTest}
            >
              Submit Test
            </Button>
          </Box>
        </BottomNav>

        {/* Submit Confirmation Modal */}
        <Modal
          open={submitModalOpen}
          onClose={() => setSubmitModalOpen(false)}
          aria-labelledby="submit-modal-title"
          aria-describedby="submit-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 450 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}>
            <Typography id="submit-modal-title" variant="h6" component="h3" gutterBottom>
              Confirm Submission
            </Typography>
            <Typography id="submit-modal-description" variant="body1" color="text.secondary" paragraph>
              Are you sure you want to submit the test? You won't be able to make any changes after submission.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Button 
                variant="contained" 
                color="error"
                onClick={confirmSubmit}
                sx={{ flex: 1 }}
              >
                Confirm
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setSubmitModalOpen(false)}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default Page3;